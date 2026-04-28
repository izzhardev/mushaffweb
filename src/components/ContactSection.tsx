import { motion } from 'motion/react';
import { Phone, Instagram, Youtube, Globe, MapPin, MessageCircle } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function ContactSection() {
  const { settings } = useAppDatabase();
  const siteSettings = settings.find(s => s.id === 'general') || {};

  const contacts = [
    { label: 'Telepon / WA', value: siteSettings.contact_phone || '0851-5546-6551', icon: MessageCircle, link: `https://wa.me/${(siteSettings.contact_phone || '0851-5546-6551').replace(/\D/g, '')}` },
    { label: 'Instagram', value: '@mushaff.indonesia', icon: Instagram, link: 'https://www.instagram.com/mushaff.indonesia' },
    { label: 'Email', value: siteSettings.contact_email || 'info@mushaffindonesia.org', icon: Globe, link: `mailto:${siteSettings.contact_email || 'info@mushaffindonesia.org'}` },
    { label: 'Website', value: (siteSettings.site_name?.toLowerCase().replace(/\s+/g, '') || 'mushaffindonesia') + '.org', icon: Globe, link: '#' },
  ];

  return (
    <section id="kontak" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Hubungi Kami</h2>
            <div className="space-y-8 mb-12">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Alamat</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {siteSettings.address || "Jl. Lapang Tridaya, Desa Cikalong, Kab. Bandung Barat, Jawa Barat"}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {contacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.label}</div>
                      <div className="text-sm font-bold text-slate-700">{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Gabung Bersama Kami
              </button>
              <button className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold hover:bg-primary/5 transition-all">
                Dukung Dakwah Ini
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            {/* Placeholder for Map or Image */}
            <img 
              src="https://res.cloudinary.com/dgezrzjnb/image/upload/v1776780950/cycwu4porqzodhuyf9zo.png" 
              alt="Location" 
              className="w-full h-full object-cover" 
              style={{ objectPosition: 'right' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
