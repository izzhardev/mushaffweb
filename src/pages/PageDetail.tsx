import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Markdown from 'react-markdown';

export default function PageDetail() {
  const { slug } = useParams();
  const { pages, settings } = useAppDatabase();
  const siteSettings = settings.find(s => s.id === 'general') || {};

  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-8">Halaman tidak ditemukan</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
              {page.title}
            </h1>
            
            {page.image && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-video w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-slate-200"
              >
                <img 
                  src={page.image} 
                  alt={page.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
          </header>

          <article className="prose prose-slate prose-lg max-w-none">
            <div className="markdown-body">
              <Markdown>{page.content}</Markdown>
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-slate-400 hover:text-primary transition-colors"
                title="Ke Atas"
              >
                Top
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Bagikan"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
