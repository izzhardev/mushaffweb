import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useAppDatabase();

  const siteSettings = settings.find(s => s.id === 'general') || {
    site_name: 'Mushaff Indonesia',
    site_logo: 'logo.png',
    site_description: 'Pendidikan Al-Quran'
  };

  const nameParts = siteSettings.site_name?.split(' ') || ['Mushaff', 'Indonesia'];
  const firstName = nameParts[0] || 'Mushaff';
  const lastName = nameParts.slice(1).join(' ') || 'Indonesia';

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Program', href: '/about#program' },
    { name: 'Tim', href: '/about#tim' },
    { name: 'Relawan', href: '/login' },
    { name: 'Kontak', href: '/about#kontak' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={siteSettings.site_logo || "logo.png"} 
                alt={siteSettings.site_name} 
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/mushaff-logo/100/100";
                }}
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xl font-bold text-primary tracking-tight leading-none">
                  {firstName}<span className="text-slate-900">{lastName}</span>
                </span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{siteSettings.site_description || "Pendidikan Al-Quran"}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href ? "text-primary" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-slate-600 hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="text-slate-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-slate-600 hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            <Link
              to="/donate"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Heart className="w-4 h-4 fill-current" />
              Bantu Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {user && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg"
                  >
                    Profil Saya
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-base font-semibold mt-4"
              >
                <Heart className="w-5 h-5 fill-current" />
                Bantu Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
