import { motion } from 'motion/react';
import { Smartphone, Download, BookOpen, Users, Mic2, ArrowRight } from 'lucide-react';

export default function LatestActivities() {
  const activities = [
    {
      title: 'Tadarus on the Street',
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128283/k0w7glbsayvpubhxkd5q.png',
      desc: 'Gerakan membaca Al-Quran di ruang publik untuk mensyiarkan nilai-nilai Islam.',
      icon: Users,
    },
    {
      title: 'Mushaff Tartila',
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128996/wdjzpyfchxojtmjzhmmp.png',
      desc: 'Program intensif belajar tahsin dan tajwid dengan metode yang mudah dipahami.',
      icon: BookOpen,
    },
    {
      title: 'Kajian Mushaff',
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128969/rlpavfc3oqiii20wks9g.png',
      desc: 'Kajian rutin mingguan membahas tafsir dan implementasi Al-Quran dalam kehidupan.',
      icon: Mic2,
    }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
            >
              Update Terbaru
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900">Kegiatan Terhangat</h2>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all group">
            Lihat Semua Kegiatan <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Mushaff Edu App Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-br from-primary to-accent rounded-[3rem] p-8 lg:p-12 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <Smartphone className="w-8 h-8" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">Mushaff Edu</h3>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                Belajar Al-Quran kini lebih mudah dalam genggaman. Download aplikasi Mushaff Edu untuk akses materi pembelajaran interaktif kapan saja.
              </p>
              
              <div className="mt-auto">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.izzhartech.mirc&hl=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all shadow-xl shadow-black/10 group/btn"
                >
                  <Download className="w-5 h-5 group-hover/btn:bounce" />
                  Download di Playstore
                </a>
              </div>

              <div className="mt-12 relative">
                <img 
                  src="https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128227/ykt9iva8qotxeqeyoneh.jpg" 
                  alt="App Mushaff Edu" 
                  className="w-48 mx-auto rounded-3xl shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>

          {/* Other Activities Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {activities.map((act, i) => (
              <motion.div
                key={act.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 ${i === 0 ? 'sm:col-span-2 flex flex-col md:flex-row' : ''}`}
              >
                <div className={`relative overflow-hidden ${i === 0 ? 'md:w-1/2 h-64 md:h-auto' : 'h-48'}`}>
                  <img 
                    src={act.image} 
                    alt={act.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-primary shadow-lg">
                      <act.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className={`p-8 ${i === 0 ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {act.desc}
                  </p>
                  <button className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Selengkapnya <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
