import { motion } from 'motion/react';
import { CheckCircle2, BookOpen, Users, Globe, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function VisionMission() {
  const missions = [
    { text: 'Meningkatkan minat membaca, memahami dan mengamalkan Al-Qur’an', icon: BookOpen },
    { text: 'Membangun kemandirian pemuda muslim', icon: Users },
    { text: 'Menyebarkan nilai-nilai Al-Qur’an melalui berbagai media', icon: Globe },
    { text: 'Mengembangkan jiwa kepemimpinan berbasis Al-Qur’an', icon: ShieldCheck },
    { text: 'Membangun sinergi dengan berbagai pihak', icon: Zap },
    { text: 'Meningkatkan kesadaran sosial dan kemanusiaan', icon: Heart },
  ];

  return (
    <section className="py-10 sm:py-24 bg-gradient-to-br from-primary to-accent text-white overflow-hidden relative">
      {/* Decorative Islamic Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="islamic-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-3xl lg:text-4xl font-black mb-10 sm:mb-12 uppercase tracking-widest"
          >
            Visi & Misi
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-20 px-4"
          >
            <p className="text-[10px] sm:text-sm uppercase tracking-[0.3em] font-bold text-white/60 mb-3 sm:mb-4">Visi Kami</p>
            <h3 className="text-xl sm:text-4xl lg:text-6xl font-black leading-tight max-w-4xl mx-auto drop-shadow-xl">
              "Membumikan nilai-nilai Al-Qur’an bagi pemuda muslim di Indonesia"
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-5 sm:p-8 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <mission.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-lg font-bold leading-relaxed">
                {mission.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-white/60 italic"
        >
          "Nilai-nilai Al-Qur’an dapat diamalkan oleh siapa saja, tanpa batas usia."
        </motion.div>
      </div>
    </section>
  );
}
