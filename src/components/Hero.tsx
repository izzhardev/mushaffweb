import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDatabase } from '../hooks/useAppDatabase';

const MOCK_SLIDES = [
  {
    id: '1',
    title: "Memberantas Buta Huruf Al-Quran di Indonesia",
    subtitle: "Kami berkomitmen untuk memastikan setiap muslim di pelosok negeri dapat membaca, memahami, dan mengamalkan Al-Quran.",
    image: "/prog-1.png",
    cta: "Bantu Sekarang",
    accent: "Pendidikan Al-Quran",
    targetLink: "/donate",
    detailLink: "/about#program"
  },
  {
    id: '2',
    title: "Tebar Mushaf Hingga Pelosok Negeri",
    subtitle: "Distribusi Al-Quran layak pakai untuk masjid, pesantren, dan komunitas muslim yang membutuhkan di daerah terpencil.",
    image: "/prog-2.png",
    cta: "Donasi Mushaf",
    accent: "Distribusi Al-Quran",
    targetLink: "/donate",
    detailLink: "/about#program"
  },
  {
    id: '3',
    title: "Wujudkan Generasi Qurani yang Mandiri",
    subtitle: "Program beasiswa dan pembinaan berkelanjutan untuk mencetak penghafal Al-Quran yang berakhlak mulia.",
    image: "/prog-3.png",
    cta: "Jadi Orang Tua Asuh",
    accent: "Beasiswa Tahfidz",
    targetLink: "/donate",
    detailLink: "/about#program"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slider } = useAppDatabase();
  
  const activeSlides = slider.length > 0 ? slider : MOCK_SLIDES;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  if (activeSlides.length === 0) return null;

  return (
    <section className="relative h-[600px] lg:h-[800px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img
            src={activeSlides[currentSlide].image}
            alt={activeSlides[currentSlide].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold mb-6 uppercase tracking-widest">
              {activeSlides[currentSlide].accent}
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {activeSlides[currentSlide].title}
            </h1>
            
            <p className="text-lg lg:text-xl text-white/80 mb-10 leading-relaxed">
              {activeSlides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={activeSlides[currentSlide].targetLink || '/donate'}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
              >
                {activeSlides[currentSlide].cta || 'Bantu Sekarang'}
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              {activeSlides[currentSlide].detailLink && (
                <Link
                  to={activeSlides[currentSlide].detailLink}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all group"
                >
                  Lihat Detail
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 right-4 sm:right-10 z-30 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === i ? "w-8 bg-primary" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
