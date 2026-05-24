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

      <ProgramsGrid />
      
      <TeamSection />
      
      <ContactSection />
    </main>
  );
}
