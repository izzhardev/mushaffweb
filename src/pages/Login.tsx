import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { Navigate } from 'react-router-dom';
import { LogIn, Heart } from 'lucide-react';

export default function Login() {
  const { user, loginWithGoogle, loading } = useAuth();
  const { settings } = useAppDatabase();

  const siteSettings = settings.find(s => s.id === 'general') || {
    site_logo: '/logo.png'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="islamic-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" className="text-primary" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-primary/10 p-10 lg:p-12 relative z-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <img 
              src={siteSettings.site_logo || "/logo.png"} 
              alt="Logo" 
              className="w-12 h-12 object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/mushaff-logo/100/100";
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-title">Selamat Datang</h1>
          <p className="text-slate-500">Masuk untuk mengelola donasi dan kontribusi kebaikan Anda.</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl font-bold text-slate-700 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Masuk dengan Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Atau</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Dengan masuk, Anda menyetujui <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> kami.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-bold">
            <Heart className="w-4 h-4 fill-current" />
            <span>#BersamaBeramalSaleh</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
