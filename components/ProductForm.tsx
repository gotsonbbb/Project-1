
import React, { useState, useRef } from 'react';

interface ProductFormProps {
  onSubmit: (data: { link?: string; image?: { data: string; mimeType: string }; price?: string; phone?: string; }) => void;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading }) => {
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!link && !selectedImage) return;
    onSubmit({ link, image: selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined, price, phone });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({ data: (reader.result as string).split(',')[1], mimeType: file.type, name: file.name });
        setLink('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-lg backdrop-blur-md">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2V4a2 2 0 114 0v1h2V4z" /></svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Market Center</h2>
          <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest opacity-80">AI Sales Analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Main Input */}
          <div className="relative">
            <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1 mb-2 block">Link or Photo</label>
            {selectedImage ? (
              <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-4 border border-white/20 animate-in zoom-in-95 backdrop-blur-md">
                <img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} className="w-10 h-10 rounded-lg object-cover" alt="Preview" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-white font-bold truncate block">{selectedImage.name}</span>
                </div>
                <button type="button" onClick={() => setSelectedImage(null)} className="text-white/40 hover:text-white transition-colors">✕</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  value={link} 
                  onChange={(e) => setLink(e.target.value)} 
                  placeholder="Paste link here..." 
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/10 text-white placeholder:text-white/30 text-sm font-bold border border-white/10 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 outline-none transition-all shadow-inner" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-14 bg-white/20 hover:bg-white/30 rounded-2xl text-white flex items-center justify-center transition-all shadow-lg active:scale-90"
                >
                  📸
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1 mb-2 block">Price</label>
              <input 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="၅၀၀၀ ကျပ်" 
                className="w-full px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder:text-white/30 border border-white/10 focus:bg-white focus:text-slate-900 outline-none transition-all text-sm font-bold" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1 mb-2 block">Phone</label>
              <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="၀၉..." 
                className="w-full px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder:text-white/30 border border-white/10 focus:bg-white focus:text-slate-900 outline-none transition-all text-sm font-bold" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || (!link && !selectedImage)} 
          className="w-full py-5 bg-white text-indigo-900 font-black rounded-2xl shadow-2xl transition-all hover:bg-slate-50 hover:shadow-white/20 active:scale-[0.98] disabled:opacity-30 uppercase text-xs tracking-[0.3em]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping"></div>
              Analyzing...
            </span>
          ) : 'Generate Content'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
