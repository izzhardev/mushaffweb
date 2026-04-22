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
  Maximize2,
  CheckCircle2,
  Star,
  Share2,
  Copy,
  ExternalLink,
  HandHeart,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { PROGRAMS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

type Section = 'overview' | 'donations' | 'articles' | 'gallery' | 'campaigns' | 'reports' | 'users' | 'settings' | 'slider' | 'volunteer' | 'profile';

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
    createItem,
    updateItem,
    deleteItem,
    saveSetting
  } = useAppDatabase();
  
  const [activeSection, setActiveSection] = useState<Section>(userProfile?.role === 'admin' ? 'overview' : 'donations');

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
  
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    site_name: '',
    site_logo: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const featuredGallery = settings.find(s => s.id === 'featured_gallery') || { title: 'Galeri Kegiatan', imageUrls: [] };

  useEffect(() => {
    if (activeSection === 'settings') {
      const currentSettings = settings.find(s => s.id === 'general');
      if (currentSettings) {
        setSiteSettingsForm({
          site_name: currentSettings.site_name || '',
          site_logo: currentSettings.site_logo || '',
          site_description: currentSettings.site_description || '',
          contact_email: currentSettings.contact_email || '',
          contact_phone: currentSettings.contact_phone || '',
          address: currentSettings.address || ''
        });
      }
    }
  }, [activeSection, settings]);

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
    { id: 'campaigns', label: 'Penggalangan', icon: TrendingUp, roles: ['admin'] },
    { id: 'slider', label: 'Slider Hero', icon: ImageIcon, roles: ['admin'] },
    { id: 'users', label: 'User', icon: Users, roles: ['admin'] },
    { id: 'reports', label: 'Laporan', icon: FileBarChart, roles: ['admin'] },
    { id: 'settings', label: 'Pengaturan', icon: Settings, roles: ['admin'] },
    { id: 'profile', label: 'Profil Saya', icon: User, roles: ['user'] },
  ].filter(item => item.roles.includes(userProfile?.role || 'user'));

  const handleOpenModal = (item: any = null) => {
    if (activeSection === 'articles') {
      if (item) {
        navigate(`/editor/${item.id}`);
      } else {
        navigate('/editor');
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

  const renderManagementSection = (title: string, data: any[], fields: { key: string, label: string }[]) => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Baru
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              {fields.map(f => (
                <th key={f.key} className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</th>
              ))}
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                {fields.map(f => (
                  <td key={f.key} className="px-8 py-4 text-sm text-slate-600">
                    {f.key === 'image' || f.key === 'imageUrl' ? (
                      <img src={item[f.key]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    ) : (
                      item[f.key]?.toString() || '-'
                    )}
                  </td>
                ))}
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={fields.length + 1} className="px-8 py-12 text-center text-slate-500 italic">
                  Belum ada data tersedia.
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img 
              src="/logo.png" 
              alt="Mushaff Edu Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/mushaff-logo/100/100";
              }}
            />
            <span className="font-bold text-slate-900">Mushaff Dashboard</span>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    navigate('/profile');
                  } else {
                    setActiveSection(item.id as Section);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                  activeSection === item.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Selamat Datang, {user?.displayName || 'Donatur Baik'}!</h1>
            <p className="text-slate-500">Berikut adalah ringkasan kontribusi kebaikan Anda.</p>
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
          >
            {activeSection === 'overview' && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                      <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Riwayat Donasi Terbaru</h3>
                    <button onClick={() => setActiveSection('donations')} className="text-primary font-bold text-sm hover:underline">Lihat Semua</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                          <th className="px-8 py-4 font-bold">Program</th>
                          <th className="px-8 py-4 font-bold">Tanggal</th>
                          <th className="px-8 py-4 font-bold">Nominal</th>
                          <th className="px-8 py-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {donations.length > 0 ? donations.slice(0, 5).map((donation) => {
                          const program = PROGRAMS.find(p => p.id === donation.programId);
                          return (
                            <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-5">
                                <div className="font-bold text-slate-900">{program?.title}</div>
                                <div className="text-xs text-slate-500">{program?.category}</div>
                              </td>
                              <td className="px-8 py-5 text-slate-600 text-sm">
                                {new Date(donation.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </td>
                              <td className="px-8 py-5 font-bold text-slate-900">
                                Rp {donation.amount.toLocaleString()}
                              </td>
                              <td className="px-8 py-5">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                  Berhasil
                                </span>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-slate-500 italic">
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
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">
                      {userProfile?.role === 'admin' ? 'Semua Data Donasi' : 'Donasi Saya'}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donatur</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {donations.length > 0 ? donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 text-sm text-slate-600">
                              {new Date(donation.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-4">
                              <div className="text-sm font-bold text-slate-900">{donation.donorName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{donation.phone}</div>
                            </td>
                            <td className="px-8 py-4 text-sm font-bold text-slate-900 truncate max-w-[150px]">
                              {donation.programId}
                            </td>
                            <td className="px-8 py-4 text-sm font-bold text-primary">
                              Rp {donation.amount.toLocaleString()}
                            </td>
                            <td className="px-8 py-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                donation.status === 'completed' 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-amber-100 text-amber-600"
                              )}>
                                {donation.status === 'completed' ? 'Berhasil' : 'Tertunda'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right">
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
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <HandHeart className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Donasi Melalui Link Saya</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Relawan Program</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donatur</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                            <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {volunteerDonations.length > 0 ? volunteerDonations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-4 text-sm text-slate-600">
                                {new Date(donation.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-8 py-4">
                                <div className="text-sm font-bold text-slate-900">{donation.donorName}</div>
                                <div className="text-[10px] text-slate-400 font-medium">Melalui Link Relawan</div>
                              </td>
                              <td className="px-8 py-4 text-sm font-bold text-slate-900 truncate max-w-[150px]">
                                {donation.programId}
                              </td>
                              <td className="px-8 py-4 text-sm font-bold text-primary">
                                Rp {donation.amount.toLocaleString()}
                              </td>
                              <td className="px-8 py-4">
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
                              <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">
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

            {activeSection === 'gallery' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">Galeri Foto</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowFeaturedSettings(!showFeaturedSettings)}
                      className={cn(
                        "px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all",
                        showFeaturedSettings 
                          ? "bg-amber-100 text-amber-600 border border-amber-200" 
                          : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                      )}
                    >
                      <Star className={cn("w-4 h-4", showFeaturedSettings && "fill-current")} />
                      {showFeaturedSettings ? 'Sembunyikan Pengaturan Landing' : 'Atur Galeri Landing'}
                    </button>
                    <button 
                      onClick={() => handleOpenModal()}
                      className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
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
                    className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 space-y-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                      <div className="flex-grow space-y-2">
                        <label className="text-sm font-bold text-amber-800 ml-1">Judul Blok Galeri di Landing Page</label>
                        <input 
                          type="text"
                          value={galleryTitle}
                          onChange={(e) => setGalleryTitle(e.target.value)}
                          placeholder="Contoh: Galeri Kegiatan Kami"
                          className="w-full bg-white border border-amber-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm"
                        />
                      </div>
                      <button 
                        onClick={handleUpdateGalleryTitle}
                        className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 whitespace-nowrap"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gallery.length > 0 ? gallery.map((item) => {
                    const isFeatured = featuredGallery.imageUrls?.includes(item.imageUrl);
                    return (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "group bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-300",
                          isFeatured ? "border-amber-200 shadow-amber-100" : "border-slate-100"
                        )}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                          />
                          
                          {isFeatured && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-white/90 backdrop-blur-sm text-amber-600 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-amber-100 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                UNGGULAN
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleToggleFeatured(item.imageUrl)}
                              className={cn(
                                "p-3 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0",
                                isFeatured ? "bg-amber-500 text-white" : "bg-white text-slate-900 hover:bg-primary hover:text-white"
                              )}
                              title={isFeatured ? 'Hapus dari Landing' : 'Tampilkan di Landing'}
                            >
                              <Star className={cn("w-5 h-5", isFeatured && "fill-current")} />
                            </button>
                            <button 
                              onClick={() => setPreviewImage(item.imageUrl)}
                              className="p-3 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                              title="Lihat Full Size"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleOpenModal(item)}
                              className="p-3 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-150"
                              title="Hapus"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-slate-900 truncate">{item.title || 'Tanpa Judul'}</h3>
                          <p className="text-xs text-slate-500 truncate mt-1">{item.description || 'Tidak ada deskripsi'}</p>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">Belum ada foto di galeri.</p>
                    </div>
                  )}
                </div>
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

            {activeSection === 'slider' && renderManagementSection('Manajemen Slider Hero', slider, [
              { key: 'title', label: 'Judul' },
              { key: 'accent', label: 'Label Accent' },
              { key: 'targetLink', label: 'Link CTA' },
              { key: 'detailLink', label: 'Link Detail' }
            ])}

            {activeSection === 'volunteer' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-primary pl-4">Pusat Relawan</h2>
                    <p className="text-slate-500 mt-1">Kami sangat berterima kasih atas bantuan Anda menyebarkan program kebaikan ini.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {campaigns.filter(c => c.status === 'active').map((campaign) => (
                    <motion.div 
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={campaign.imageUrl || "https://picsum.photos/seed/campaign/800/600"} 
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-6 flex-col justify-end">
                           <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-2">
                             Materi Aktif
                           </span>
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 leading-tight line-clamp-2 min-h-[3.5rem]">{campaign.title}</h3>
                        
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                             <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-t-2xl border-b border-white">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Copywriting Share</label>
                               <button 
                                 onClick={() => {
                                   const campaignUrl = `${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`;
                                   const text = campaign.copywriting || `Ayo bantu program "${campaign.title}" di Mushaff Indonesia. Setiap kontribusi Anda sangat berarti untuk umat.\n\nSimak selengkapnya: ${campaignUrl}`;
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
                               className="w-full bg-slate-50/50 border border-slate-100 rounded-b-2xl px-4 py-3 text-xs text-slate-500 h-32 outline-none resize-none leading-relaxed"
                               value={campaign.copywriting || `Ayo bantu program "${campaign.title}" di Mushaff Indonesia. Setiap kontribusi Anda sangat berarti untuk umat.\n\nSimak selengkapnya: ${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`}
                             />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                          <button 
                            onClick={() => {
                              const campaignUrl = `${window.location.origin}/donate/${campaign.id}?ref=${user?.uid}`;
                              const text = campaign.copywriting || `Ayo bantu program "${campaign.title}" di Mushaff Indonesia.`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + campaignUrl)}`, '_blank');
                            }}
                            className="bg-[#25D366] text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            WhatsApp
                          </button>
                          <button 
                            onClick={() => navigate(`/donate/${campaign.id}?ref=${user?.uid}`)}
                            className="bg-slate-900 text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Lihat Penggalangan
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {campaigns.filter(c => c.status === 'active').length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <HandHeart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">Belum ada materi penggalangan aktif untuk dibagikan.</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Terima kasih atas semangat Anda!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Pengaturan Website</h2>
                      <p className="text-sm text-slate-500">Kelola informasi publik dan konfigurasi sistem website Anda.</p>
                    </div>
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {/* General Settings */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-primary pl-4">Informasi Dasar</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Website</label>
                          <input 
                            type="text"
                            value={siteSettingsForm.site_name}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_name: e.target.value })}
                            placeholder="Contoh: Mushaff Indonesia"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Logo Website</label>
                          <div className="flex gap-4">
                            <div className="flex-grow space-y-3">
                              <input 
                                type="text"
                                value={siteSettingsForm.site_logo}
                                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_logo: e.target.value })}
                                placeholder="URL Logo"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                              />
                              <label className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all cursor-pointer">
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
                            <div className="w-24 h-24 bg-white border border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden p-3 shrink-0 shadow-sm">
                              <img src={siteSettingsForm.site_logo || '/logo.png'} className="w-full h-full object-contain" alt="Logo Pre" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deskripsi Web / Slogan</label>
                        <textarea 
                          value={siteSettingsForm.site_description}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, site_description: e.target.value })}
                          placeholder="Jelaskan secara singkat tentang website ini..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all h-32"
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-accent pl-4">Informasi Kontak</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Kontak</label>
                          <input 
                            type="email"
                            value={siteSettingsForm.contact_email}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_email: e.target.value })}
                            placeholder="admin@mushaff.org"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon/WA</label>
                          <input 
                            type="text"
                            value={siteSettingsForm.contact_phone}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_phone: e.target.value })}
                            placeholder="+62 812..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Kantor</label>
                        <input 
                          type="text"
                          value={siteSettingsForm.address}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, address: e.target.value })}
                          placeholder="Alamat lengkap..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="text-right pt-4">
                      <button 
                        onClick={handleSaveSettings}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ml-auto"
                      >
                        <Save className="w-5 h-5" />
                        Simpan Semua Perubahan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeSection === 'articles' && (
                <>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Judul Artikel"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Kategori"
                    value={formData.category || ''}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="URL Gambar"
                    value={formData.image || ''}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-32" 
                    placeholder="Konten"
                    value={formData.content || ''}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    required
                  />
                </>
              )}
              {activeSection === 'gallery' && (
                <>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Foto</label>
                    {formData.imageUrl ? (
                      <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden">
                        {isUploading ? (
                          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8" />
                            <span className="text-sm font-bold">Klik untuk Upload ke Cloudinary</span>
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
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Atau Pilih dari Media</span></div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Buka Media Library
                    </button>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Atau Gunakan URL</span></div>
                    </div>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="URL Foto"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Judul</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="Judul Foto"
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Deskripsi</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-24" 
                      placeholder="Deskripsi singkat..."
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </>
              )}
              {activeSection === 'campaigns' && (
                <>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Judul Program"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Target Dana"
                    value={formData.targetAmount || ''}
                    onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
                    required
                  />
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Gambar / Banner Program</label>
                    <div className="flex gap-4">
                      <input 
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="URL Gambar"
                        value={formData.imageUrl || ''}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-32" 
                    placeholder="Copywriting Share (Pesan motivasi untuk dibagikan relawan)"
                    value={formData.copywriting || ''}
                    onChange={e => setFormData({...formData, copywriting: e.target.value})}
                  />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.status || 'active'}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                  </select>
                </>
              )}
              {activeSection === 'reports' && (
                <>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Judul Laporan"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="URL File"
                    value={formData.fileUrl || ''}
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                    required
                  />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.type || 'financial'}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="financial">Keuangan</option>
                    <option value="activity">Kegiatan</option>
                  </select>
                </>
              )}
              {activeSection === 'users' && (
                <>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Nama"
                    value={formData.displayName || ''}
                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                    required
                  />
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.role || 'user'}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}
              {activeSection === 'slider' && (
                <>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Label Accent (Contoh: Pendidikan Al-Quran)"
                    value={formData.accent || ''}
                    onChange={e => setFormData({...formData, accent: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Judul Utama"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none h-24" 
                    placeholder="Sub-judul / Deskripsi"
                    value={formData.subtitle || ''}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Teks Tombol CTA"
                    value={formData.cta || ''}
                    onChange={e => setFormData({...formData, cta: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Link Tujuan (CTA) - Contoh: /donate"
                    value={formData.targetLink || ''}
                    onChange={e => setFormData({...formData, targetLink: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Link Detail (Optional) - Contoh: /about"
                    value={formData.detailLink || ''}
                    onChange={e => setFormData({...formData, detailLink: e.target.value})}
                  />
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Gambar Slider</label>
                    <div className="flex gap-4">
                      <input 
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
                        placeholder="URL Gambar"
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                      />
                      <label className="bg-primary text-white p-3 rounded-xl cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
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
                </>
              )}
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Simpan Perubahan
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

      {/* Media Library Modal */}
      <AnimatePresence>
        {showMediaLibrary && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Media Library</h3>
                  <p className="text-slate-500 text-sm mt-1">Pilih gambar yang sudah diunggah sebelumnya</p>
                </div>
                <button 
                  onClick={() => setShowMediaLibrary(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.length > 0 ? media.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: item.url });
                        setShowMediaLibrary(false);
                      }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                    >
                      <img 
                        src={item.url} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt="Media"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">PILIH</span>
                      </div>
                    </button>
                  )) : (
                    <div className="col-span-full py-20 text-center">
                      <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400">Belum ada media yang diunggah.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
