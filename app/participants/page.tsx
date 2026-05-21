"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPen, faChevronRight, faChevronLeft, faChevronDown, faUpload, faKey } from "@fortawesome/free-solid-svg-icons";
import { pesertaAPI, attendanceAPI } from "@/utils/api/listAPI";
import { PesertaListItem } from "@/schema/user";
import { getErrorMessage, APIError } from "@/utils/api/safeRequest";
import Alert from "../components/Alert";

interface Row {
  id: string; // userId
  pesertaId: string | null;
  name: string;
  npm: string;
  email: string | null;
  hadir: boolean;
  totalAbsensi: number;
  img: string;
}

const ITEMS_PER_PAGE = 10;

const toRow = (item: PesertaListItem): Row => {
  const displayName = item.peserta?.nama ?? item.username;
  return {
    id: item.userId,
    pesertaId: item.peserta?.id ?? null,
    name: displayName,
    npm: item.peserta?.npm ?? "-",
    email: item.peserta?.email ?? null,
    hadir: (item.totalAbsensi ?? 0) > 0,
    totalAbsensi: item.totalAbsensi ?? 0,
    img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
  };
};

export default function ParticipantPage() {
  const lime = "#A3FF12";
  const router = useRouter();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Row | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showResetPopup, setShowResetPopup] = useState<Row | null>(null);
  // Single effect: load data. Backend enforces role (returns 403 for non-sekretaris),
  // so we redirect on auth failure instead of doing a separate role-check round trip.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await pesertaAPI.list({ limit: "200" });
        if (cancelled) return;
        setRows((res.data?.data ?? []).map(toRow));
      } catch (err) {
        if (cancelled) return;
        const apiErr = err as APIError;
        if (apiErr?.status === 401 || apiErr?.status === 403) {
          router.replace("/home");
          return;
        }
        setAlert({ message: getErrorMessage(err, "Gagal memuat data peserta"), type: "error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return rows.filter((p) => p.name.toLowerCase().includes(q) || p.npm.includes(searchTerm));
  }, [searchTerm, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const markPresent = async (row: Row) => {
    if (row.npm === "-" || row.hadir) return;
    setUpdatingId(row.id);
    try {
      await attendanceAPI.manual({ npm: row.npm });
      setRows((prev) => prev.map((p) => (p.id === row.id ? { ...p, hadir: true, totalAbsensi: p.totalAbsensi + 1 } : p)));
      setSelectedUser((prev) => (prev && prev.id === row.id ? { ...prev, hadir: true } : prev));
      setAlert({ message: "Absensi berhasil dicatat", type: "success" });
    } catch (err) {
      setAlert({ message: getErrorMessage(err, "Gagal mencatat absensi"), type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 pb-32 md:pb-16 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: "cover",
          opacity: 0.5,
        }}
      />

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="relative z-10 max-w-md md:max-w-6xl mx-auto">
        <div className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="font-black text-2xl tracking-widest uppercase" style={{ color: lime }}>
              Data Peserta
            </h1>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mt-1">Manage & track attendee list</p>
          </div>
          <div className="px-4 py-2 rounded-full border text-[10px] font-black tracking-widest uppercase" style={{ borderColor: lime, color: lime, boxShadow: `0 0 12px ${lime}55` }}>
            {filtered.length} Peserta
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} style={{ color: lime }} className="opacity-60" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black/60 border-2 py-4 md:py-5 pl-12 md:pl-14 pr-4 rounded-full outline-none text-sm tracking-widest transition-all focus:shadow-[0_0_15px_rgba(163,255,18,0.5)]"
            style={{ borderColor: lime }}
            placeholder="CARI NAMA ATAU NPM..."
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40 text-xs uppercase tracking-widest italic">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 min-h-125">
            <AnimatePresence mode="popLayout">
              {currentItems.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 md:p-5 rounded-3xl border-2 bg-black/80 backdrop-blur-md transition-shadow hover:shadow-[0_0_18px_rgba(163,255,18,0.4)]"
                  style={{ borderColor: lime, boxShadow: `0 0 10px ${lime}22` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 overflow-hidden bg-zinc-900 relative shrink-0" style={{ borderColor: lime }}>
                      <img src={user.img} alt={`avatar of ${user.name}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-[13px] md:text-sm tracking-tighter" style={{ color: lime }}>
                        {user.name}
                      </h3>
                      <p className="text-[10px] md:text-[11px] font-bold opacity-60 tracking-widest">{user.npm}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${user.hadir ? "bg-[#A3FF12]" : "bg-red-500"}`} />
                        <span className="text-[8px] md:text-[9px] font-bold uppercase opacity-60">{user.hadir ? "Hadir" : "Tidak"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push("/participants/serti")}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border active:scale-75 transition-transform shrink-0"
                      style={{ borderColor: lime }}
                    >
                      <FontAwesomeIcon icon={faUpload} style={{ color: lime }} />
                    </button>
                    <button onClick={() => setShowResetPopup(user)} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border active:scale-75 transition-transform shrink-0" style={{ borderColor: lime }}>
                      <FontAwesomeIcon icon={faKey} style={{ color: lime }} />
                    </button>

                    <button onClick={() => setSelectedUser(user)} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border active:scale-75 transition-transform shrink-0" style={{ borderColor: lime }}>
                      <FontAwesomeIcon icon={faPen} style={{ color: lime }} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 md:mt-12 flex justify-center items-center gap-8">
            <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "opacity-10" : "active:scale-90"}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ color: lime }} className="text-xl" />
            </button>
            <p className="text-xs font-black tracking-[0.3em] italic" style={{ color: lime }}>
              {currentPage} / {totalPages}
            </p>
            <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "opacity-10" : "active:scale-90"}>
              <FontAwesomeIcon icon={faChevronRight} style={{ color: lime }} className="text-xl" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <>
            {/* Backdrop (desktop only) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="hidden md:block fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="hidden md:flex fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-black border-l-2 p-8 flex-col"
              style={{ borderColor: lime, boxShadow: `-20px 0 60px rgba(0,0,0,0.6), 0 0 30px ${lime}33` }}
            >
              <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/img/bg-texture.jpeg')", backgroundSize: "cover", opacity: 0.3 }} />

              <div className="relative z-10 w-full flex flex-col h-full">
                <div className="w-full flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Detail Peserta</p>
                  <button onClick={() => setSelectedUser(null)} className="w-9 h-9 rounded-full border flex items-center justify-center hover:shadow-[0_0_12px_rgba(163,255,18,0.5)] transition-shadow" style={{ borderColor: lime }}>
                    <FontAwesomeIcon icon={faChevronRight} style={{ color: lime }} className="text-sm" />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-black mb-4 relative" style={{ borderColor: lime, boxShadow: `0 0 25px ${lime}` }}>
                    <img src={selectedUser.img} alt={`avatar of ${selectedUser.name}`} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-black text-xl tracking-widest text-center" style={{ color: lime }}>
                    {selectedUser.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="px-6 py-4 rounded-2xl border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">NPM</span>
                    <span className="font-bold text-sm" style={{ color: lime }}>
                      {selectedUser.npm}
                    </span>
                  </div>

                  <div className="px-6 py-4 rounded-2xl border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Total Absensi</span>
                    <span className="font-bold text-sm" style={{ color: lime }}>
                      {selectedUser.totalAbsensi}
                    </span>
                  </div>

                  <div className="px-6 py-4 rounded-2xl border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Status</span>
                    <span className={`text-[10px] font-black ${selectedUser.hadir ? "text-[#A3FF12]" : "text-red-500"}`}>{selectedUser.hadir ? "HADIR" : "BELUM ABSEN"}</span>
                  </div>
                </div>

                <button
                  onClick={() => markPresent(selectedUser)}
                  disabled={selectedUser.hadir || updatingId === selectedUser.id}
                  className="w-full py-5 mt-auto rounded-2xl font-black text-black tracking-[0.3em] text-xs transition-all active:scale-95 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(163,255,18,0.7)]"
                  style={{ background: lime, boxShadow: `0 0 30px ${lime}66` }}
                >
                  {updatingId === selectedUser.id ? "PROCESSING..." : selectedUser.hadir ? "SUDAH HADIR" : "TANDAI HADIR (MANUAL)"}
                </button>
              </div>
            </motion.div>

            {/* Mobile bottom sheet (full screen) */}
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="md:hidden fixed inset-0 z-50 bg-black p-8 flex flex-col items-center">
              <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/img/bg-texture.jpeg')", backgroundSize: "cover", opacity: 0.5 }} />

              <div className="relative z-10 w-full max-w-md">
                <div className="w-full flex justify-end mb-6">
                  <button onClick={() => setSelectedUser(null)}>
                    <FontAwesomeIcon icon={faChevronDown} style={{ color: lime }} className="text-2xl" />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-10">
                  <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-black mb-4 relative" style={{ borderColor: lime, boxShadow: `0 0 20px ${lime}` }}>
                    <img src={selectedUser.img} alt={`avatar of ${selectedUser.name}`} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-black text-xl tracking-widest text-center" style={{ color: lime }}>
                    {selectedUser.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">NPM</span>
                    <span className="font-bold text-sm" style={{ color: lime }}>
                      {selectedUser.npm}
                    </span>
                  </div>

                  <div className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Total Absensi</span>
                    <span className="font-bold text-sm" style={{ color: lime }}>
                      {selectedUser.totalAbsensi}
                    </span>
                  </div>

                  <div className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Status</span>
                    <span className={`text-[10px] font-black ${selectedUser.hadir ? "text-[#A3FF12]" : "text-red-500"}`}>{selectedUser.hadir ? "HADIR" : "BELUM ABSEN"}</span>
                  </div>

                  <button
                    onClick={() => markPresent(selectedUser)}
                    disabled={selectedUser.hadir || updatingId === selectedUser.id}
                    className="w-full py-5 mt-8 rounded-full font-black text-black tracking-[0.3em] text-xs transition-all active:scale-95 disabled:opacity-50"
                    style={{ background: lime, boxShadow: `0 0 30px ${lime}66` }}
                  >
                    {updatingId === selectedUser.id ? "PROCESSING..." : selectedUser.hadir ? "SUDAH HADIR" : "TANDAI HADIR (MANUAL)"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showResetPopup && (
          <>
            {/* BACKDROP */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowResetPopup(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

            {/* POPUP */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-black border-2 rounded-2xl p-6"
              style={{ borderColor: lime }}
            >
              <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: lime }}>
                Reset Password
              </h2>

              <p className="text-xs text-white/70 mb-6">
                Yakin ingin reset password untuk <span style={{ color: lime }}>{showResetPopup.name}</span>?
              </p>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowResetPopup(null)} className="px-4 py-2 text-xs font-bold border rounded-full" style={{ borderColor: lime, color: lime }}>
                  Batal
                </button>

                <button className="px-4 py-2 text-xs font-black rounded-full text-black" style={{ background: lime }}>
                  Ya, Reset
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
