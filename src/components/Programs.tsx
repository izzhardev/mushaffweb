import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Program } from '../types';
import { PROGRAMS } from '../constants';

export default function Programs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Program Unggulan Kami</h2>
          <p className="text-slate-600 text-lg">
            Melalui berbagai inisiatif, kami berupaya memberdayakan umat dan memberantas buta huruf Al-Quran di seluruh penjuru Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program, index) => {
            const IconComponent = (Icons as any)[program.icon];
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full">
                      {program.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{program.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                    {program.description}
                  </p>
                  <div className="inline-flex items-center text-sm font-bold text-primary group-hover:gap-2 transition-all">
                    Pelajari Selengkapnya
                    <Icons.ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
