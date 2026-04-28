import { motion } from 'motion/react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function AboutSection() {
  const { settings } = useAppDatabase();
  const siteSettings = settings.find(s => s.id === 'general') || {};

  const timeline = [
    { year: '2021', event: 'Awal pembentukan komunitas' },
    { year: '2024', event: `Transformasi menjadi ${siteSettings.site_name || "Mushaff Indonesia"}` },
    { year: '2025', event: `Resmi menjadi Yayasan Bhakti ${siteSettings.site_name || "Mushaff Indonesia"}` },
  ];

  return (
    <section id="tentang" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              #Bersama Beramal Saleh
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              Tentang {siteSettings.site_name || "Mushaff Indonesia"}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {siteSettings.site_description || `${siteSettings.site_name || "Mushaff Indonesia"} adalah komunitas pemuda muslim yang bergerak di bidang dakwah, pendidikan, dan kemanusiaan. Berdiri sejak tahun 2021 dan bertransformasi menjadi gerakan nasional, ${siteSettings.site_name || "Mushaff Indonesia"} memiliki tujuan untuk membumikan nilai-nilai Al-Qur’an serta memberantas buta huruf Al-Qur’an, khususnya di kalangan pemuda.`}
            </p>
            
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 font-bold">
                    {item.year}
                  </div>
                  <div className="pt-2">
                    <p className="text-slate-700 font-medium">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${siteSettings.youtube_video_id || "mvupJf_DYyI"}`}
                title={`Tentang ${siteSettings.site_name || "Mushaff Indonesia"}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-500 font-medium">Dedikasi untuk Umat</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
