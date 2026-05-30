import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import https from 'https';

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

  // Helper to format sitemap date
  function formatLastmod(data: any): string {
    if (!data) return new Date().toISOString().split('T')[0];
    const dateObj = data.updatedAt || data.createdAt;
    if (!dateObj) return new Date().toISOString().split('T')[0];
    
    if (typeof dateObj.toDate === 'function') {
      return dateObj.toDate().toISOString().split('T')[0];
    }
    
    if (typeof dateObj === 'object' && (dateObj.seconds || dateObj._seconds)) {
      const seconds = dateObj.seconds || dateObj._seconds;
      return new Date(seconds * 1000).toISOString().split('T')[0];
    }
    
    try {
      const d = new Date(dateObj);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch (e) {}
    
    return new Date().toISOString().split('T')[0];
  }

  // Robots.txt dynamic endpoint
  app.get('/robots.txt', (req, res) => {
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
  });

  // Helper to fetch documents reliably via Admin SDK OR Firestore REST API
  async function getSitemapDocuments(collectionName: string): Promise<{ id: string, data: any }[]> {
    const results: { id: string, data: any }[] = [];

    // Attempt 1: Try Firebase Admin SDK
    try {
      const snapshot = await firestore.collection(collectionName).get();
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          data: doc.data()
        });
      });
      if (results.length > 0) {
        console.log(`Fetched ${results.length} documents from ${collectionName} via Admin SDK`);
        return results;
      }
    } catch (err: any) {
      const shortMsg = err?.message ? err.message.split('\n')[0] : 'Permission Denied / Unauthenticated';
      console.log(`[Sitemap] Admin SDK read for ${collectionName} not available (${shortMsg}). Switching to REST API.`);
    }

    // Attempt 2: REST API Fallback
    try {
      const projectId = firebaseConfig.projectId;
      const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
      const apiKey = firebaseConfig.apiKey;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}${apiKey ? `?key=${apiKey}` : ''}`;
      
      const response = await new Promise<any>((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
      });

      if (response && response.error) {
        console.log(`[Sitemap] REST fallback for ${collectionName} returned: ${response.error.message || 'Access Restricted'}`);
      }

      if (response && response.documents) {
        response.documents.forEach((doc: any) => {
          const nameParts = doc.name.split('/');
          const id = nameParts[nameParts.length - 1];
          const fields = doc.fields || {};
          
          const data: any = {};
          Object.keys(fields).forEach((key) => {
            const fieldVal = fields[key];
            if (fieldVal.stringValue !== undefined) {
              data[key] = fieldVal.stringValue;
            } else if (fieldVal.integerValue !== undefined) {
              data[key] = parseInt(fieldVal.integerValue, 10);
            } else if (fieldVal.doubleValue !== undefined) {
              data[key] = parseFloat(fieldVal.doubleValue);
            } else if (fieldVal.booleanValue !== undefined) {
              data[key] = fieldVal.booleanValue;
            } else if (fieldVal.timestampValue !== undefined) {
              data[key] = fieldVal.timestampValue;
            } else {
              data[key] = fieldVal;
            }
          });

          if (!data.createdAt && doc.createTime) {
            data.createdAt = doc.createTime;
          }
          if (!data.updatedAt && doc.updateTime) {
            data.updatedAt = doc.updateTime;
          }

          results.push({ id, data });
        });
        console.log(`Fetched ${results.length} documents from ${collectionName} via REST API fallback`);
      }
    } catch (restErr: any) {
      console.log(`[Sitemap] REST API fallback for ${collectionName} failed: ${restErr?.message || restErr}`);
    }

    return results;
  }

  // Dynamic Sitemap.xml endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const host = req.headers.host;
      const baseUrl = `${protocol}://${host}`;

      const sitemapEntries = [
        { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: new Date().toISOString().split('T')[0] },
        { loc: `${baseUrl}/about`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
        { loc: `${baseUrl}/gallery`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
        { loc: `${baseUrl}/donate`, changefreq: 'daily', priority: '0.9', lastmod: new Date().toISOString().split('T')[0] }
      ];

      // Dynamic custom pages
      const pages = await getSitemapDocuments('pages');
      pages.forEach(doc => {
        const slugOrId = doc.data.slug || doc.id;
        sitemapEntries.push({
          loc: `${baseUrl}/page/${slugOrId}`,
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: formatLastmod(doc.data)
        });
      });

      // Dynamic articles
      let articles = await getSitemapDocuments('articles');
      if (articles.length === 0) {
        // Fallback to initial constants if the DB has no articles yet
        articles = [
          { id: '1', data: { slug: 'zakat-perindustrian-pengertian-jenis-nishab-dan-cara-perhitungannya', createdAt: '2026-01-15T00:00:00.000Z' } },
          { id: '2', data: { slug: 'tebar-mushaf-di-pelosok-negeri', createdAt: '2026-02-10T00:00:00.000Z' } }
        ];
      }
      articles.forEach(doc => {
        const slugOrId = doc.data.slug || doc.id;
        sitemapEntries.push({
          loc: `${baseUrl}/article/${slugOrId}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: formatLastmod(doc.data)
        });
      });

      // Dynamic campaigns
      let campaigns = await getSitemapDocuments('campaigns');
      if (campaigns.length === 0) {
        // Fallback to initial constants if the DB has no campaigns yet
        campaigns = [
          { id: '1', data: { createdAt: new Date().toISOString() } },
          { id: '2', data: { createdAt: new Date().toISOString() } },
          { id: '3', data: { createdAt: new Date().toISOString() } },
          { id: '4', data: { createdAt: new Date().toISOString() } },
          { id: '5', data: { createdAt: new Date().toISOString() } }
        ];
      }
      campaigns.forEach(doc => {
        sitemapEntries.push({
          loc: `${baseUrl}/donate/${doc.id}`,
          changefreq: 'daily',
          priority: '0.9',
          lastmod: formatLastmod(doc.data)
        });
      });

      // Programmatic SEO regional programs sitemap
      const pSeoSlugs = ['wakaf-quran', 'rumah-quran', 'donasi-quran', 'belajar-mengaji'];
      const pSeoCities = ['jakarta', 'bandung', 'surabaya', 'yogyakarta', 'medan', 'makassar', 'semarang', 'palembang', 'malang', 'depok', 'tangerang', 'bekasi', 'bogor', 'solo', 'denpasar'];
      
      pSeoSlugs.forEach(pSlug => {
        pSeoCities.forEach(cSlug => {
          sitemapEntries.push({
            loc: `${baseUrl}/program/${pSlug}/${cSlug}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: new Date().toISOString().split('T')[0]
          });
        });
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

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
