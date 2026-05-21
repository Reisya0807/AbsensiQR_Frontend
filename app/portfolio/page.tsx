'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import BottomNav from '../components/BottomNav';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
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

const lime = '#A3FF12';
const EMPTY_FORM: PortfolioCreate = { title: '', description: '', link: null };

// ── Detail panel content (reused in both desktop panel & mobile modal) ──
function DetailContent({ item, onClose }: { item: PortfolioData; onClose: () => void }) {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#A3FF12]/60 hover:text-[#A3FF12] transition-colors"
      >
        <ChevronDown size={20} />
      </button>

      {/* Image */}
      <Image
        src="/img/vidya.png"
        alt={item.title}
        width={500}
        height={200}
        className="w-full rounded-xl object-cover mb-4"
        style={{ maxHeight: 180 }}
      />

      {/* Title — klik redirect */}
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-black text-base uppercase tracking-wide mb-1 hover:underline"
          style={{ color: lime }}
        >
          {item.title}
        </a>
      ) : (
        <p className="font-black text-base uppercase tracking-wide mb-1" style={{ color: lime }}>
          {item.title}
        </p>
      )}

      {item.link && (
        <p className="text-white/40 text-[11px] mb-3 truncate">
          {item.link.replace(/^https?:\/\//, '')}
        </p>
      )}

      <p className="text-white/70 text-xs leading-relaxed">{item.description}</p>
    </>
  );
}

export default function PortfolioPage() {
  const [items, setItems]         = useState<PortfolioData[]>([]);
  const [form, setForm]           = useState<PortfolioCreate>(EMPTY_FORM);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert]         = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // rightPanel: null | 'form' | PortfolioData (detail)
  const [rightPanel, setRightPanel] = useState<null | 'form' | PortfolioData>(null);

  const isFormOpen   = rightPanel === 'form';
  const detailItem   = rightPanel !== null && rightPanel !== 'form' ? rightPanel as PortfolioData : null;
  const isPanelOpen  = rightPanel !== null;

  const closePanel = () => setRightPanel(null);
  const openForm   = () => { setRightPanel('form'); setForm(EMPTY_FORM); };
  const openDetail = (item: PortfolioData) => setRightPanel(item);

  useEffect(() => {
    let cancelled = false;
    portfolioAPI.listMine()
      .then((res) => { if (!cancelled) setItems(res.data ?? []); })
      .catch((err) => { if (!cancelled) setAlert({ message: getErrorMessage(err, 'Gagal memuat portfolio'), type: 'error' }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
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
      if (res.data) setItems((prev) => [res.data as PortfolioData, ...prev]);
      setForm(EMPTY_FORM);
      closePanel();
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
    if (detailItem?.id === id) closePanel();
    try {
      await portfolioAPI.deleteOne(id);
      setAlert({ message: 'Portfolio berhasil dihapus', type: 'success' });
    } catch (err) {
      setItems(prev);
      setAlert({ message: getErrorMessage(err, 'Gagal menghapus portfolio'), type: 'error' });
    }
  };

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  // ── Form fields shared ──
  const formFields = (mobileStyle: boolean) => (
    <div className="space-y-5">
      {(['title', 'link'] as const).map((field) => (
        <div key={field}>
          <label className="text-[10px] font-black text-[#A3FF12] uppercase tracking-widest block mb-1.5">
            {field === 'title' ? 'Name' : 'URL'}
          </label>
          <input
            name={field}
            value={field === 'link' ? (form.link ?? '') : form.title}
            onChange={handleFormChange}
            placeholder={field === 'title' ? 'Masukkan Name' : 'Masukkan URL'}
            className={`w-full rounded-lg px-4 py-2.5 outline-none text-sm text-white placeholder:text-white/20 transition-all ${
              mobileStyle
                ? 'bg-white/5 border border-white/10 focus:border-[#A3FF12] rounded-xl py-3'
                : 'bg-black/40 border border-[#A3FF12]/40 focus:border-[#A3FF12]'
            }`}
          />
        </div>
      ))}
      <div>
        <label className="text-[10px] font-black text-[#A3FF12] uppercase tracking-widest block mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleFormChange}
          rows={mobileStyle ? 4 : 5}
          placeholder={mobileStyle ? 'Tell us about your project' : 'Valdping...'}
          className={`w-full rounded-lg px-4 py-2.5 outline-none text-sm text-white placeholder:text-white/20 transition-all resize-none ${
            mobileStyle
              ? 'bg-white/5 border border-white/10 focus:border-[#A3FF12] rounded-xl py-3'
              : 'bg-black/40 border border-[#A3FF12]/40 focus:border-[#A3FF12]'
          }`}
        />
      </div>
    </div>
  );

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 md:pb-8 bg-black`}>
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-20" />

      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* ── MOBILE modals (detail & form) ── */}
      {isPanelOpen && (
        <div className="md:hidden fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-xl px-6">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#A3FF12]/40 rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={closePanel} className="absolute top-4 right-4 text-white/40">
              <X size={22} />
            </button>

            {isFormOpen ? (
              <>
                <h2 className="text-[#A3FF12] font-black text-lg uppercase tracking-wide mb-6">
                  Add New Project
                </h2>
                <form onSubmit={addPortfolio} className="space-y-5">
                  {formFields(true)}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#A3FF12] text-black font-black rounded-xl uppercase text-xs tracking-widest active:scale-95 transition-transform disabled:opacity-50"
                    style={{ boxShadow: '0 0 15px rgba(163,255,18,0.5)' }}
                  >
                    {submitting ? 'SAVING...' : 'SAVE'}
                  </button>
                </form>
              </>
            ) : detailItem ? (
              <DetailContent item={detailItem} onClose={closePanel} />
            ) : null}
          </div>
        </div>
      )}

      <div className="relative z-10 pt-20 md:pt-24 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="md:hidden text-2xl font-black tracking-[0.2em] uppercase text-[#A3FF12] text-center mb-6">
          PORTFOLIO
        </h1>

        <div className="flex gap-6">
          {/* ── List ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-20 text-white/40 text-xs uppercase tracking-widest italic">
                Loading...
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl border border-[#A3FF12]/60 bg-black/40 overflow-hidden"
                    style={{ boxShadow: '0 0 8px rgba(163,255,18,0.15)' }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl border border-[#A3FF12] flex items-center justify-center"
                        style={{ boxShadow: '0 0 8px rgba(163,255,18,0.4)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A3FF12" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="M8 21h8M12 17v4" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[#A3FF12] font-bold text-sm uppercase tracking-wide truncate">{item.title}</p>
                        {item.link && (
                          <p className="text-white/50 text-[11px] truncate mt-0.5">
                            {item.link.replace(/^https?:\/\//, '')}
                          </p>
                        )}
                        <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">DATE</p>
                        <p className="text-white/50 text-[11px]">
                          {new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 rounded-lg border border-red-500/30 flex items-center justify-center text-red-500 active:bg-red-500/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => openDetail(item)}
                          className="px-4 py-1.5 rounded-lg bg-[#A3FF12] text-black text-[11px] font-black uppercase tracking-wider active:scale-95 transition-transform"
                          style={{ boxShadow: '0 0 10px rgba(163,255,18,0.5)' }}
                        >
                          SEE MORE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
                    <p className="text-white/30 font-bold uppercase tracking-widest text-sm italic">No Portfolio Yet</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={openForm}
                className="w-10 h-10 rounded-full bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform"
                style={{ boxShadow: '0 0 15px rgba(163,255,18,0.5)' }}
              >
                <Plus size={22} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* ── Desktop right panel ── */}
          {isPanelOpen && (
            <div className="hidden md:flex md:w-[42%] flex-col">
              <div
                className="rounded-2xl border border-[#A3FF12]/60 bg-black/60 p-6 relative"
                style={{ boxShadow: '0 0 20px rgba(163,255,18,0.15)' }}
              >
                {isFormOpen ? (
                  <>
                    <button onClick={closePanel} className="absolute top-4 right-4 text-[#A3FF12]/60 hover:text-[#A3FF12] transition-colors">
                      <ChevronDown size={20} />
                    </button>
                    <form onSubmit={addPortfolio} className="space-y-5 mt-4">
                      {formFields(false)}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-8 py-2 bg-[#A3FF12] text-black font-black rounded-lg uppercase text-xs tracking-widest active:scale-95 transition-transform disabled:opacity-50"
                          style={{ boxShadow: '0 0 12px rgba(163,255,18,0.5)' }}
                        >
                          {submitting ? 'SAVING...' : 'SAVE'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : detailItem ? (
                  <DetailContent item={detailItem} onClose={closePanel} />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A3FF12; border-radius: 10px; }
      `}</style>
    </main>
  );
}