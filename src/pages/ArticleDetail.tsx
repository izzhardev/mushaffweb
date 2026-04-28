import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, settings } = useAppDatabase();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (id && articles.length > 0) {
      const found = articles.find(a => a.id === id);
      if (found) {
        setArticle(found);
      }
    }
  }, [id, articles]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={article.image || `https://picsum.photos/seed/${article.id}/1920/1080`} 
          className="w-full h-full object-cover"
          alt={article.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <button 
                onClick={() => navigate(-1)}
                className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {article.category && (
                <span className="bg-primary px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                  {article.category}
                </span>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black text-white leading-tight mb-8"
            >
              {article.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-8 text-white/80 text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{article.authorName || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-1 flex lg:flex-col gap-4 sticky top-32 h-fit">
            <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="lg:col-span-11">
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-3xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="mt-20 pt-12 border-t border-slate-100">
              <div className="bg-slate-50 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="w-12 h-12" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Ditulis oleh {article.authorName || 'Admin'}</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Kontributor aktif {settings.find(s => s.id === 'general')?.site_name || "Mushaff Indonesia"} yang berdedikasi untuk menyebarkan syiar Islam dan inspirasi kebaikan melalui tulisan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Baca Juga</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.filter(a => a.id !== id).slice(0, 3).map((item) => (
              <Link 
                key={item.id} 
                to={`/article/${item.id}`}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
