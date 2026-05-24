import { motion } from 'motion/react';
import { Smartphone, Download, BookOpen, Users, Mic2, ArrowRight } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { optimizeImage } from '../lib/utils';

export default function LatestActivities() {
  const { settings, activities: dbActivities } = useAppDatabase();
  const siteSettings = settings.find(s => s.id === 'general') || { site_name: 'Platform Donasi' };
  
  const defaultActivities = [
    {
      title: 'Tadarus on the Street',
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128283/k0w7glbsayvpubhxkd5q.png',
      desc: 'Gerakan membaca Al-Quran di ruang publik untuk mensyiarkan nilai-nilai Islam.',
      icon: Users,
      link: '#'
    },
    {
      title: `${siteSettings.site_name.split(' ')[0] || 'Mushaff'} Tartila`,
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128996/wdjzpyfchxojtmjzhmmp.png',
      desc: 'Program intensif belajar tahsin dan tajwid dengan metode yang mudah dipahami.',
      icon: BookOpen,
      link: '#'
    },
    {
      title: `Kajian ${siteSettings.site_name.split(' ')[0] || 'Mushaff'}`,
      image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128969/rlpavfc3oqiii20wks9g.png',
      desc: 'Kajian rutin mingguan membahas tafsir dan implementasi Al-Quran dalam kehidupan.',
      icon: Mic2,
      link: '#'
    }
  ];

  const activities = dbActivities.length > 0 ? dbActivities.map(act => ({
    ...act,
    icon: act.title.toLowerCase().includes('kajian') ? Mic2 : (act.title.toLowerCase().includes('belajar') || act.title.toLowerCase().includes('tahsin') ? BookOpen : Users)
  })) : defaultActivities;

  return (
    <section className="py-10 sm:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-bold mb-3 sm:mb-4 uppercase tracking-wider"
            >
              Update Kabar
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">Kabar Mushaff</h2>
          </div>
          <button className="text-primary font-black text-xs sm:text-base flex items-center gap-2 hover:gap-3 transition-all group uppercase tracking-widest">
            Semua Kabar <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* App Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-br from-primary to-accent rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              
              <h3 className="text-xl sm:text-3xl font-black mb-3 sm:mb-4">{siteSettings.site_name.split(' ')[0] || 'Mushaff'} App</h3>
              <p className="text-white/80 mb-6 sm:mb-8 text-xs sm:text-lg leading-relaxed">
                Belajar bersama kami kini lebih mudah dalam genggaman. Download aplikasi {siteSettings.site_name.split(' ')[0] || 'Mushaff'} untuk akses materi pembelajaran interaktif.
              </p>
              
              <div className="mt-auto">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.izzhartech.mirc&hl=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 bg-white text-primary px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base font-black hover:bg-slate-50 transition-all shadow-xl shadow-black/10 group/btn uppercase tracking-widest"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:bounce" />
                  Download Playstore
                </a>
              </div>

              <div className="mt-8 sm:mt-12 relative">
                <img 
                  src={optimizeImage("https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128227/ykt9iva8qotxeqeyoneh.jpg", { width: 250 })} 
                  alt="App Mushaff Edu" 
                  className="w-32 sm:w-48 mx-auto rounded-3xl shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"
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
                <div className={`relative overflow-hidden ${i === 0 ? 'md:w-1/2 h-44 sm:h-64 md:h-auto' : 'h-36 sm:h-48'}`}>
                  <img 
                    src={optimizeImage(act.image, i === 0 ? { width: 800 } : { width: 400 })} 
                    alt={act.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center text-primary shadow-lg border border-white/50">
                      <act.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 sm:p-8 ${i === 0 ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
                  <h4 className="text-base sm:text-xl font-black text-slate-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">
                    {act.title}
                  </h4>
                  <p className="text-slate-600 text-[10px] sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                    {act.desc}
                  </p>
                  <a 
                    href={act.link || '#'} 
                    className="text-primary text-[10px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 hover:gap-3 transition-all uppercase tracking-widest"
                  >
                    Selengkapnya <ArrowRight className="w-3 h-3 sm:w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
