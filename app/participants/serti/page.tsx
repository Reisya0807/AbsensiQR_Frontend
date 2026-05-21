"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown, Upload } from "lucide-react";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space",
});

const lime = "#A3FF12";

type CertificateData = {
  id: string;
  title: string;
  fileName: string;
};

const EMPTY_FORM = {
  title: "",
  file: null as File | null,
};

function DetailContent({ item, onClose }: { item: CertificateData; onClose: () => void }) {
  return (
    <>
      <button onClick={onClose} className="absolute top-4 right-4 text-[#A3FF12]/60 hover:text-[#A3FF12] transition-colors">
        <ChevronDown size={20} />
      </button>

      <Image src="/img/serti.png" alt={item.title} width={500} height={200} className="w-full rounded-xl object-cover mb-4" style={{ maxHeight: 180 }} />

      <p className="font-black text-base uppercase tracking-wide mb-4" style={{ color: lime }}>
        {item.title}
      </p>

      <div className="border border-[#A3FF12]/30 rounded-xl px-4 py-3 bg-black/40">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">FILE</p>

        <p className="text-[#A3FF12] text-sm truncate">{item.fileName}</p>
      </div>
    </>
  );
}

export default function CertificatePage() {
  const [items, setItems] = useState<CertificateData[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [rightPanel, setRightPanel] = useState<null | "form" | CertificateData>(null);

  // LOAD DATA
  useEffect(() => {
    const savedCertificates = localStorage.getItem("certificates");

    if (savedCertificates) {
      setItems(JSON.parse(savedCertificates));
    }
  }, []);

  // SAVE DATA
  useEffect(() => {
    localStorage.setItem("certificates", JSON.stringify(items));
  }, [items]);

  // AUTO HIDE ALERT
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const isFormOpen = rightPanel === "form";

  const detailItem = rightPanel !== null && rightPanel !== "form" ? (rightPanel as CertificateData) : null;

  const isPanelOpen = rightPanel !== null;

  const closePanel = () => setRightPanel(null);

  const openForm = () => {
    setRightPanel("form");

    setForm(EMPTY_FORM);
  };

  const openDetail = (item: CertificateData) => {
    setRightPanel(item);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const addCertificate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.file) {
      setAlert({
        message: "Lengkapi semua data",
        type: "error",
      });

      return;
    }

    const newItem: CertificateData = {
      id: crypto.randomUUID(),
      title: form.title,
      fileName: form.file.name,
    };

    const updatedItems = [newItem, ...items];

    setItems(updatedItems);

    localStorage.setItem("certificates", JSON.stringify(updatedItems));

    setAlert({
      message: "Sertifikat berhasil ditambahkan",
      type: "success",
    });

    setForm(EMPTY_FORM);

    closePanel();
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);

    setItems(updatedItems);

    localStorage.setItem("certificates", JSON.stringify(updatedItems));

    if (detailItem?.id === id) {
      closePanel();
    }

    setAlert({
      message: "Sertifikat berhasil dihapus",
      type: "success",
    });
  };

  const formFields = (mobileStyle: boolean) => (
    <div className="space-y-5">
      <div>
        <label className="text-[10px] font-black text-[#A3FF12] uppercase tracking-widest block mb-1.5">Name</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Masukkan Nama Sertifikat"
          className={`w-full rounded-lg px-4 py-2.5 outline-none text-sm text-white placeholder:text-white/20 transition-all ${
            mobileStyle ? "bg-white/5 border border-white/10 focus:border-[#A3FF12] rounded-xl py-3" : "bg-black/40 border border-[#A3FF12]/40 focus:border-[#A3FF12]"
          }`}
        />
      </div>

      <div>
        <label className="text-[10px] font-black text-[#A3FF12] uppercase tracking-widest block mb-3">Upload File</label>

        <label
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${mobileStyle ? "h-52" : "h-64"}`}
          style={{
            borderColor: "#A3FF12",
            boxShadow: "0 0 10px rgba(163,255,18,0.2)",
          }}
        >
          <Upload size={42} className="text-[#A3FF12] mb-4" />

          <p className="text-white/50 text-sm tracking-wide">{form.file ? form.file.name : "Masukkan File"}</p>

          <input type="file" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  );

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 md:pb-8 bg-black`}>
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-20" />

      {/* ALERT */}
      {alert && (
        <div className="fixed top-5 right-5 z-[999] animate-fadeIn">
          <div className="bg-black border border-[#A3FF12] px-4 py-3 rounded-xl shadow-lg">
            <p className={`text-sm font-bold ${alert.type === "success" ? "text-[#A3FF12]" : "text-red-500"}`}>{alert.message}</p>
          </div>
        </div>
      )}

      {/* MOBILE MODAL */}
      {isPanelOpen && (
        <div className="md:hidden fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-xl px-6">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#A3FF12]/40 rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={closePanel} className="absolute top-4 right-4 text-white/40">
              <X size={22} />
            </button>

            {isFormOpen ? (
              <>
                <h2 className="text-[#A3FF12] font-black text-lg uppercase tracking-wide mb-6">Add Certificate</h2>

                <form onSubmit={addCertificate} className="space-y-5">
                  {formFields(true)}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#A3FF12] text-black font-black rounded-xl uppercase text-xs tracking-widest active:scale-95 transition-transform"
                    style={{
                      boxShadow: "0 0 15px rgba(163,255,18,0.5)",
                    }}
                  >
                    SAVE
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
        <h1 className="md:hidden text-2xl font-black tracking-[0.2em] uppercase text-[#A3FF12] text-center mb-6">CERTIFICATE</h1>

        <div className="flex gap-6">
          {/* LIST */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-[#A3FF12]/60 bg-black/40 overflow-hidden"
                  style={{
                    boxShadow: "0 0 8px rgba(163,255,18,0.15)",
                  }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl border border-[#A3FF12] flex items-center justify-center"
                      style={{
                        boxShadow: "0 0 8px rgba(163,255,18,0.4)",
                      }}
                    >
                      <Upload size={18} color="#A3FF12" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[#A3FF12] font-bold text-sm uppercase tracking-wide truncate">{item.title}</p>

                      <p className="text-white/40 text-[11px] truncate mt-1">{item.fileName}</p>

                      <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">DATE</p>

                      <p className="text-white/50 text-[11px]">
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        })}
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
                        style={{
                          boxShadow: "0 0 10px rgba(163,255,18,0.5)",
                        }}
                      >
                        SEE MORE
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
                  <p className="text-white/30 font-bold uppercase tracking-widest text-sm italic">No Certificate Yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={openForm}
                className="w-10 h-10 rounded-full bg-[#A3FF12] flex items-center justify-center text-black active:scale-90 transition-transform"
                style={{
                  boxShadow: "0 0 15px rgba(163,255,18,0.5)",
                }}
              >
                <Plus size={22} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* DESKTOP PANEL */}
          {isPanelOpen && (
            <div className="hidden md:flex md:w-[42%] flex-col">
              <div
                className="rounded-2xl border border-[#A3FF12]/60 bg-black/60 p-6 relative"
                style={{
                  boxShadow: "0 0 20px rgba(163,255,18,0.15)",
                }}
              >
                {isFormOpen ? (
                  <>
                    <button onClick={closePanel} className="absolute top-4 right-4 text-[#A3FF12]/60 hover:text-[#A3FF12] transition-colors">
                      <ChevronDown size={20} />
                    </button>

                    <form onSubmit={addCertificate} className="space-y-5 mt-4">
                      {formFields(false)}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-2 bg-[#A3FF12] text-black font-black rounded-lg uppercase text-xs tracking-widest active:scale-95 transition-transform"
                          style={{
                            boxShadow: "0 0 12px rgba(163,255,18,0.5)",
                          }}
                        >
                          SAVE
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a3ff12;
          border-radius: 10px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </main>
  );
}
