'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faPen, faChevronRight, faChevronLeft,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { pesertaAPI, attendanceAPI } from '@/utils/api/listAPI';
import { PesertaListItem } from '@/schema/user';
import { getErrorMessage, APIError } from '@/utils/api/safeRequest';

interface Row {
  id: string;        // userId
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
    npm: item.peserta?.npm ?? '-',
    email: item.peserta?.email ?? null,
    hadir: (item.totalAbsensi ?? 0) > 0,
    totalAbsensi: item.totalAbsensi ?? 0,
    img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
  };
};

export default function ParticipantPage() {
  const lime = '#A3FF12';
  const router = useRouter();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Row | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Single effect: load data. Backend enforces role (returns 403 for non-sekretaris),
  // so we redirect on auth failure instead of doing a separate role-check round trip.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await pesertaAPI.list({ limit: '200' });
        if (cancelled) return;
        setRows((res.data?.data ?? []).map(toRow));
      } catch (err) {
        if (cancelled) return;
        const apiErr = err as APIError;
        if (apiErr?.status === 401 || apiErr?.status === 403) {
          router.replace('/home');
          return;
        }
        setError(getErrorMessage(err, 'Gagal memuat data peserta'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return rows.filter(
      (p) => p.name.toLowerCase().includes(q) || p.npm.includes(searchTerm),
    );
  }, [searchTerm, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const markPresent = async (row: Row) => {
    if (row.npm === '-' || row.hadir) return;
    setUpdatingId(row.id);
    try {
      await attendanceAPI.manual({ npm: row.npm });
      setRows((prev) =>
        prev.map((p) =>
          p.id === row.id ? { ...p, hadir: true, totalAbsensi: p.totalAbsensi + 1 } : p,
        ),
      );
      setSelectedUser((prev) => (prev && prev.id === row.id ? { ...prev, hadir: true } : prev));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mencatat absensi'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          opacity: 0.5,
        }}
      />

      <div className="relative z-10">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} style={{ color: lime }} className="opacity-60" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black/60 border-2 py-4 pl-12 pr-4 rounded-full outline-none text-sm tracking-widest transition-all focus:border-[#A3FF12]"
            style={{ borderColor: lime }}
            placeholder="CARI NAMA ATAU NPM..."
          />
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-red-400/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-white/40 text-xs uppercase tracking-widest italic">
            Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-4 min-h-125">
            <AnimatePresence mode="popLayout">
              {currentItems.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-3xl border-2 bg-black/80 backdrop-blur-md"
                  style={{ borderColor: lime, boxShadow: `0 0 10px ${lime}22` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl border-2 overflow-hidden bg-zinc-900"
                      style={{ borderColor: lime }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={user.img} alt={`avatar of ${user.name}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-[13px] tracking-tighter" style={{ color: lime }}>
                        {user.name}
                      </h3>
                      <p className="text-[10px] font-bold opacity-60 tracking-widest">{user.npm}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${user.hadir ? 'bg-[#A3FF12]' : 'bg-red-500'}`}
                        />
                        <span className="text-[8px] font-bold uppercase opacity-60">
                          {user.hadir ? 'Hadir' : 'Tidak'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="w-8 h-8 flex items-center justify-center rounded-full active:scale-75 transition-transform"
                  >
                    <FontAwesomeIcon icon={faPen} style={{ color: lime }} className="text-sm" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-8">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'opacity-10' : 'active:scale-90'}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ color: lime }} className="text-xl" />
            </button>
            <p className="text-xs font-black tracking-[0.3em] italic" style={{ color: lime }}>
              {currentPage} / {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'opacity-10' : 'active:scale-90'}
            >
              <FontAwesomeIcon icon={faChevronRight} style={{ color: lime }} className="text-xl" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black p-8 flex flex-col items-center"
          >
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundImage: "url('/img/bg-texture.jpeg')", backgroundSize: 'cover', opacity: 0.5 }}
            />

            <div className="relative z-10 w-full max-w-md">
              <div className="w-full flex justify-end mb-6">
                <button onClick={() => setSelectedUser(null)}>
                  <FontAwesomeIcon icon={faChevronDown} style={{ color: lime }} className="text-2xl" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-10">
                <div
                  className="w-32 h-32 rounded-full border-4 overflow-hidden bg-black mb-4"
                  style={{ borderColor: lime, boxShadow: `0 0 20px ${lime}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedUser.img} alt={`avatar of ${selectedUser.name}`} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-black text-xl tracking-widest text-center" style={{ color: lime }}>
                  {selectedUser.name}
                </h2>
              </div>

              <div className="space-y-4">
                <div
                  className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center"
                  style={{ borderColor: lime }}
                >
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">NPM</span>
                  <span className="font-bold text-sm" style={{ color: lime }}>{selectedUser.npm}</span>
                </div>

                <div
                  className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center"
                  style={{ borderColor: lime }}
                >
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Total Absensi</span>
                  <span className="font-bold text-sm" style={{ color: lime }}>{selectedUser.totalAbsensi}</span>
                </div>

                <div
                  className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center"
                  style={{ borderColor: lime }}
                >
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Status</span>
                  <span className={`text-[10px] font-black ${selectedUser.hadir ? 'text-[#A3FF12]' : 'text-red-500'}`}>
                    {selectedUser.hadir ? 'HADIR' : 'BELUM ABSEN'}
                  </span>
                </div>

                <button
                  onClick={() => markPresent(selectedUser)}
                  disabled={selectedUser.hadir || updatingId === selectedUser.id}
                  className="w-full py-5 mt-8 rounded-full font-black text-black tracking-[0.3em] text-xs transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: lime, boxShadow: `0 0 30px ${lime}66` }}
                >
                  {updatingId === selectedUser.id
                    ? 'PROCESSING...'
                    : selectedUser.hadir
                    ? 'SUDAH HADIR'
                    : 'TANDAI HADIR (MANUAL)'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
