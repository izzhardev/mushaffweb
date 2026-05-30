import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import MetaSEO from '../components/MetaSEO';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { articles, settings } = useAppDatabase();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (slug && articles.length > 0) {
      const found = articles.find(a => a.slug === slug || a.id === slug);
      if (found) setArticle(found);
    }
  }, [slug, articles]);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      let date: Date;
      if (dateValue?.toDate) {
        date = dateValue.toDate();
      } else {
        date = new Date(dateValue);
      }
      if (isNaN(date.getTime())) return 'Format Tanggal Salah';
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Format Tanggal Salah';
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const plainTextDescription = article.content 
    ? article.content.replace(/<[^>]*>/g, '').slice(0, 160) 
    : '';

  const articleFaqs = [
    {
      q: `Bagaimana cara mengamalkan isi artikel "${article.title}" ini?`,
      a: `Anda dapat mengamalkannya dengan membaca secara seksama, membagikan ilmunya kepada keluarga terdekat, serta mendukung program dakwah Al-Qur'an gratis dari Yayasan Mushaff Indonesia.`
    },
    {
      q: 'Bagaimana cara berdonasi untuk mendukung dakwah Al-Qur’an di pelosok?',
      a: 'Anda bisa menekan tombol donasi di atas untuk langsung menyalurkan sedekah jariyah Anda. Seluruh hasil donasi dialokasikan untuk penyediaan mushaf Al-Qur’an dan operasional santri tahfidz pelosok.'
    }
  ];

  const articleBreadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: article.category || 'Artikel', path: '/about' },
    { name: article.title, path: `/article/${article.slug || article.id}` }
  ];

  return (
    <div id="article_detail_page_container" className="bg-slate-50 min-h-screen">
      <MetaSEO 
        title={article.title} 
        description={plainTextDescription} 
        image={article.image}
        type="article"
        schemaTypes={['Article', 'Breadcrumb', 'FAQ']}
        articleMeta={{
          authorName: article.authorName || 'Tim Redaksi Mushaff',
          datePublished: article.createdAt?.toDate ? article.createdAt.toDate().toISOString() : new Date().toISOString(),
          category: article.category || 'Edukasi Islami'
        }}
        breadcrumbList={articleBreadcrumbs}
        faqList={articleFaqs}
      />

      {/* HERO */}
      <div className="relative w-full overflow-hidden">
        <div className="h-[60vh] min-h-[450px] lg:h-[75vh]">
          <img
            src={article.image || `https://picsum.photos/seed/${article.id}/1920/1080`}
            className="w-full h-full object-cover object-center"
            alt={article.title}
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

              {article.category && (
                <span className="bg-primary px-4 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                  {article.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight max-w-4xl drop-shadow-xl break-words whitespace-normal [word-break:normal] [overflow-wrap:break-word] [hyphens:none]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80 text-xs sm:text-sm mt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{article.authorName || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formatDate(article.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-50"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 -mt-12 lg:-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-8 lg:p-12">

            <div className="flex flex-col lg:flex-row gap-8">

              {/* SHARE */}
              <div className="flex lg:flex-col gap-3 lg:sticky lg:top-32 h-fit">
                <button className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition">
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link disalin!');
                  }}
                  className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-primary hover:bg-primary/10 transition"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* ARTICLE */}
              <div className="flex-1 min-w-0">

                <div
                  className="
                  prose prose-slate 
                  prose-sm sm:prose-base lg:prose-lg 
                  max-w-none
                  prose-headings:font-black 
                  prose-headings:text-slate-900
                  prose-p:text-slate-600 
                  prose-p:leading-relaxed
                  prose-p:mb-5
                  prose-li:text-slate-600
                  prose-ol:list-decimal
                  prose-ul:list-disc
                  prose-img:rounded-2xl 
                  prose-img:max-w-full 
                  prose-img:h-auto
                  prose-a:text-primary 
                  break-words whitespace-normal [word-break:normal] [overflow-wrap:break-word] [hyphens:none]
                  "
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* AUTHOR */}
                <div className="mt-16 pt-10 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="font-bold text-slate-900">
                        Ditulis oleh {article.authorName || 'Admin'}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Kontributor {settings.find(s => s.id === 'general')?.site_name || "Mushaff Indonesia"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RELATED */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-8">
            Baca Juga
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles
              .filter(a => a.id !== article.id)
              .slice(0, 3)
              .map(item => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      alt={item.title}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}