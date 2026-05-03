import { motion } from 'motion/react';
import { Heart, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { Link } from 'react-router-dom';

export default function DonationCampaigns() {
  const { campaigns } = useAppDatabase();
  
  // Get active campaigns
  const activeCampaigns = campaigns
    .filter(c => c.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (activeCampaigns.length === 0) return null;

  return (
    <section className="py-10 sm:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-bold mb-3 sm:mb-4 uppercase tracking-wider"
          >
            Mari Berbagi
          </motion.div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4">Salurkan Kebaikan Anda</h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">
            Pilih program penggalangan dana yang ingin Anda bantu dan jadilah bagian dari perubahan positif.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-8">
          {activeCampaigns.map((campaign, i) => {
            const progress = Math.min(Math.round((campaign.currentAmount / campaign.targetAmount) * 100), 100);
            
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-video sm:h-56 overflow-hidden">
                  <img 
                    src={campaign.image || `https://picsum.photos/seed/${campaign.id}/800/600`} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <div className="bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                      <Heart className="w-3 h-3 sm:w-5 sm:h-5 text-red-500 fill-red-500" />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-8 flex flex-col flex-grow">
                  <h3 className="text-xs sm:text-xl font-black text-slate-900 mb-3 sm:mb-6 group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[3.5rem] leading-snug">
                    {campaign.title}
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-8">
                    <div className="flex justify-between text-[10px] sm:text-sm font-bold mb-0.5 sm:mb-1">
                      <span className="text-primary uppercase tracking-wider">Terkumpul</span>
                      <span className="text-slate-400">{progress}%</span>
                    </div>
                    <div className="h-1.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Donasi</span>
                        <span className="text-xs sm:text-lg font-black text-slate-900 leading-none">Rp {campaign.currentAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target</span>
                        <span className="text-sm font-bold text-slate-600">Rp {campaign.targetAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/donate/${campaign.id}`}
                    className="mt-auto w-full bg-primary text-white py-2 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group/btn uppercase tracking-widest"
                  >
                    Donasi
                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            to="/donate"
            className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors"
          >
            Lihat Semua Program <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
