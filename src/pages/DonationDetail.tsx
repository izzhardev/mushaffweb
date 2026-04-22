import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  Heart,
  Phone,
  User as UserIcon,
  ChevronRight,
  MapPin,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { cn } from '../lib/utils';

export default function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const referrerUid = queryParams.get('ref');
  const { campaigns, addDonation } = useAppDatabase();
  const [campaign, setCampaign] = useState<any>(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState<number>(100000);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; amount?: string }>({});
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && campaigns.length > 0) {
      const found = campaigns.find(c => c.id === id);
      if (found) {
        setCampaign(found);
      }
    }
  }, [id, campaigns]);

  const presetAmounts = [50000, 100000, 200000, 500000];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleDonation = async () => {
    setErrors({});
    
    if (!showForm) {
      setShowForm(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    let hasError = false;
    const newErrors: { phone?: string; amount?: string } = {};

    if (!phone) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi';
      hasError = true;
    } else if (phone.length < 10) {
      newErrors.phone = 'Nomor WhatsApp minimal 10 digit';
      hasError = true;
    }
    
    if (!amount || amount < 10000) {
      newErrors.amount = 'Minimal donasi adalah Rp 10.000';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      // Scroll to the first error
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsSubmitting(true);
    try {
      const donationId = await addDonation({
        amount,
        donorName: name || 'Donatur Baik',
        programId: id || 'general',
        phone: phone,
        status: 'pending',
        referrerUid: referrerUid || undefined
      });
      
      if (donationId) {
        navigate(`/donation-confirmation/${donationId}`);
      }
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!campaign && id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Fallback for general donation if no ID
  const displayTitle = campaign?.title || 'Sedekah Jariyah Mushaff Edu';
  const displayImage = campaign?.image || 'https://picsum.photos/seed/mushaff/800/600';
  const displayDesc = campaign?.description || 'Bantu kami mewujudkan generasi penghafal Al-Quran melalui program-program pendidikan dan dakwah Mushaff Edu.';
  const target = campaign?.targetAmount || 100000000;
  const current = campaign?.currentAmount || 0;
  const progress = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900 truncate max-w-[200px]">Detail Donasi</span>
          <button className="p-2 -mr-2 text-slate-600">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto pt-16">
        {/* Hero Section */}
        <div className="bg-white overflow-hidden">
          <img 
            src={displayImage} 
            className="w-full aspect-[4/3] object-cover" 
            alt={displayTitle}
            referrerPolicy="no-referrer"
          />
          <div className="p-6">
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-6">
              {displayTitle}
            </h1>

            {/* Progress Card */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Terkumpul</p>
                  <p className="text-xl font-black text-slate-900">{formatRupiah(current)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target</p>
                  <p className="text-sm font-bold text-slate-600">{formatRupiah(target)}</p>
                </div>
              </div>
              
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold">1.2k Donatur</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold">12 Hari Lagi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-4 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Tentang Program
          </h3>
          <div 
            className="text-slate-600 leading-relaxed text-sm space-y-4"
            dangerouslySetInnerHTML={{ __html: displayDesc }}
          />
          
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Penyelenggara</p>
                <p className="text-sm font-bold text-slate-900">Yayasan Mushaff Edu Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Lokasi</p>
                <p className="text-sm font-bold text-slate-900">Seluruh Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase">Transparansi</p>
                <p className="text-sm font-bold text-green-800">Dana diaudit secara berkala</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Form Section */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              ref={formRef} 
              className="mt-4 bg-white p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Pilih Nominal Donasi</h3>
                {errors.amount && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setAmount(preset);
                      setIsCustomAmount(false);
                    }}
                    className={cn(
                      "py-4 rounded-2xl font-bold text-sm transition-all border-2",
                      !isCustomAmount && amount === preset
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white border-slate-100 text-slate-600 hover:border-primary/30"
                    )}
                  >
                    {formatRupiah(preset)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCustomAmount(true)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all border-2 mb-6",
                  isCustomAmount
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-100 text-slate-600 hover:border-primary/30"
                )}
              >
                Nominal Lainnya
              </button>

              <AnimatePresence>
                {isCustomAmount && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(Number(e.target.value));
                          if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                        }}
                        className={cn(
                          "w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-6 font-bold text-lg focus:ring-0 outline-none",
                          errors.amount ? "border-red-500" : "border-primary"
                        )}
                        placeholder="Masukkan nominal..."
                        autoFocus
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">Minimal donasi Rp 10.000</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Data Donatur</h3>
                  {errors.phone && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Phone className={cn(
                      "absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                      errors.phone ? "text-red-400" : "text-slate-400"
                    )} />
                    <input
                      type="tel"
                      placeholder="Nomor WhatsApp (Wajib)"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                      }}
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none transition-all",
                        errors.phone ? "border-red-100 focus:border-red-500" : "border-slate-100 focus:border-primary"
                      )}
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nama Lengkap (Opsional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Donasi Anda akan disalurkan 100% untuk program ini. Kami menjamin keamanan dan transparansi setiap transaksi.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4 pb-8 md:pb-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex-grow">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Donasi</p>
            <p className="text-lg font-black text-primary">{formatRupiah(amount)}</p>
          </div>
          <button
            onClick={handleDonation}
            disabled={isSubmitting}
            className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Donasi Sekarang
                <Heart className="w-5 h-5 fill-current" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
