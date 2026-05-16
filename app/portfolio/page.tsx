'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import BottomNav from '../components/BottomNav';
import { X, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';
import { portfolioAPI } from '@/utils/api/listAPI';
import { PortfolioCreate, PortfolioData } from '@/schema/portfolio';
import { handleObjectChange } from '@/utils/form/handleChange';
import { getErrorMessage } from '@/utils/api/safeRequest';
import Alert from '../components/Alert';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

const EMPTY_FORM: PortfolioCreate = { title: '', description: '', link: null };

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<PortfolioCreate>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const lime = '#A3FF12';

  const loadPortfolios = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const res = await portfolioAPI.listMine();
      setItems(res.data ?? []);
    } catch (err) {
      setAlert({ message: getErrorMessage(err, 'Gagal memuat portfolio'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      await loadPortfolios();
    };
    fetchPortfolios();
  }, []);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleObjectChange<PortfolioCreate>(e, setForm);
  };

  const addPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    setSubmitting(true);
    setAlert(null);
    const payload: PortfolioCreate = {
      title: form.title,
      description: form.description,
      link: form.link ? (form.link.startsWith('http') ? form.link : `https://${form.link}`) : null,
    };
    try {
      const res = await portfolioAPI.createOne(payload);
      if (res.data) {
        setItems((prev) => [res.data as PortfolioData, ...prev]);
      }
      setForm(EMPTY_FORM);
      setIsModalOpen(false);
      setAlert({ message: 'Portfolio berhasil ditambahkan', type: 'success' });
    } catch (err) {
      setAlert({ message: getErrorMessage(err, 'Gagal menyimpan portfolio'), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    const prev = items;
    setItems((curr) => curr.filter((it) => it.id !== id));
    try {
      await portfolioAPI.deleteOne(id);
      setAlert({ message: 'Portfolio berhasil dihapus', type: 'success' });
    } catch (err) {
      setItems(prev);
      setAlert({ message: getErrorMessage(err, 'Gagal menghapus portfolio'), type: 'error' });
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 bg-black`}>
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-20" />

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="relative z-10 pt-16 px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-[#A3FF12]">PORTFOLIO</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform shadow-[0_0_15px_rgba(163,255,18,0.4)]"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40 text-xs uppercase tracking-widest italic">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-4xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md"
              >
                <div className="p-5">
                  <h3 className="font-black text-[#A3FF12] italic tracking-tighter uppercase">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/60 mt-2 leading-relaxed">{item.description}</p>
                  {item.link && (
                    <p className="text-[10px] text-white/40 truncate font-medium uppercase mt-2">
                      {item.link.replace(/^https?:\/\//, '')}
                    </p>
                  )}
                </div>

                <div className="px-5 pb-5 flex justify-end gap-2">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 active:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-4xl">
                <p className="text-white/30 font-bold uppercase tracking-widest text-sm italic">
                  No Portfolio Yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl px-6">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#A3FF12]/30 rounded-5xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40">
              <X size={24} />
            </button>

            <h2 className="text-[#A3FF12] font-black text-xl italic mb-8 uppercase tracking-tighter">
              Add New Project
            </h2>

            <form onSubmit={addPortfolio} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#A3FF12] uppercase ml-1">Project Name</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="EX: MY REDESIGN"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-[#A3FF12] text-sm font-bold transition-all uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#A3FF12] uppercase ml-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Tell us about your project"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-[#A3FF12] text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#A3FF12] uppercase ml-1">Project Link</label>
                <input
                  name="link"
                  value={form.link ?? ''}
                  onChange={handleFormChange}
                  placeholder="github.com/your-repo"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-[#A3FF12] text-sm font-bold transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#A3FF12] text-black font-black rounded-2xl uppercase text-xs shadow-[0_0_20px_#A3FF12] active:scale-95 transition-transform disabled:opacity-50"
              >
                {submitting ? 'SAVING...' : 'Save Project'}
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
