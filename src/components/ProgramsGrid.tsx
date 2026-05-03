import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Users, Heart, Tent, Bike, Camera, Share2, Wallet, ArrowRight } from 'lucide-react';

export default function ProgramsGrid() {
  const categories = [
    {
      title: 'Pendidikan & Kaderisasi',
      color: 'from-amber-400 to-orange-500',
      programs: [
        { name: 'Mushaff Tartiilaa', desc: 'Program belajar membaca Al-Qur’an', icon: BookOpen },
        { name: 'Kajian Mushaff', desc: 'Kajian dakwah kreatif dan dinamis', icon: GraduationCap },
        { name: 'Mushaff Training', desc: 'Pelatihan soft skill: public speaking, leadership, dll', icon: Users },
      ]
    },
    {
      title: 'Mushaff Adventure',
      color: 'from-orange-400 to-red-500',
      desc: 'Kegiatan healing + kajian',
      programs: [
        { name: 'Fun Run', icon: Bike },
        { name: 'Touring', icon: Bike },
        { name: 'Tracking & Hiking', icon: Tent },
        { name: 'Camping', icon: Tent },
      ]
    },
    {
      title: 'Komunikasi & Digital',
      color: 'from-yellow-400 to-amber-500',
      programs: [
        { name: 'Mushaff Kominfo', desc: 'Manajemen informasi komunitas', icon: Share2 },
        { name: 'Mushaff Digital', desc: 'Media sosial & konten kreatif', icon: Camera },
      ]
    },
    {
      title: 'Kemanusiaan',
      color: 'from-orange-500 to-amber-600',
      programs: [
        { name: 'Mushaff Peduli', desc: 'Aksi sosial & bantuan', icon: Heart },
        { name: 'Wakaf Qur’an', desc: 'Penyaluran mushaf untuk pelosok', icon: Wallet },
      ]
    }
  ];

  return (
    <section id="program" className="py-10 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-bold mb-3 sm:mb-6 uppercase tracking-wider"
          >
            Aksi Nyata Kami
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">Program Unggulan</h2>
          <p className="text-xs sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Program kami dirancang untuk membentuk generasi muslim yang berilmu, berakhlak, dan berdampak bagi masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${cat.color}`} />
              
              <div className="p-6 sm:p-10 lg:p-12">
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2">{cat.title}</h3>
                    {cat.desc && <p className="text-[10px] sm:text-sm text-primary font-bold uppercase tracking-wider">{cat.desc}</p>}
                  </div>
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {(() => {
                      const Icon = cat.programs[0].icon;
                      return Icon ? <Icon className="w-5 h-5 sm:w-7 sm:h-7" /> : null;
                    })()}
                  </div>
                </div>

                <div className="grid gap-2 sm:gap-4">
                  {cat.programs.map((prog, j) => {
                    const ProgIcon = prog.icon;
                    return (
                      <motion.div
                        key={j}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group/item"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                          {ProgIcon && <ProgIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm">{prog.name}</h4>
                          {prog.desc && <p className="text-[9px] sm:text-xs text-slate-500 leading-tight">{prog.desc}</p>}
                        </div>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 group-hover/item:text-primary transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-20 text-center"
        >
          <button className="px-6 py-3 sm:px-10 sm:py-4 bg-primary text-white rounded-full text-xs sm:text-base font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 sm:gap-3 mx-auto group uppercase tracking-widest">
            Lihat Semua Program
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
