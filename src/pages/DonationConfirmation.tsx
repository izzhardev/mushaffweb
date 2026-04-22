import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Wallet, 
  Copy, 
  ExternalLink, 
  ArrowLeft,
  Phone,
  User as UserIcon,
  Heart,
  Download
} from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function DonationConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDonationById, campaigns } = useAppDatabase();
  const [donation, setDonation] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMidtransPayment = async () => {
    if (!donation) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation.id,
          amount: donation.amount,
          donorName: donation.donorName,
          email: donation.email || 'info@mushaffindonesia.org',
          programTitle: campaign?.title || 'Donasi Mushaff Indonesia'
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            navigate('/dashboard');
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            navigate('/dashboard');
          },
          onError: function(result: any) {
            console.error('Payment error:', result);
          },
          onClose: function() {
            console.log('Payment popup closed');
          }
        });
      } else {
        alert('Gagal memproses pembayaran. Hubungi admin.');
      }
    } catch (error) {
      console.error('Midtrans payment error:', error);
      alert('Internal Server Error. Pastikan server sudah dikonfigurasi dengan Midtrans API Keys.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (id) {
      const found = getDonationById(id);
      if (found) {
        setDonation(found);
        const camp = campaigns.find(c => c.id === found.programId);
        setCampaign(camp);
      }
    }
  }, [id, getDonationById, campaigns]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900">Konfirmasi Donasi</span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 text-center shadow-sm border border-slate-100"
        >
          {donation.status === 'completed' ? (
            <>
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Terima Kasih!</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Pembayaran Anda telah kami terima. Semoga menjadi amal jariyah yang pahalanya terus mengalir untuk Anda dan keluarga.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Menunggu Pembayaran</h2>
              <p className="text-slate-500 text-sm">Silakan selesaikan pembayaran Anda agar donasi dapat segera disalurkan.</p>
            </>
          )}
          
          <div className="mt-8 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {donation.status === 'completed' ? 'Jumlah Donasi' : 'Total Tagihan'}
            </p>
            <p className="text-3xl font-black text-primary">{formatRupiah(donation.amount)}</p>
          </div>
        </motion.div>

        {/* Donor Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" />
            Informasi Donatur
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Nama</span>
              <span className="text-slate-900 font-bold text-sm">{donation.donorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">WhatsApp</span>
              <span className="text-slate-900 font-bold text-sm">{donation.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Program</span>
              <span className="text-slate-900 font-bold text-sm truncate max-w-[180px]">
                {campaign?.title || 'Sedekah Jariyah'}
              </span>
            </div>
            {donation.status === 'completed' && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                  Berhasil
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Methods - Only show if not completed */}
        {donation.status !== 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 ml-2">Pilih Metode Pembayaran</h3>
            
            {/* QRIS - Primary */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-primary relative overflow-hidden group active:scale-95 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">QRIS</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Otomatis Terverifikasi</p>
                  </div>
                </div>
                <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">UTAMA</div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <img 
                    src="/qris-min.jpeg" 
                    className="w-40 h-40" 
                    alt="QRIS Code" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <a 
                  href="/qris-min.jpeg" 
                  download="QRIS-Mushaff-Indonesia.jpeg"
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-slate-600 border border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Simpan QRIS
                </a>

                <p className="text-[10px] text-slate-400 text-center font-medium">Scan QRIS menggunakan aplikasi pembayaran pilihan Anda (Gopay, OVO, Dana, LinkAja, Mobile Banking, dll)</p>
              </div>
            </div>

            {/* Midtrans - Secondary */}
            <button 
              onClick={handleMidtransPayment}
              disabled={isProcessing}
              className="w-full bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group active:scale-95 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900">Metode Lainnya</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Virtual Account, Kartu Kredit, dll</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
            </button>
          </motion.div>
        )}

        <div className="pt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 text-sm font-bold hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
