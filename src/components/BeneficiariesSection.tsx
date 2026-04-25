import { motion } from 'motion/react';
import { Users, Heart, GraduationCap, BookOpen } from 'lucide-react';

export default function BeneficiariesSection() {
  const categories = [
    {
      title: 'Dakwah',
      icon: BookOpen,
      desc: 'Penyebaran nilai Al-Quran dan bantuan sarana ibadah ke pelosok negeri.',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Pendidikan',
      icon: GraduationCap,
      desc: 'Program beasiswa tahfidz dan pembinaan berkelanjutan untuk santri.',
      color: 'bg-accent/10 text-accent'
    },
    {
      title: 'Sosial Kemanusiaan',
      icon: Heart,
      desc: 'Bantuan pangan, kesehatan, dan aksi tanggap bencana untuk masyarakat.',
      color: 'bg-red-50 text-red-500'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Dampak Nyata</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">Jejak Kebaikan Kita</h2>
            <p className="text-slate-600 text-lg">
              Alhamdulillah, Mushaff Indonesia terus bergerak menebar manfaat. Inilah bukti nyata dari setiap butir kebaikan yang Anda percayakan.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Stat Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="absolute top-0 right-0 opacity-10 p-4">
              <Users className="w-64 h-64 -mr-20 -mt-20" />
            </div>
            
            <div className="relative z-10">
              <div className="text-7xl lg:text-9xl font-black mb-6 flex items-baseline gap-2">
                2007+
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Penerima Manfaat</h3>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Telah merasakan dampak positif melalui gerakan dakwah, pendidikan, serta aksi sosial kemanusiaan di berbagai wilayah Indonesia.
              </p>
              
              <div className="h-1.5 w-24 bg-white/30 rounded-full mb-8" />
              
              <div className="flex items-center gap-4 text-sm font-bold text-white/60 uppercase tracking-widest">
                <span>#BersamaBeramalSaleh</span>
              </div>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group bg-slate-50/50"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-110 transition-all duration-500 shadow-sm`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
