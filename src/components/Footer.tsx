import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function Footer() {
  const { settings } = useAppDatabase();
  const siteSettings = settings.find(s => s.id === 'general') || {
    site_name: 'Mushaff Indonesia',
    site_logo: 'logo.png',
    site_description: 'Pendidikan Al-Quran'
  };

  const nameParts = siteSettings.site_name?.split(' ') || ['Mushaff', 'Indonesia'];
  const firstName = nameParts[0] || 'Mushaff';
  const lastName = nameParts.slice(1).join(' ') || 'Indonesia';

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={siteSettings.site_logo || "/logo.png"} 
                alt={siteSettings.site_name} 
                className="w-10 h-10 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/mushaff-logo/100/100";
                }}
              />
              <span className="text-xl font-bold text-white tracking-tight">{firstName}<span className="text-primary">{lastName}</span></span>
            </Link>
            <p className="text-primary font-bold mb-6 tracking-widest">#Bersama Beramal Saleh</p>
            <p className="text-slate-400 leading-relaxed mb-8">
              {siteSettings.site_description || "Yayasan pemberdayaan umat yang fokus pada pemberantasan buta huruf Al-Quran dan kesejahteraan mustahik di Indonesia."}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/mushaff.indonesia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@MushaffIndonesia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigasi Cepat</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/about#program" className="hover:text-primary transition-colors">Program Utama</Link></li>
              <li><Link to="/about#tim" className="hover:text-primary transition-colors">Tim Kami</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Relawan</Link></li>
              <li><Link to="/about#kontak" className="hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Kontak Kami</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>{siteSettings.address || "Jl. Lapang Tridaya, Desa Cikalong, Kab. Bandung Barat, Jawa Barat"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{siteSettings.contact_phone || "0851 5546 6551"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{siteSettings.contact_email || "mushaffindonesia@gmail.com"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Motto Kami</h4>
            <p className="text-slate-400 mb-6 italic">
              "Terima kasih, dan mari berkolaborasi dalam kebaikan."
            </p>
            <Link to="/donate" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all">
              Dukung Dakwah
            </Link>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© 2026 Mushaff Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
