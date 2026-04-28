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
  Check
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Markdown from 'react-markdown';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { articles, gallery, media, createItem, updateItem } = useAppDatabase();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [editorMode, setEditorMode] = useState<'rich' | 'html'>('rich');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id && articles.length > 0) {
      const article = articles.find(a => a.id === id);
      if (article) {
        setTitle(article.title || '');
        setContent(article.content || '');
        setCategory(article.category || '');
        setImage(article.image || '');
      }
    }
  }, [id, articles]);

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

      // Save to media collection
      await createItem('media', {
        url: imageUrl,
        publicId: data.public_id,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.displayName || 'Admin'
      });

      // Also save to gallery collection as requested
      await createItem('gallery', {
        title: title ? `Foto Artikel: ${title}` : `Unggahan Artikel (${file.name})`,
        imageUrl: imageUrl,
        description: `Gambar diunggah melalui editor artikel pada ${new Date().toLocaleDateString('id-ID')}`,
        uploadedBy: user?.displayName || 'Admin',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Gagal mengunggah gambar ke Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert('Judul dan konten wajib diisi');
      return;
    }

    setIsSaving(true);
    const data = {
      title,
      content,
      category,
      image,
      authorUid: user?.uid,
      authorName: user?.displayName || userProfile?.displayName || 'Admin',
    };

    try {
      if (id) {
        await updateItem('articles', id, data);
      } else {
        await createItem('articles', data);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectFromGallery = (url: string) => {
    setImage(url);
    setIsGalleryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {id ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center mr-4">
              <button
                onClick={() => setMode('edit')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                  mode === 'edit' ? "bg-white text-primary shadow-sm" : "text-slate-500"
                )}
              >
                <Code className="w-4 h-4" />
                Editor
              </button>
              <button
                onClick={() => setMode('preview')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                  mode === 'preview' ? "bg-white text-primary shadow-sm" : "text-slate-500"
                )}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {id ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Editor */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {mode === 'edit' ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Judul Artikel</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul yang menarik..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-bold text-slate-700">Konten Artikel</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditorMode('rich')}
                          className={cn("text-xs font-bold px-2 py-1 rounded", editorMode === 'rich' ? "bg-primary/10 text-primary" : "text-slate-400")}
                        >
                          Rich Text
                        </button>
                        <button 
                          onClick={() => setEditorMode('html')}
                          className={cn("text-xs font-bold px-2 py-1 rounded", editorMode === 'html' ? "bg-primary/10 text-primary" : "text-slate-400")}
                        >
                          HTML
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                      {editorMode === 'rich' ? (
                        <ReactQuill
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          className="flex-grow flex flex-col"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['link', 'image', 'video'],
                              ['clean']
                            ],
                          }}
                        />
                      ) : (
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full flex-grow p-6 font-mono text-sm outline-none resize-none"
                          placeholder="Tulis kode HTML di sini..."
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 min-h-[700px]"
                >
                  {image && (
                    <img 
                      src={image} 
                      alt="Cover" 
                      className="w-full h-80 object-cover rounded-3xl mb-8"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="max-w-3xl mx-auto">
                    {category && (
                      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold mb-4">
                        {category}
                      </span>
                    )}
                    <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                      {title || 'Judul Artikel'}
                    </h1>
                    <div className="flex items-center gap-3 mb-12 pb-8 border-b border-slate-100">
                      <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                        <img src={user?.photoURL || 'https://picsum.photos/seed/author/100/100'} alt="" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user?.displayName || 'Admin'}</div>
                        <div className="text-xs text-slate-500">Penulis {settings.find(s => s.id === 'general')?.site_name || "Platform Donasi"}</div>
                      </div>
                    </div>
                    
                    <div className="prose prose-slate prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar Settings */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Pengaturan Artikel</h3>
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block ml-1">Gambar Sampul</label>
                {image ? (
                  <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                    <img src={image} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setIsGalleryOpen(true)}
                        className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setImage('')}
                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setIsGalleryOpen(true)}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">Galeri</span>
                      </button>
                      <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden">
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6" />
                            <span className="text-[10px] font-bold uppercase">Upload</span>
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
                    </div>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Atau URL</span></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Tempel URL gambar..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block ml-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Berita">Berita</option>
                  <option value="Inspirasi">Inspirasi</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Edukasi">Edukasi</option>
                </select>
              </div>
            </div>

            <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Tips Menulis
              </h4>
              <ul className="text-xs text-primary/70 space-y-2 list-disc ml-4">
                <li>Gunakan judul yang singkat dan padat.</li>
                <li>Tambahkan gambar sampul yang berkualitas tinggi.</li>
                <li>Gunakan heading untuk membagi konten menjadi beberapa bagian.</li>
                <li>Pastikan kategori sudah sesuai dengan isi artikel.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Media Library</h3>
                  <p className="text-sm text-slate-500">Pilih dari semua gambar yang pernah diunggah</p>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8">
                {media.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {media.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectFromGallery(item.url)}
                        className="group relative aspect-square rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                      >
                        <img 
                          src={item.url} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt="Media"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold">Belum ada media yang diunggah</p>
                    <p className="text-sm">Gambar yang Anda unggah akan muncul di sini</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
