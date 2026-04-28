import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

dotenv.config();

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
admin.initializeApp({
  projectId: firebaseConfig.projectId
});
const firestore = admin.firestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Midtrans Snap
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'PLACEHOLDER_SERVER_KEY',
    clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || 'PLACEHOLDER_CLIENT_KEY'
  });

  // API Route to create Midtrans Transaction
  app.post('/api/payment/create', async (req, res) => {
    try {
      const { donationId, amount, donorName, email, programTitle } = req.body;

      if (!donationId || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const parameter = {
        transaction_details: {
          order_id: `DONATION-${donationId}-${Date.now()}`,
          gross_amount: amount
        },
        customer_details: {
          first_name: donorName,
          email: email
        },
        item_details: [{
          id: donationId,
          price: amount,
          quantity: 1,
          name: programTitle || 'Donasi Online'
        }],
        usage_limit: 1
      };

      const transaction = await snap.createTransaction(parameter);
      res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
    } catch (error: any) {
      console.error('Midtrans Transaction Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Midtrans Notification Webhook
  app.post('/api/payment/notification', async (req, res) => {
    try {
      const statusResponse = await snap.transaction.notification(req.body);
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

      // Extract original donationId from orderId (e.g. "DONATION-123-timestamp")
      const donationId = orderId.split('-')[1];

      if (!donationId) {
        return res.status(400).send('Invalid Order ID');
      }

      const donationRef = firestore.collection('donations').doc(donationId);

      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          // TODO: handle fraud challenge
          await donationRef.update({ status: 'pending', midtransStatus: 'challenge' });
        } else if (fraudStatus === 'accept') {
          await donationRef.update({ status: 'completed', midtransStatus: 'success' });
        }
      } else if (transactionStatus === 'settlement') {
        await donationRef.update({ status: 'completed', midtransStatus: 'settlement' });
      } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
        await donationRef.update({ status: 'failed', midtransStatus: transactionStatus });
      } else if (transactionStatus === 'pending') {
        await donationRef.update({ status: 'pending', midtransStatus: 'pending' });
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Midtrans Notification Error:', error);
      res.status(500).send('Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
