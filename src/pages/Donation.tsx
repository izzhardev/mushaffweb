import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, CheckCircle2, CreditCard, Wallet, Landmark, ShieldCheck, Target } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PROGRAMS } from '../constants';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { cn } from '../lib/utils';

export default function Donation() {
  const { id } = useParams();
  const { campaigns, addDonation } = useAppDatabase();
  const queryParams = new URLSearchParams(window.location.search);
  const referrerUid = queryParams.get('ref');
  
  const [amount, setAmount] = useState<number>(100000);
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0].id);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Check in campaigns first
      const campaign = campaigns.find(c => c.id === id);
      if (campaign) {
        setActiveCampaign(campaign);
        setSelectedProgram(campaign.id);
      } else {
        // Fallback to constants if not found in dynamic campaigns
        const program = PROGRAMS.find(p => p.id === id);
        if (program) {
          setSelectedProgram(program.id);
        }
      }
    }
  }, [id, campaigns]);

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDonation({
        amount,
        donorName: 'Donatur Baik',
        programId: selectedProgram,
        referrerUid: referrerUid || undefined
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding donation", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Terima Kasih!</h2>
          <p className="text-slate-600 mb-8">
            Donasi Anda sebesar <span className="font-bold text-primary">Rp {amount.toLocaleString()}</span> telah kami terima. Semoga menjadi amal jariyah yang terus mengalir.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-primary/90 transition-all"
          >
            Donasi Lagi
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            {activeCampaign ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 mb-8"
              >
                <img 
                  src={activeCampaign.image} 
                  className="w-full h-64 object-cover" 
                  alt={activeCampaign.title}
                  referrerPolicy="no-referrer"
                />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{activeCampaign.title}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-primary">Progress</span>
                      <span className="text-slate-400">
                        {Math.min(Math.round((activeCampaign.currentAmount / activeCampaign.targetAmount) * 100), 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min((activeCampaign.currentAmount / activeCampaign.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Terkumpul</p>
                        <p className="text-lg font-black text-slate-900">Rp {activeCampaign.currentAmount?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target</p>
                        <p className="text-sm font-bold text-slate-600">Rp {activeCampaign.targetAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <h1 className="text-5xl font-bold text-slate-900 mb-6">Berbagi Kebaikan</h1>
                <p className="text-lg text-slate-600 mb-12">
                  Pilih program yang ingin Anda bantu dan tentukan jumlah donasi Anda. Setiap kontribusi sangat berarti untuk memberantas buta huruf Al-Quran.
                </p>
              </>
            )}

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Pembayaran Instan</h4>
                  <p className="text-sm text-slate-500">Mendukung QRIS, E-Wallet, dan Virtual Account.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Keamanan Terjamin</h4>
                  <p className="text-sm text-slate-500">Sistem pembayaran terenkripsi dan aman.</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Pilih Nominal Donasi</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={cn(
                        "py-3 rounded-2xl font-bold text-sm transition-all border-2",
                        amount === preset
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-white border-slate-100 text-slate-600 hover:border-primary/30"
                      )}
                    >
                      Rp {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-lg focus:border-primary focus:ring-0 transition-all"
                    placeholder="Nominal Lainnya"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Pilih Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:border-primary focus:ring-0 transition-all appearance-none"
                >
                  {PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl flex flex-col items-center gap-2 cursor-pointer">
                    <Wallet className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-bold uppercase">QRIS</span>
                  </div>
                  <div className="p-4 border-2 border-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                    <Landmark className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase">Transfer</span>
                  </div>
                  <div className="p-4 border-2 border-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                    <CreditCard className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase">Kartu</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-5 rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    Bayar Sekarang
                    <Heart className="w-5 h-5 fill-current" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
