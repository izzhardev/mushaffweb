import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Settings, 
  Save,
  Bell, 
  Search, 
  TrendingUp, 
  Users, 
  BookOpen, 
  LogOut,
  FileText,
  Image as ImageIcon,
  FileBarChart,
  Plus,
  Edit2,
  Trash2,
  X,
  History,
  Upload,
  Menu,
  Maximize2,
  CheckCircle2,
  Star,
  Share2,
  Copy,
  ExternalLink,
  HandHeart,
  User,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { PROGRAMS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

type Section = 'overview' | 'donations' | 'articles' | 'gallery' | 'campaigns' | 'reports' | 'users' | 'settings' | 'slider' | 'activities' | 'custom_contact' | 'pages' | 'volunteer' | 'profile';

export default function Dashboard() {
  const { user, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const { 
    donations, 
    volunteerDonations,
    articles, 
    gallery, 
    campaigns, 
    reports, 
    users,
    media,
    settings,
    slider,
    activities,
    pages,
    createItem,
    updateItem,
    deleteItem,
    saveSetting
  } = useAppDatabase();
  
  const [activeSection, setActiveSection] = useState<Section>(userProfile?.role === 'admin' ? 'overview' : 'donations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(true);
  const [isWebsiteOpen, setIsWebsiteOpen] = useState(true);

  useEffect(() => {
    if (userProfile && userProfile.role === 'user' && activeSection === 'overview') {
      setActiveSection('donations');
    }
  }, [userProfile, activeSection]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showFeaturedSettings, setShowFeaturedSettings] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(16);
  
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    site_name: '',
    site_logo: '',
    site_description: '',
    youtube_video_id: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const [customContactForm, setCustomContactForm] = useState({
    address: '',
    whatsapp: '',
    email: '',
    social_link: '',
    image_link: '',
    join_link: '',
    support_link: '',
    custom_links: [] as { title: string, url: string }[]
  });

  const featuredGallery = settings.find(s => s.id === 'featured_gallery') || { title: 'Galeri Kegiatan', imageUrls: [] };
  const generalSettings = settings.find(s => s.id === 'general') || {};
  const customContactSettings = settings.find(s => s.id === 'custom_contact') || {};

  // Form initialization flags to prevent overwriting user input while typing
  const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);
  const [isContactInitialized, setIsContactInitialized] = useState(false);

  useEffect(() => {
    if (activeSection === 'settings') {
      const currentSettings = generalSettings;
      if (currentSettings && Object.keys(currentSettings).length > 0 && !isSettingsInitialized) {
        setSiteSettingsForm({
          site_name: currentSettings.site_name || '',
          site_logo: currentSettings.site_logo || '',
          site_description: currentSettings.site_description || '',
          youtube_video_id: currentSettings.youtube_video_id || '',
          contact_email: currentSettings.contact_email || '',
          contact_phone: currentSettings.contact_phone || '',
          address: currentSettings.address || ''
        });
        setIsSettingsInitialized(true);
      }
    } else {
      setIsSettingsInitialized(false);
    }

    if (activeSection === 'custom_contact') {
      const currentSettings = customContactSettings;
      if (currentSettings && Object.keys(currentSettings).length > 0 && !isContactInitialized) {
        setCustomContactForm({
          address: currentSettings.address || '',
          whatsapp: currentSettings.whatsapp || '',
          email: currentSettings.email || '',
          social_link: currentSettings.social_link || '',
          image_link: currentSettings.image_link || '',
          join_link: currentSettings.join_link || '',
          support_link: currentSettings.support_link || '',
          custom_links: currentSettings.custom_links || []
        });
        setIsContactInitialized(true);
      }
    } else {
      setIsContactInitialized(false);
    }
  }, [activeSection, generalSettings, customContactSettings, isSettingsInitialized, isContactInitialized]);

  const handleToggleFeatured = async (imageUrl: string) => {
    const currentUrls = [...(featuredGallery.imageUrls || [])];
    const index = currentUrls.indexOf(imageUrl);
    
    if (index > -1) {
      currentUrls.splice(index, 1);
    } else {
      currentUrls.push(imageUrl);
    }

    await saveSetting('featured_gallery', { imageUrls: currentUrls, title: galleryTitle || 'Galeri Kegiatan' });
  };

  const handleUpdateGalleryTitle = async () => {
    await saveSetting('featured_gallery', { title: galleryTitle });
  };

  React.useEffect(() => {
    if (settings.length > 0) {
      const fg = settings.find(s => s.id === 'featured_gallery');
      if (fg) {
        setGalleryTitle(fg.title || '');
      }
    }
  }, [settings]);

  const menuItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'donations', label: 'Donasi', icon: History, roles: ['admin', 'user'] },
    { id: 'volunteer', label: 'Relawan', icon: HandHeart, roles: ['admin', 'user'] },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon, roles: ['admin'] },
    { id: 'articles', label: 'Artikel', icon: FileText, roles: ['admin'] },
    { id: 'pages', label: 'Halaman', icon: FileText, roles: ['admin'] },
    { id: 'campaigns', label: 'Penggalangan', icon: TrendingUp, roles: ['admin'] },
    { id: 'activities', label: 'Kabar', icon: Star, roles: ['admin'] },
    { id: 'custom_contact', label: 'Kontak', icon: MessageCircle, roles: ['admin'] },
    { id: 'slider', label: 'Slider Hero', icon: ImageIcon, roles: ['admin'] },
    { id: 'users', label: 'User', icon: Users, roles: ['admin'] },
    { id: 'reports', label: 'Laporan', icon: FileBarChart, roles: ['admin'] },
    { id: 'settings', label: 'Pengaturan', icon: Settings, roles: ['admin'] },
    { id: 'profile', label: 'Profil Saya', icon: User, roles: ['user'] },
  ].filter(item => item.roles.includes(userProfile?.role || 'user'));

  const handleOpenModal = (item: any = null) => {
    if (activeSection === 'articles' || activeSection === 'pages') {
      const type = activeSection === 'articles' ? 'article' : 'page';
      if (item) {
        navigate(`/editor/${item.id}?type=${type}`);
      } else {
        navigate(`/editor?type=${type}`);
      }
      return;
    }

    if (activeSection === 'campaigns') {
      if (item) {
        navigate(`/campaign-editor/${item.id}`);
      } else {
        navigate('/campaign-editor');
      }
      return;
    }

    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Konfigurasi Cloudinary belum lengkap. Silakan atur VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di Secrets.');
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = data.secure_url;
      setFormData({ ...formData, imageUrl: imageUrl });

      // Save to media collection
      await createItem('media', {
        url: imageUrl,
        publicId: data.public_id,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.displayName || 'Admin'
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Gagal mengunggah gambar ke Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Konfigurasi Cloudinary belum lengkap. Silakan atur VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di Secrets.');
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = data.secure_url;
      
      setSiteSettingsForm(prev => ({ ...prev, site_logo: imageUrl }));
      
      await createItem('media', {
        url: imageUrl,
        publicId: data.public_id,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.displayName || 'Admin'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Gagal mengunggah logo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    await saveSetting('general', siteSettingsForm);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleSaveCustomContact = async () => {
    await saveSetting('custom_contact', customContactForm);
    alert('Kontak berhasil disimpan!');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionMap: Record<Section, string> = {
      articles: 'articles',
      gallery: 'gallery',
      campaigns: 'campaigns',
      reports: 'reports',
      users: 'users',
      overview: '',
      donations: 'donations',
      settings: 'settings',
      slider: 'slider',
      activities: 'activities',
      custom_contact: 'settings',
      pages: 'pages',
      volunteer: '',
      profile: ''
    };

    const collectionName = collectionMap[activeSection];
    if (!collectionName) return;

    if (editingItem) {
      await updateItem(collectionName, editingItem.id, formData);
    } else {
      await createItem(collectionName, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const collectionMap: Record<Section, string> = {
      articles: 'articles',
      gallery: 'gallery',
      campaigns: 'campaigns',
      reports: 'reports',
      users: 'users',
      overview: '',
      donations: 'donations',
      settings: 'settings',
      slider: 'slider',
      activities: 'activities',
      custom_contact: 'settings',
      pages: 'pages',
      volunteer: '',
      profile: ''
    };
    const collectionName = collectionMap[activeSection];
    if (collectionName === 'donations' && window.confirm('Yakin ingin menghapus data donasi ini?')) {
      await deleteItem('donations', id);
      return;
    }
    if (collectionName && window.confirm('Yakin ingin menghapus data ini?')) {
      await deleteItem(collectionName, id);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      let date: Date;
      if (dateValue?.toDate) {
        date = dateValue.toDate();
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        date = new Date(dateValue);
      }
      
      if (isNaN(date.getTime())) return 'Format Salah';
      
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return 'Format Salah';
    }
  };

  const renderManagementSection = (title: string, data: any[], fields: { key: string, label: string }[]) => (
    <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center bg-white">
        <div>
          <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Kelola data {title.toLowerCase()}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-3 rounded-xl lg:rounded-2xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95 group uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Tambah Data
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/50">
              {fields.map(f => (
                <th key={f.key} className="px-6 lg:px-8 py-5 text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest">{f.label}</th>
              ))}
              <th className="px-6 lg:px-8 py-5 text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest text-right">Kontrol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                {fields.map(f => (
                  <td key={f.key} className="px-6 lg:px-8 py-5 text-xs lg:text-sm text-slate-600 whitespace-nowrap font-medium tracking-tight">
                    {f.key === 'image' || f.key === 'imageUrl' ? (
                      <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                        <img src={item[f.key]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
                      </div>
                    ) : f.key === 'createdAt' || f.key === 'timestamp' || f.key === 'uploadedAt' ? (
                      formatDate(item[f.key])
                    ) : (
                      item[f.key]?.toString() || <span className="text-slate-300 italic">kosong</span>
                    )}
                  </td>
                ))}
                <td className="px-6 lg:px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 transform transition-transform group-hover:translate-x-[-4px]">
                    {(activeSection === 'articles' || activeSection === 'pages') && (
                      <>
                        <a 
                          href={activeSection === 'articles' ? `/article/${item.slug || item.id}` : `/page/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 text-slate-400 hover:text-sky-500 transition-all hover:bg-sky-50 rounded-xl border border-transparent hover:border-sky-100"
                          title="Lihat Halaman"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => {
                            const baseUrl = window.location.origin;
                            const path = activeSection === 'articles' ? `/article/${item.slug || item.id}` : `/page/${item.slug}`;
                            navigator.clipboard.writeText(baseUrl + path);
                            alert('URL berhasil disalin!');
                          }} 
                          className="p-2.5 text-slate-400 hover:text-emerald-500 transition-all hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100"
                          title="Salin URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleOpenModal(item)} 
                      className="p-2.5 text-slate-400 hover:text-primary transition-all hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10"
                      title="Edit Data"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="p-2.5 text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100"
                      title="Hapus Permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={fields.length + 1} className="px-6 lg:px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                       <Plus className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Belum Tersedia</p>
                    <button onClick={() => handleOpenModal()} className="text-primary font-bold text-xs hover:underline decoration-2 underline-offset-4">Mulai Tambah Baris Pertama</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Donasi', value: `Rp ${donations.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}`, icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Program Dibantu', value: new Set(donations.map(d => d.programId)).size, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Penerima Manfaat', value: '120', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Poin Kebaikan', value: '1,250', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] sm:w-72 bg-white border-r border-slate-200 flex flex-col transition-all duration-500 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:min-h-screen",
        isSidebarOpen ? "translate-x-0 shadow-2xl shadow-slate-900/20" : "-translate-x-full"
      )}>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="flex items-center gap-3">
              <img 
                src={generalSettings.site_logo || "/logo.png"} 
                alt={generalSettings.site_name || "Mushaff Indonesia"} 
                className="w-7 h-7 lg:w-8 lg:h-8 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/mushaff-logo/100/100";
                }}
              />
              <span className="font-bold text-slate-900">{generalSettings.site_name || "Mushaff Dashboard"}</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide pr-1">
            {/* Top Level Items */}
            <div className="space-y-1">
              {menuItems.filter(item => ['overview', 'donations', 'volunteer', 'users'].includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as Section);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm lg:text-base",
                    activeSection === item.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Post Group */}
            <div className="space-y-1">
              <button 
                onClick={() => setIsPostsOpen(!isPostsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Post
                {isPostsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {isPostsOpen && (
                <div className="space-y-1 mt-1">
                  {menuItems.filter(item => ['gallery', 'articles', 'pages', 'campaigns', 'reports'].includes(item.id)).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id as Section);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all text-sm",
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Website Group */}
            <div className="space-y-1">
              <button 
                onClick={() => setIsWebsiteOpen(!isWebsiteOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Website
                {isWebsiteOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {isWebsiteOpen && (
                <div className="space-y-1 mt-1">
                  {menuItems.filter(item => ['slider', 'activities', 'custom_contact', 'settings'].includes(item.id)).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id as Section);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all text-sm",
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile (Bottom) */}
            <div className="pt-4 border-t border-slate-50">
              {menuItems.filter(item => item.id === 'profile').map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate('/profile');
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm lg:text-base text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm lg:text-base"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow w-full min-h-screen pb-20">
        <div className="p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl shadow-md shadow-slate-100 transition-all active:scale-95 group"
            >
              <Menu className="w-6 h-6 group-hover:text-primary transition-colors" />
            </button>
            <div>
              <h1 className="text-lg lg:text-3xl font-bold text-slate-900 line-clamp-1">Selamat Datang, {user?.displayName || 'Donatur Baik'}!</h1>
              <p className="text-slate-500 text-[10px] lg:text-base">Menebar kebaikan, memanen keberkahan.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Link to="/profile" className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-primary/20 hover:scale-110 transition-transform">
              <img src={userProfile?.photoURL || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=random`} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeSection === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-12">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 lg:block hover:shadow-md transition-shadow duration-300"
                    >
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.bg} ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center lg:mb-4 shrink-0 shadow-sm`}>
                        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div>
                        <div className="text-lg lg:text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                        <div className="text-[10px] lg:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900">Riwayat Donasi Terbaru</h3>
                    <button onClick={() => setActiveSection('donations')} className="text-primary font-bold text-sm hover:underline">Lihat Semua</button>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-wider">
                          <th className="px-6 lg:px-8 py-4 font-bold">Program</th>
                          <th className="px-6 lg:px-8 py-4 font-bold">Tanggal</th>
                          <th className="px-6 lg:px-8 py-4 font-bold">Nominal</th>
                          <th className="px-6 lg:px-8 py-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {donations.length > 0 ? donations.slice(0, 5).map((donation) => {
                          const program = PROGRAMS.find(p => p.id === donation.programId);
                          return (
                            <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 lg:px-8 py-5 whitespace-nowrap">
                                <div className="font-bold text-slate-900 text-sm lg:text-base">{program?.title}</div>
                                <div className="text-[10px] lg:text-xs text-slate-500">{program?.category}</div>
                              </td>
                              <td className="px-6 lg:px-8 py-5 text-slate-600 text-xs lg:text-sm whitespace-nowrap">
                                {formatDate(donation.timestamp)}
                              </td>
                              <td className="px-6 lg:px-8 py-5 font-bold text-slate-900 text-sm lg:text-base whitespace-nowrap">
                                Rp {donation.amount.toLocaleString()}
                              </td>
                              <td className="px-6 lg:px-8 py-5 whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                  Berhasil
                                </span>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={4} className="px-6 lg:px-8 py-12 text-center text-slate-500 italic text-sm">
                              Belum ada riwayat donasi.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'donations' && (
              <div className="space-y-6 lg:space-y-8">
                <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg lg:text-xl font-bold text-slate-900">
                      {userProfile?.role === 'admin' ? 'Semua Data Donasi' : 'Donasi Saya'}
                    </h2>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Donatur</th>
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {donations.length > 0 ? donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm text-slate-600 whitespace-nowrap">
                              {formatDate(donation.timestamp)}
                            </td>
                            <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                              <div className="text-xs lg:text-sm font-bold text-slate-900">{donation.donorName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{donation.phone}</div>
                            </td>
                            <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm font-bold text-slate-900 truncate max-w-[150px] whitespace-nowrap">
                              {donation.programId}
                            </td>
                            <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm font-bold text-primary whitespace-nowrap">
                              Rp {donation.amount.toLocaleString()}
                            </td>
                            <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                donation.status === 'completed' 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-amber-100 text-amber-600"
                              )}>
                                {donation.status === 'completed' ? 'Berhasil' : 'Tertunda'}
                              </span>
                            </td>
                            <td className="px-6 lg:px-8 py-4 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => navigate(`/donation-confirmation/${donation.id}`)}
                                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                                  title="Lihat Konfirmasi"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                {userProfile?.role === 'admin' && (
                                  <>
                                    <button 
                                      onClick={async () => {
                                        const newStatus = donation.status === 'completed' ? 'pending' : 'completed';
                                        await updateItem('donations', donation.id, { status: newStatus });
                                      }}
                                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                      title="Ubah Status"
                                    >
                                      <History className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(donation.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                      title="Hapus Donasi"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-8 py-12 text-center text-slate-500 italic">
                              Belum ada data donasi masuk.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {userProfile?.role !== 'admin' && (
                  <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <HandHeart className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg lg:text-xl font-bold text-slate-900">Donasi Melalui Link Saya</h2>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Relawan Program</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto scrollbar-hide">
                      <table className="w-full text-left min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Donatur</th>
                            <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                            <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                            <th className="px-6 lg:px-8 py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {volunteerDonations.length > 0 ? volunteerDonations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm text-slate-600 whitespace-nowrap">
                                {new Date(donation.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                                <div className="text-xs lg:text-sm font-bold text-slate-900">{donation.donorName}</div>
                                <div className="text-[10px] text-slate-400 font-medium">Melalui Link Relawan</div>
                              </td>
                              <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm font-bold text-slate-900 truncate max-w-[150px] whitespace-nowrap">
                                {donation.programId}
                              </td>
                              <td className="px-6 lg:px-8 py-4 text-xs lg:text-sm font-bold text-primary whitespace-nowrap">
                                Rp {donation.amount.toLocaleString()}
                              </td>
                              <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  donation.status === 'completed' 
                                    ? "bg-green-100 text-green-600" 
                                    : "bg-amber-100 text-amber-600"
                                )}>
                                  {donation.status === 'completed' ? 'Berhasil' : 'Tertunda'}
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="px-6 lg:px-8 py-12 text-center text-slate-500 italic text-sm">
                                Belum ada donasi yang masuk melalui link Anda. Ayo bagikan lebih banyak!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'articles' && renderManagementSection('Manajemen Artikel', articles, [
              { key: 'title', label: 'Judul' },
              { key: 'category', label: 'Kategori' },
              { key: 'authorName', label: 'Penulis' }
            ])}

            {activeSection === 'pages' && renderManagementSection('Manajemen Halaman', pages, [
              { key: 'title', label: 'Judul' },
              { key: 'slug', label: 'Slug' }
            ])}

            {activeSection === 'gallery' && (
              <div className="space-y-6 lg:space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Galeri Foto</h2>
                  <div className="flex flex-wrap gap-2 lg:gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => setShowFeaturedSettings(!showFeaturedSettings)}
                      className={cn(
                        "flex-grow sm:flex-grow-0 px-4 lg:px-6 py-2.5 rounded-full font-bold text-xs lg:text-sm flex items-center justify-center gap-2 transition-all",
                        showFeaturedSettings 
                          ? "bg-amber-100 text-amber-600 border border-amber-200" 
                          : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                      )}
                    >
                      <Star className={cn("w-4 h-4", showFeaturedSettings && "fill-current")} />
                      {showFeaturedSettings ? 'Sembunyikan' : 'Atur Landing'}
                    </button>
                    <button 
                      onClick={() => handleOpenModal()}
                      className="flex-grow sm:flex-grow-0 bg-primary text-white px-4 lg:px-6 py-2.5 rounded-full font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Foto
                    </button>
                  </div>
                </div>

                {showFeaturedSettings && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-amber-100 space-y-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
                      <div className="flex-grow space-y-2">
                        <label className="text-xs font-bold text-amber-800 ml-1">Judul Blok Galeri di Landing Page</label>
                        <input 
                          type="text"
                          value={galleryTitle}
                          onChange={(e) => setGalleryTitle(e.target.value)}
                          placeholder="Contoh: Galeri Kegiatan Kami"
                          className="w-full bg-white border border-amber-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm text-sm"
                        />
                      </div>
                      <button 
                        onClick={handleUpdateGalleryTitle}
                        className="bg-amber-600 text-white px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 whitespace-nowrap text-sm"
                      >
                        Simpan Judul
                      </button>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-amber-200">
                      <Star className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Klik ikon bintang pada foto di bawah untuk menampilkan atau menyembunyikan foto tersebut di halaman utama website. 
                        Foto yang bertanda <span className="text-amber-600 font-bold uppercase">Unggulan</span> akan muncul di landing page.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
                  {gallery.length > 0 ? gallery.slice(0, visibleGalleryCount).map((item) => {
                    const isFeatured = featuredGallery.imageUrls?.includes(item.imageUrl);
                    return (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4 }}
                        className={cn(
                          "group bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm border transition-all duration-300",
                          isFeatured ? "border-amber-200 ring-2 ring-amber-100/50" : "border-slate-100"
                        )}
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                          />
                          
                          {isFeatured && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="bg-amber-400 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md flex items-center gap-1 leading-none uppercase">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Unggulan
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleToggleFeatured(item.imageUrl)}
                              className={cn(
                                "p-2 rounded-full transition-all transform translate-y-2 group-hover:translate-y-0",
                                isFeatured ? "bg-amber-500 text-white" : "bg-white text-slate-900 hover:bg-amber-500 hover:text-white"
                              )}
                              title={isFeatured ? 'Hapus dari Landing' : 'Tampilkan di Landing'}
                            >
                              <Star className={cn("w-4 h-4", isFeatured && "fill-current")} />
                            </button>
                            <button 
                              onClick={() => setPreviewImage(item.imageUrl)}
                              className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                              title="Lihat Full Size"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(item.imageUrl);
                                alert('URL Gambar berhasil disalin!');
                              }}
                              className="p-2 bg-white rounded-full text-slate-900 hover:bg-sky-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                              title="Salin URL Gambar"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenModal(item)}
                              className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 lg:p-5">
                          <h3 className="font-bold text-slate-900 text-sm lg:text-base truncate tracking-tight">{item.title || 'Tanpa Judul'}</h3>
                          <p className="text-[10px] lg:text-xs text-slate-500 truncate mt-1 font-medium">{item.description || 'Tidak ada deskripsi'}</p>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-dashed border-slate-200">
                      <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">Belum ada foto di galeri.</p>
                    </div>
                  )}
                </div>

                {gallery.length > visibleGalleryCount && (
                  <div className="flex justify-center mt-12 mb-8">
                    <button 
                      onClick={() => setVisibleGalleryCount(prev => prev + 16)}
                      className="bg-white border-2 border-slate-100 px-10 py-4 rounded-2xl font-black text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm hover:shadow-lg active:scale-95 uppercase tracking-widest text-xs"
                    >
                      Load More Images
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'campaigns' && renderManagementSection('Manajemen Penggalangan', campaigns, [
              { key: 'title', label: 'Nama Program' },
              { key: 'targetAmount', label: 'Target' },
              { key: 'status', label: 'Status' }
            ])}

            {activeSection === 'reports' && renderManagementSection('Manajemen Laporan', reports, [
              { key: 'title', label: 'Judul Laporan' },
              { key: 'type', label: 'Jenis' },
              { key: 'date', label: 'Tanggal' }
            ])}

            {activeSection === 'users' && renderManagementSection('Manajemen User', users, [
              { key: 'displayName', label: 'Nama' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' }
            ])}

            {activeSection === 'activities' && renderManagementSection('Manajemen Kabar Mushaff', activities, [
              { key: 'image', label: 'Gambar' },
              { key: 'title', label: 'Judul' },
              { key: 'desc', label: 'Deskripsi' }
            ])}

            {activeSection === 'slider' && renderManagementSection('Manajemen Slider Hero', slider, [
              { key: 'title', label: 'Judul' },
              { key: 'accent', label: 'Label Accent' },
              { key: 'targetLink', label: 'Link CTA' },
              { key: 'detailLink', label: 'Link Detail' }
            ])}

            {activeSection === 'volunteer' && (
              <div className="space-y-6 lg:space-y-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 border-l-4 border-primary pl-4">Pusat Relawan</h2>
                  <p className="text-xs lg:text-sm text-slate-500">Bantu sebarkan program kebaikan ini ke jaringan Anda.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {campaigns.filter(c => c.status === 'active').map((campaign) => (
                    <motion.div 
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={campaign.imageUrl || "https://picsum.photos/seed/campaign/800/600"} 
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-4 lg:p-6 flex-col justify-end">
                           <span className="bg-primary text-white px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-bold uppercase tracking-widest w-fit mb-2">
                             Materi Aktif
                           </span>
                        </div>
                      </div>
                      <div className="p-6 lg:p-8 flex-grow flex flex-col">
                        <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-4 lg:mb-6 leading-tight line-clamp-2 min-h-[2.5rem] lg:min-h-[3.5rem]">{campaign.title}</h3>
                        
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                             <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-t-xl lg:rounded-t-2xl border-b border-white">
                               <label className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Copywriting Share</label>
                               <button 
                                 onClick={() => {
                                   const campaignUrl = `${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`;
                                   const text = campaign.copywriting || `Ayo bantu program "${campaign.title}" di ${generalSettings.site_name || "Mushaff Indonesia"}. Setiap kontribusi Anda sangat berarti untuk umat.\n\nSimak selengkapnya: ${campaignUrl}`;
                                   navigator.clipboard.writeText(text);
                                   alert('Copywriting berhasil disalin!');
                                 }}
                                 className="text-primary hover:scale-110 transition-transform"
                                 title="Salin Teks"
                               >
                                 <Copy className="w-3.5 h-3.5" />
                               </button>
                             </div>
                             <textarea 
                                readOnly
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-b-xl lg:rounded-b-2xl px-4 py-3 text-[9px] sm:text-[10px] lg:text-xs text-slate-500 h-28 lg:h-32 outline-none resize-none leading-relaxed"
                                value={campaign.copywriting || `Ayo bantu program "${campaign.title}" di ${generalSettings.site_name || "Mushaff Indonesia"}. Setiap kontribusi Anda sangat berarti untuk umat.\n\nSimak selengkapnya: ${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`}
                             />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6 lg:mt-8">
                          <button 
                            onClick={() => {
                              const campaignUrl = `${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`;
                              const text = campaign.copywriting || `Ayo bantu program "${campaign.title}" di ${generalSettings.site_name || "Mushaff Indonesia"}.`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + campaignUrl)}`, '_blank');
                            }}
                            className="bg-[#25D366] text-white py-3 rounded-xl lg:rounded-2xl font-bold text-[9px] lg:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            WhatsApp
                          </button>
                          <button 
                            onClick={() => navigate(`/donate/${campaign.id}?ref=${user?.uid}`)}
                            className="bg-slate-900 text-white py-3 rounded-xl lg:rounded-2xl font-bold text-[9px] lg:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Detail
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {campaigns.filter(c => c.status === 'active').length === 0 && (
                    <div className="col-span-full py-12 lg:py-20 text-center bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-dashed border-slate-200">
                      <HandHeart className="w-12 lg:w-16 h-12 lg:h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium text-sm lg:text-base">Belum ada materi aktif.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'custom_contact' && (
              <div className="bg-white rounded-3xl p-6 lg:p-10 border border-slate-100 shadow-sm">
                <div className="max-w-4xl">
                  <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-primary" />
                    Manajemen Kontak Hubungi Kami
                  </h2>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp (No HP)</label>
                        <input 
                          type="text"
                          value={customContactForm.whatsapp}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, whatsapp: e.target.value })}
                          placeholder="0812..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Kontak</label>
                        <input 
                          type="email"
                          value={customContactForm.email}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Lengkap</label>
                      <input 
                        type="text"
                        value={customContactForm.address}
                        onChange={(e) => setCustomContactForm({ ...customContactForm, address: e.target.value })}
                        placeholder="Alamat kantor / yayasan..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Instagram / Sosial Media</label>
                        <input 
                          type="text"
                          value={customContactForm.social_link}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, social_link: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Image (Background/Ilustrasi)</label>
                        <input 
                          type="text"
                          value={customContactForm.image_link}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, image_link: e.target.value })}
                          placeholder="https://... (untuk ilustrasi di blok kontak)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Gabung (WhatsApp Group/Linktree)</label>
                        <input 
                          type="text"
                          value={customContactForm.join_link}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, join_link: e.target.value })}
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Dukung (Portal Donasi Utama)</label>
                        <input 
                          type="text"
                          value={customContactForm.support_link}
                          onChange={(e) => setCustomContactForm({ ...customContactForm, support_link: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Custom Links</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Tambahkan tautan khusus lainnya sesuai kebutuhan.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setCustomContactForm({
                              ...customContactForm,
                              custom_links: [...(customContactForm.custom_links || []), { title: '', url: '' }]
                            });
                          }}
                          className="flex items-center gap-2 text-primary font-bold text-xs hover:underline decoration-2 underline-offset-4"
                        >
                          <Plus className="w-3 h-3" /> Add Link
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {customContactForm.custom_links && customContactForm.custom_links.length > 0 ? (
                          customContactForm.custom_links.map((link, idx) => (
                            <div key={idx} className="flex flex-col gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative group">
                              <button 
                                onClick={() => {
                                  const newLinks = customContactForm.custom_links.filter((_, i) => i !== idx);
                                  setCustomContactForm({ ...customContactForm, custom_links: newLinks });
                                }}
                                className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Link</label>
                                <input 
                                  type="text"
                                  value={link.title}
                                  onChange={(e) => {
                                    const newLinks = [...customContactForm.custom_links];
                                    newLinks[idx].title = e.target.value;
                                    setCustomContactForm({ ...customContactForm, custom_links: newLinks });
                                  }}
                                  placeholder="Misal: Katalog Buku"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">URL / Tautan</label>
                                <input 
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const newLinks = [...customContactForm.custom_links];
                                    newLinks[idx].url = e.target.value;
                                    setCustomContactForm({ ...customContactForm, custom_links: newLinks });
                                  }}
                                  placeholder="https://..."
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 text-xs font-medium">Belum ada custom link ditambahkan.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right pt-4">
                      <button 
                        onClick={handleSaveCustomContact}
                        className="w-full sm:w-auto bg-primary text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ml-auto"
                      >
                        <Save className="w-5 h-5" />
                        Simpan Pengaturan Kontak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-slate-900">Pengaturan Website</h2>
                      <p className="text-xs lg:text-sm text-slate-500">Kelola informasi publik dan konfigurasi sistem website.</p>
                    </div>
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-primary text-white px-6 lg:px-8 py-3 rounded-xl lg:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Simpan
                    </button>
                  </div>
                  
                  <div className="p-6 lg:p-8 space-y-8">
                    {/* General Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xs lg:text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-primary pl-4">Informasi Dasar</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Website</label>
                          <input 
                            type="text"
                            value={siteSettingsForm.site_name}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_name: e.target.value })}
                            placeholder="Contoh: Mushaff Indonesia"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Logo Website</label>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-grow space-y-3 order-2 sm:order-1">
                              <input 
                                type="text"
                                value={siteSettingsForm.site_logo}
                                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_logo: e.target.value })}
                                placeholder="URL Logo"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                              />
                              <label className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-[10px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all cursor-pointer">
                                <Upload className="w-3 h-3" />
                                {isUploading ? 'Mengunggah...' : 'Upload Logo Baru'}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  disabled={isUploading}
                                />
                              </label>
                            </div>
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white border border-slate-200 rounded-2xl lg:rounded-3xl flex items-center justify-center overflow-hidden p-2 lg:p-3 shrink-0 shadow-sm order-1 sm:order-2 self-center sm:self-auto">
                              <img src={siteSettingsForm.site_logo || '/logo.png'} className="w-full h-full object-contain" alt="Logo Pre" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deskripsi Web / Slogan</label>
                        <textarea 
                          value={siteSettingsForm.site_description}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_description: e.target.value })}
                          placeholder="Jelaskan secara singkat tentang website ini..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all h-32 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">YouTube Video ID (Landing Page)</label>
                        <input 
                          type="text"
                          value={siteSettingsForm.youtube_video_id}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, youtube_video_id: e.target.value })}
                          placeholder="Contoh: mvupJf_DYyI"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                        <p className="text-[10px] text-slate-400 ml-1 italic font-medium">*Ambil ID dari URL YouTube, misal: youtube.com/watch?v=<b>mvupJf_DYyI</b></p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h3 className="text-[10px] lg:text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-accent pl-4">Informasi Kontak</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Kontak</label>
                          <input 
                            type="email"
                            value={siteSettingsForm.contact_email}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_email: e.target.value })}
                            placeholder="admin@mushaff.org"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon/WA</label>
                          <input 
                            type="text"
                            value={siteSettingsForm.contact_phone}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_phone: e.target.value })}
                            placeholder="+62 812..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Kantor</label>
                        <input 
                          type="text"
                          value={siteSettingsForm.address}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, address: e.target.value })}
                          placeholder="Alamat lengkap..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-right pt-4">
                      <button 
                        onClick={handleSaveSettings}
                        className="w-full sm:w-auto bg-primary text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ml-auto"
                      >
                        <Save className="w-5 h-5" />
                        Simpan Semua
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100"
          >
            <div className="px-6 py-5 lg:px-8 lg:py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200 shadow-sm"
              >
                <X className="w-5 h-5 text-slate-400 font-bold" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide">
              {activeSection === 'articles' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Judul Artikel</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                      placeholder="Masukkan judul artikel"
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kategori</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                      placeholder="Masukkan kategori"
                      value={formData.category || ''}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">URL Gambar</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                      placeholder="https://..."
                      value={formData.image || ''}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Konten</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-40 font-medium text-slate-900 resize-none" 
                      placeholder="Tulis isi konten di sini..."
                      value={formData.content || ''}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}
              {activeSection === 'gallery' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Foto Galeri</label>
                    {formData.imageUrl ? (
                      <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-inner">
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden bg-slate-50">
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="text-xs font-bold animate-pulse">Sedang mengunggah...</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                              <Upload className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Upload Foto ke Cloudinary</span>
                            <span className="text-[10px] text-slate-400">Klik atau seret file ke sini</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                       <button 
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Media Library
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const url = prompt('Masukkan URL Gambar:');
                          if (url) setFormData({...formData, imageUrl: url});
                        }}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Gunakan URL
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Judul Foto</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-slate-900 transition-all" 
                      placeholder="Judul foto di galeri"
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deskripsi</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 font-medium text-slate-900 resize-none transition-all" 
                      placeholder="Deskripsi singkat kegiatan..."
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              )}
              {activeSection === 'campaigns' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Program</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-slate-900" 
                      placeholder="Donasi Mushalla..."
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Dana</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-900" 
                      placeholder="Contoh: 10000000"
                      value={formData.targetAmount || ''}
                      onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Banner Program (URL)</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-slate-900" 
                      placeholder="https://..."
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pesan Relawan</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-28 font-medium text-slate-900 resize-none" 
                      placeholder="Tulis pesan motivasi untuk relawan..."
                      value={formData.copywriting || ''}
                      onChange={e => setFormData({...formData, copywriting: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-900"
                      value={formData.status || 'active'}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">🟢 Program Aktif</option>
                      <option value="completed">🔴 Selesai</option>
                    </select>
                  </div>
                </div>
              )}
              {activeSection === 'reports' && (
                <div className="space-y-4">
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                    placeholder="Judul Laporan"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                    placeholder="URL File Laporan (PDF/Image)"
                    value={formData.fileUrl || ''}
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                    required
                  />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900"
                    value={formData.type || 'financial'}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="financial">Keuangan</option>
                    <option value="activity">Kegiatan</option>
                  </select>
                </div>
              )}
              {activeSection === 'users' && (
                <div className="space-y-4">
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                    placeholder="Nama Lengkap"
                    value={formData.displayName || ''}
                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                    required
                  />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900"
                    value={formData.role || 'user'}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User / Donatur</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              )}
              {activeSection === 'activities' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Judul Kegiatan</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                      placeholder="Judul kegiatan..."
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deskripsi Singkat</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-28 font-medium text-slate-900 resize-none" 
                      placeholder="Deskripsi kegiatan..."
                      value={formData.desc || ''}
                      onChange={e => setFormData({...formData, desc: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gambar (URL)</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                        placeholder="https://..."
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Selengkapnya</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                      placeholder="/about atau # atau https://..."
                      value={formData.link || ''}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                    />
                  </div>
                </div>
              )}
              {activeSection === 'slider' && (
                <div className="space-y-4">
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                    placeholder="Label Accent (Contoh: Pendidikan Al-Quran)"
                    value={formData.accent || ''}
                    onChange={e => setFormData({...formData, accent: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                    placeholder="Judul Utama Slider"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-24 resize-none font-medium text-slate-900" 
                    placeholder="Sub-judul atau deskripsi singkat..."
                    value={formData.subtitle || ''}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                      placeholder="Teks Tombol CTA"
                      value={formData.cta || ''}
                      onChange={e => setFormData({...formData, cta: e.target.value})}
                    />
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                      placeholder="Link CTA (/donate)"
                      value={formData.targetLink || ''}
                      onChange={e => setFormData({...formData, targetLink: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gambar Slider</label>
                    <div className="flex gap-3">
                      <input 
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900" 
                        placeholder="https://..."
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                      />
                      <label className="bg-primary text-white p-3 rounded-xl cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex-shrink-0">
                        <Upload className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploading(true);
                          const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
                          const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;
                          const uploadData = new FormData();
                          uploadData.append('file', file);
                          uploadData.append('upload_preset', uploadPreset);
                          try {
                            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: uploadData });
                            const data = await res.json();
                            setFormData({...formData, image: data.secure_url});
                          } catch (err) {
                            console.error(err);
                            alert('Gagal upload');
                          } finally {
                            setIsUploading(false);
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-primary text-white py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Proses Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Full Size Preview */}
      <AnimatePresence>
        {previewImage && (
          <div 
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img 
                src={previewImage} 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
                alt="Full Size" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMediaLibrary && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Media Library</h3>
                  <p className="text-slate-500 text-xs lg:text-sm mt-1 font-medium italic">Pilih aset visual yang sudah diunggah sebelumnya</p>
                </div>
                <button 
                  onClick={() => setShowMediaLibrary(false)}
                  className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-full transition-all shadow-sm"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                  {media.length > 0 ? media.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: item.url });
                        setShowMediaLibrary(false);
                      }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-primary transition-all shadow-sm hover:shadow-md"
                    >
                      <img 
                        src={item.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt="Media"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-primary text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform uppercase tracking-widest">Pilih Gambar</span>
                      </div>
                    </motion.button>
                  )) : (
                    <div className="col-span-full py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                         <ImageIcon className="w-10 h-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Media Library Kosong</p>
                      <p className="text-slate-300 text-xs mt-1">Unggah aset pertama Anda untuk melihatnya di sini</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 lg:p-6 bg-slate-50 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setShowMediaLibrary(false)}
                  className="px-6 py-2 rounded-full border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-sm"
                >
                  Tutup Library
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
