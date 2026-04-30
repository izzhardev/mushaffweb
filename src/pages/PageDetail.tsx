import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Share2, Facebook, Twitter, Link as LinkIcon, User, Calendar } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function PageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
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
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* HERO */}
      <div className="relative w-full overflow-hidden">
        <div className="h-[60vh] min-h-[450px] lg:h-[75vh]">
          <img 
            src={page.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"} 
            alt={page.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16 pb-24 lg:pb-36">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => navigate(-1)} 
                className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="bg-primary px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                Halaman
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight max-w-4xl drop-shadow-xl">
              {page.title}
            </h1>
          </div>
        </div>

        {/* Fade bottom shadow to blend with content */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-50"></div>
      </div>

      {/* MAIN CONTENT BLOCK */}
      <div className="relative z-10 -mt-12 lg:-mt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              
              {/* SIDEBAR SHARE */}
              <div className="flex lg:flex-col gap-3 lg:sticky lg:top-32 h-fit order-2 lg:order-1">
                <button className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition shadow-sm border border-slate-50">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition shadow-sm border border-slate-50">
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link disalin!');
                  }}
                  className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition shadow-sm border border-slate-50"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* ARTICLE BODY */}
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                <article 
                  className="
                    prose prose-slate 
                    prose-sm sm:prose-base lg:prose-lg 
                    max-w-none
                    prose-headings:font-black 
                    prose-headings:text-slate-900
                    prose-p:text-slate-600 
                    prose-p:leading-relaxed
                    prose-li:text-slate-600
                    prose-ol:list-decimal
                    prose-ul:list-disc
                    prose-img:rounded-2xl 
                    prose-img:max-w-full 
                    prose-img:h-auto
                    prose-a:text-primary 
                    break-words
                  "
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />

                <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium italic">
                    Dikelola oleh {siteSettings.site_name || "Mushaff Indonesia"}
                  </div>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-slate-400 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    Ke Atas
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
