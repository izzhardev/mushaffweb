import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  Code, 
  Image as ImageIcon, 
  Upload,
  X,
  Check,
  Target,
  Calendar,
  AlertCircle
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function CampaignEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { campaigns, media, createItem, updateItem } = useAppDatabase();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === id);
      if (campaign) {
        setTitle(campaign.title || '');
        setDescription(campaign.description || '');
        setTargetAmount(campaign.targetAmount || 0);
        setEndDate(campaign.endDate || '');
        setImage(campaign.image || '');
        setStatus(campaign.status || 'active');
      }
    }
  }, [id, campaigns]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Konfigurasi Cloudinary belum lengkap.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = data.secure_url;
      setImage(imageUrl);

      await createItem('media', {
        url: imageUrl,
        publicId: data.public_id,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.displayName || 'Admin'
      });
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Gagal mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !description || targetAmount <= 0) {
      alert('Judul, deskripsi, dan target dana wajib diisi');
      return;
    }

    setIsSaving(true);
    const data = {
      title,
      description,
      targetAmount,
      endDate,
      image,
      status,
      updatedAt: new Date().toISOString()
    };

    try {
      if (id) {
        await updateItem('campaigns', id, data);
      } else {
        await createItem('campaigns', { ...data, currentAmount: 0, createdAt: new Date().toISOString() });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {id ? 'Edit Penggalangan' : 'Buat Penggalangan Baru'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center mr-4">
              <button onClick={() => setMode('edit')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'edit' ? "bg-white text-primary shadow-sm" : "text-slate-500")}>Editor</button>
              <button onClick={() => setMode('preview')} className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'preview' ? "bg-white text-primary shadow-sm" : "text-slate-500")}>Preview</button>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {mode === 'edit' ? (
                <motion.div key="editor" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nama Program Penggalangan</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Sedekah Mushaf untuk Pelosok..." className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Deskripsi & Cerita Program</label>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[400px]">
                      <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-[350px]" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100">
                  {image && <img src={image} className="w-full h-80 object-cover rounded-3xl mb-8" alt="Cover" referrerPolicy="no-referrer" />}
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{title || 'Judul Penggalangan'}</h1>
                    <div className="grid grid-cols-2 gap-6 mb-12 p-6 bg-slate-50 rounded-3xl">
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Target Dana</div>
                        <div className="text-xl font-black text-primary">Rp {targetAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Batas Waktu</div>
                        <div className="text-xl font-black text-slate-900">{endDate ? new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</div>
                      </div>
                    </div>
                    <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Detail Penggalangan</h3>
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block ml-1">Gambar Utama</label>
                {image ? (
                  <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                    <img src={image} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setIsMediaLibraryOpen(true)} className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary transition-all"><ImageIcon className="w-5 h-5" /></button>
                      <button onClick={() => setImage('')} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button onClick={() => setIsMediaLibraryOpen(true)} className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary transition-all">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-sm font-bold">Pilih dari Media</span>
                    </button>
                    <label className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                      {isUploading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload Baru
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1"><Target className="w-4 h-4" /> Target Dana (Rp)</label>
                  <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1"><Calendar className="w-4 h-4" /> Batas Waktu</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block ml-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Penting</h4>
              <p className="text-xs text-amber-700 leading-relaxed">Pastikan target dana realistis dan deskripsi program menjelaskan transparansi penggunaan dana kepada donatur.</p>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isMediaLibraryOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Media Library</h3>
                <button onClick={() => setIsMediaLibraryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <button key={item.id} onClick={() => { setImage(item.url); setIsMediaLibraryOpen(false); }} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                      <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full">PILIH</span></div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
