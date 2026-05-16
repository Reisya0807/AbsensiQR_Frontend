'use client';

import BottomNav from '../components/BottomNav';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faLocationDot, faLock } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';
import { useState, useEffect } from 'react';
import { rundownAPI } from '@/utils/api/listAPI';
import { RundownData } from '@/schema/rundown';
import { getErrorMessage } from '@/utils/api/safeRequest';
import Alert from '../components/Alert';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

type RundownStatus = 'LIVE' | 'UPCOMING_CANDIDATE' | 'PAST';

export default function RundownPage() {
  const lime = '#A3FF12';
  const router = useRouter();

  const [items, setItems] = useState<RundownData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await rundownAPI.getAll();
        if (cancelled) return;
        setItems(res.data ?? []);
      } catch (err) {
        if (cancelled) return;
        setAlert({ message: getErrorMessage(err, 'Gagal memuat rundown'), type: 'error' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const checkStatus = (item: RundownData): RundownStatus => {
    const now = currentTime.getTime();
    const start = new Date(item.waktuMulai).getTime();
    const end = new Date(item.waktuSelesai).getTime();
    if (now >= start && now < end) return 'LIVE';
    if (now < start) return 'UPCOMING_CANDIDATE';
    return 'PAST';
  };

  let hasFoundUpcoming = false;
  const filteredRundown = items.filter((item) => {
    const status = checkStatus(item);
    if (status === 'PAST' || status === 'LIVE') return true;
    if (status === 'UPCOMING_CANDIDATE' && !hasFoundUpcoming) {
      hasFoundUpcoming = true;
      return true;
    }
    return false;
  });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const getDuration = (item: RundownData) => {
    const ms = new Date(item.waktuSelesai).getTime() - new Date(item.waktuMulai).getTime();
    return Math.max(0, Math.round(ms / 60_000));
  };

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 bg-black`}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="relative z-10 flex items-center gap-4 px-6 py-8 border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90"
          style={{ borderColor: lime }}
        >
          <FontAwesomeIcon icon={faArrowLeft} color={lime} />
        </button>
        <h1 className="font-black text-2xl tracking-tighter uppercase" style={{ color: lime }}>
          EVENT RUNDOWN
        </h1>
      </div>

      <div className="relative z-10 px-6 pt-6">
        {loading ? (
          <div className="text-center py-20 opacity-40 uppercase font-black tracking-widest italic">
            Loading...
          </div>
        ) : (
          filteredRundown.map((item) => {
            const status = checkStatus(item);
            const isUpcoming = status === 'UPCOMING_CANDIDATE';
            const isLive = status === 'LIVE';
            const isPast = status === 'PAST';
            const duration = getDuration(item);

            return (
              <div
                key={item.id}
                className="relative p-5 rounded-[1.5rem] border-2 mb-5 flex items-start transition-all duration-300"
                style={{
                  borderColor: isLive ? lime : isUpcoming ? `${lime}44` : `${lime}22`,
                  boxShadow: isLive ? `0 0 20px ${lime}44` : 'none',
                  backgroundColor: isLive ? 'rgba(163,255,18,0.1)' : 'rgba(0,0,0,0.4)',
                  opacity: isPast ? 0.4 : 1,
                }}
              >
                <div className="flex flex-col items-center mr-5 min-w-[65px]">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-1"
                    style={{ borderColor: lime }}
                  >
                    <FontAwesomeIcon
                      icon={isUpcoming ? faLock : faClock}
                      color={lime}
                      className="text-xl"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/80 uppercase text-center leading-tight">
                    {formatTime(item.waktuMulai)}
                  </span>
                </div>

                <div className="flex-1 pt-1">
                  {isUpcoming ? (
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-[15px] font-black mb-3 leading-tight italic uppercase"
                        style={{ color: lime }}
                      >
                        {item.judul}
                      </p>
                      <div className="space-y-2 text-white/90">
                        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
                          <FontAwesomeIcon icon={faClock} style={{ color: lime }} />
                          <span>{duration} MIN</span>
                        </div>
                        {item.deskripsi && (
                          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
                            <FontAwesomeIcon icon={faLocationDot} style={{ color: lime }} />
                            <span>{item.deskripsi}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {(isLive || isUpcoming) && (
                  <div className="absolute right-4 top-6">
                    <span
                      className={`text-[9px] font-black px-3 py-[2px] rounded-full border-2 italic ${
                        isLive ? 'animate-pulse' : ''
                      }`}
                      style={{
                        borderColor: lime,
                        color: lime,
                        backgroundColor: isLive ? `${lime}22` : 'transparent',
                      }}
                    >
                      {isLive ? 'LIVE' : 'LOCKED'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {!loading && filteredRundown.length === 0 && (
          <div className="text-center py-20 opacity-40 uppercase font-black tracking-widest italic">
            No Rundown Yet
          </div>
        )}
      </div>

      <div className="relative z-20">
        <BottomNav />
      </div>
    </main>
  );
}
