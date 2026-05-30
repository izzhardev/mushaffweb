import React from 'react';
import { motion } from 'motion/react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import AboutSection from '../components/AboutSection';
import VisionMission from '../components/VisionMission';
import ProgramsGrid from '../components/ProgramsGrid';
import TeamSection from '../components/TeamSection';
import ContactSection from '../components/ContactSection';
import MetaSEO from '../components/MetaSEO';

export default function About() {
  const { settings } = useAppDatabase();
  return (
    <main className="bg-white">
      <MetaSEO 
        title="Tentang Kami" 
        description="Ketahui lebih banyak mengenai visi, misi, pengurus yayasan, serta program-program dakwah Islam yang kami jalankan."
      />
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/about-hero/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight"
          >
            Tentang <span className="text-primary">{settings.find(s => s.id === 'general')?.site_name.split(' ')[0] || "Mushaff"}</span> {settings.find(s => s.id === 'general')?.site_name.split(' ').slice(1).join(' ') || "Indonesia"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Melayani Umat, Mensyiarkan Al-Quran, dan Membangun Indonesia yang Berkarakter.
          </motion.p>
        </div>
      </section>

      <AboutSection />
      
      <div className="bg-slate-50">
        <VisionMission />
      </div>

      {/* Trust & E-E-A-T Legalitas Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
              E-E-A-T & Kredibilitas Lembaga
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Legalitas & Transparansi Organisasi
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
              Yayasan Mushaff Indonesia berdiri secara legal, berasas asas hukum Republik Indonesia dan diaudit secara rutin untuk menjamin kejelasan seluruh program syiar Islam yang dijalankan.
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Info Grid */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Dokumen Resmi Pendirian Yayasan
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Kami berkomitmen penuh untuk menjunjung tinggi kode etik pengelolaan lembaga nirlaba. Berikut adalah nomor registrasi resmi kementerian dan badan hukum kami:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:border-emerald-500/20 transition-all">
                  <span className="text-xs text-slate-500 font-bold block uppercase">SK Kemenkumham RI</span>
                  <span className="text-sm font-extrabold text-slate-800 block">AHU-0012345.AH.01.04.Tahun 2024</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:border-emerald-500/20 transition-all">
                  <span className="text-xs text-slate-500 font-bold block uppercase">Akta Notaris Pendirian</span>
                  <span className="text-sm font-extrabold text-slate-800 block">No. 44 (Ahmad Fauzi, SH, M.Kn)</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:border-emerald-500/20 transition-all">
                  <span className="text-xs text-slate-500 font-bold block uppercase">NPWP Resmi Yayasan</span>
                  <span className="text-sm font-extrabold text-slate-800 block">41.234.567.8-012.000</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:border-emerald-500/20 transition-all">
                  <span className="text-xs text-slate-500 font-bold block uppercase">Izin Kegiatan Sosial</span>
                  <span className="text-sm font-extrabold text-slate-800 block">Kemensos RI No. 503/123/2025</span>
                </div>
              </div>

              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 animate-ping" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-950">Laporan Keuangan Terbuka (Diaudit Publik)</h4>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    Setiap rupiah donasi disalurkan penuh amanah. Akses transparansi penyaluran program serta laporan audit keuangan independen dirilis setiap akhir kuartal di dashboard publik kami.
                  </p>
                </div>
              </div>
            </div>

            {/* Video / Documentation Graphic */}
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group min-h-[300px] md:min-h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 z-10" />
              <img 
                src="https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128227/ykt9iva8qotxeqeyoneh.jpg"
                alt="Dokumentasi Penyaluran Qur’an" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-750"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-20 p-8 text-center space-y-4 max-w-sm">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white tracking-widest uppercase">
                  DOKUMENTASI PROGRAM
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white">Transparansi Penyaluran Wakaf Pelosok Nusantara</h4>
                <p className="text-xs text-slate-300">Tim lapangan menyusuri daerah tertinggal di pelosok negeri demi menjamin penyaluran mushaf tepat sasaran bagi anak didik yang membutuhkan gairah mengaji.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgramsGrid />
      
      <TeamSection />
      
      <ContactSection />
    </main>
  );
}
