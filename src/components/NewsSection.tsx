import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../lib/utils';

export default function NewsSection() {
  const { articles } = useAppDatabase();
  
  // Get latest 3 published articles
  const latestArticles = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      let date: Date;
      if (dateValue?.toDate) {
        date = dateValue.toDate();
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        date = new Date(dateValue);
      }
      
      if (isNaN(date.getTime())) return 'Format Salah';
      
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return 'Format Salah';
    }
  };

  if (latestArticles.length === 0) return null;

  return (
    <section className="py-10 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-bold mb-3 sm:mb-4 uppercase tracking-wider"
            >
              Kabar Terbaru
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">Berita & Inspirasi</h2>
          </div>
          <Link to="/articles" className="text-primary font-black text-xs sm:text-base flex items-center gap-2 hover:gap-3 transition-all group uppercase tracking-widest">
            Semua Berita <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-8">
          {latestArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative aspect-video sm:h-64 overflow-hidden">
                <img 
                  src={optimizeImage(article.image || `https://picsum.photos/seed/${article.id}/800/600`, { width: 500 })} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {article.category && (
                  <div className="absolute top-2 left-2 sm:top-6 sm:left-6">
                    <span className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] sm:text-xs font-bold text-primary shadow-lg flex items-center gap-1 sm:gap-2 uppercase tracking-wider">
                      <Tag className="w-2 h-2 sm:w-3 h-3" />
                      {article.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3 sm:p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 sm:gap-4 text-[8px] sm:text-xs text-slate-400 mb-2 sm:mb-4">
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                
                <h3 className="text-xs sm:text-xl font-black text-slate-900 mb-2 sm:mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                
                <div className="mt-auto pt-3 sm:pt-6 border-t border-slate-50">
                  <Link 
                    to={`/article/${article.slug || article.id}`}
                    className="text-primary text-[10px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 hover:gap-3 transition-all uppercase tracking-widest"
                  >
                    Selengkapnya <ArrowRight className="w-3 h-3 sm:w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
