import { motion, AnimatePresence } from 'motion/react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';

export default function PhotoGallerySection() {
  const { settings } = useAppDatabase();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const featured = settings.find(s => s.id === 'featured_gallery');

  if (!featured || !featured.imageUrls || featured.imageUrls.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
          >
            Galeri
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            {featured.title || 'Galeri Kegiatan Kami'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-2 bg-accent mx-auto rounded-full"
          />
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {featured.imageUrls.map((url: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05 }}
              className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 break-inside-avoid cursor-pointer"
              onClick={() => setZoomedImage(url)}
            >
              <img 
                src={url} 
                alt="Galeri" 
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div title="Lihat Foto" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
                  <Maximize2 className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center cursor-default"
            >
              <img
                src={zoomedImage}
                alt="Full Gallery"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
