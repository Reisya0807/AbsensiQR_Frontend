'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { X, ExternalLink, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

interface PortfolioItem {
  id: number;
  title: string;
  url: string;
  image: string;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImage, setNewImage] = useState<string>('');

  const lime = '#A3FF12';

  useEffect(() => {
    const saved = localStorage.getItem('user_portfolio_v2');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveToLocal = (newItems: PortfolioItem[]) => {
    setItems(newItems);
    localStorage.setItem('user_portfolio_v2', JSON.stringify(newItems));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl || !newImage) return;

    const newItem: PortfolioItem = {
      id: Date.now(),
      title: newTitle.toUpperCase(),
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      image: newImage,
    };

    saveToLocal([newItem, ...items]);
    setNewTitle('');
    setNewUrl('');
    setNewImage('');
    setIsModalOpen(false);
  };

  const deleteItem = (id: number) => {
    const filtered = items.filter(item => item.id !== id);
    saveToLocal(filtered);
  };

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 bg-black`}>
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-20" />
      
      <div className="relative z-10 pt-16 px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-[#A3FF12]">
            PORTFOLIO
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,255,18,0.4)]"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md"
            >
              <div className="aspect-video w-full overflow-hidden border-b border-white/5">
                <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt={item.title} />
              </div>
              
              <div className="p-5 flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <h3 className="font-black text-[#A3FF12] italic tracking-tighter truncate uppercase">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/40 truncate font-medium uppercase mt-1">
                    {item.url.replace('https://', '')}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 active:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2rem]">
              <p className="text-white/30 font-bold uppercase tracking-widest text-sm italic">
                No Portfolio Yet
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl px-6">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#A3FF12]/30 rounded-[2.5rem] p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/40"
            >
              <X size={24} />
            </button>

            <h2 className="text-[#A3FF12] font-black text-xl italic mb-8 uppercase tracking-tighter">
              Add New Project
            </h2>

            <form onSubmit={addPortfolio} className="space-y-6">
              <div className="flex flex-col items-center">
                <label className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#A3FF12]/50 transition-colors overflow-hidden bg-white/5">
                  {newImage ? (
                    <img src={newImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-white/20 mb-2" />
                      <span className="text-[10px] font-bold text-white/40 uppercase">Upload Thumbnail</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#A3FF12] uppercase ml-1">Project Name</label>
                <input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="EX: MY REDESIGN"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-[#A3FF12] text-sm font-bold transition-all uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#A3FF12] uppercase ml-1">Project Link</label>
                <input 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="github.com/your-repo"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-[#A3FF12] text-sm font-bold transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#A3FF12] text-black font-black rounded-2xl uppercase text-xs shadow-[0_0_20px_#A3FF12] active:scale-95 transition-transform"
              >
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A3FF12; border-radius: 10px; }
      `}</style>
    </main>
  );
}