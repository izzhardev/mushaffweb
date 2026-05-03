import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Globe, Heart } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

const MISSIONS = [
  {
    title: "Belajar dari Nol",
    description: "Program pembelajaran untuk pemula yang belum bisa membaca Al-Qur'an sama sekali.",
    icon: BookOpen,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Bimbingan Bertahap",
    description: "Metode belajar terstruktur dari huruf hijaiyah hingga lancar membaca.",
    icon: GraduationCap,
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Akses Mudah untuk Semua",
    description: "Bisa diakses kapan saja dan dimana saja tanpa batasan.",
    icon: Globe,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Gerakan Kebaikan",
    description: "Mengajak lebih banyak orang untuk ikut berkontribusi dalam dakwah literasi Al-Qur'an.",
    icon: Heart,
    color: "bg-red-50 text-red-600"
  }
];

export default function MissionSection() {
  const { settings } = useAppDatabase();
  return (
    <section className="py-10 sm:py-24 bg-emerald-50/30 relative overflow-hidden">
      {/* Subtle Islamic Pattern or Element */}
      <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none text-emerald-900">
        <svg width="600" height="600" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-sm font-bold mb-4 sm:mb-6 uppercase tracking-wider"
          >
            Visi & Misi Kami
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight"
          >
            Misi Kami: Memberantas Buta Huruf Al-Qur'an
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-lg text-slate-600 leading-relaxed"
          >
            {settings.find(s => s.id === 'general')?.site_name || "Platform Donasi"} adalah yayasan yang berfokus membantu masyarakat agar bisa membaca Al-Qur'an dengan baik dan benar.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {MISSIONS.map((mission, index) => (
            <motion.div
              key={mission.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group p-4 sm:p-8 rounded-[2rem] bg-white border border-emerald-100/50 hover:shadow-2xl transition-all duration-500"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${mission.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <mission.icon className="w-5 h-5 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xs sm:text-xl font-black text-slate-900 mb-2 sm:mb-4">{mission.title}</h3>
              <p className="text-slate-600 leading-relaxed text-[10px] sm:text-sm">
                {mission.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400 italic font-medium text-sm">
            "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan." — QS. Al-Alaq: 1
          </p>
        </motion.div>
      </div>
    </section>
  );
}
