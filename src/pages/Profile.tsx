import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, MapPin, Mail, Save, Camera, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, userProfile } = useAuth();
  const { updateItem } = useAppDatabase();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    bio: '',
    photoURL: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
        photoURL: userProfile.photoURL || user?.photoURL || ''
      });
    }
  }, [userProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setSuccess(false);
    try {
      await updateItem('users', user.uid, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Silakan login untuk melihat profil</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 lg:mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profil Saya</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
              <div className="relative inline-block mb-6">
                <img 
                  src={formData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName || 'User')}&background=random`} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-900 truncate">{formData.displayName || 'Donatur Baik'}</h2>
              <p className="text-sm text-slate-500 font-medium">{user.email}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-black text-primary">0</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donasi</p>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="text-center">
                  <p className="text-xl font-black text-primary">0</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relawan</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Tips Keamanan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jangan pernah membagikan kata sandi atau informasi pribadi sensitif kepada siapapun. Mushaff Indonesia tidak akan pernah menanyakan hal tersebut.
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 ml-1">* Email tidak dapat diubah karena terhubung dengan Google Auth</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Contoh: 081234567890"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-3 w-5 h-5 text-slate-400" />
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Masukkan alamat tinggal saat ini..."
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Bio Singkat</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-sm focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex-grow bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100"
                  >
                    Profil berhasil diperbarui!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
