'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faMinus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { qrAPI } from '@/utils/api/listAPI';
import { TokenData } from '@/schema/response';
import { getErrorMessage, APIError } from '@/utils/api/safeRequest';
import Alert from '../components/Alert';

const RETRY_DELAY_SECONDS = 5;

export default function GenerateQR() {
  const router = useRouter();
  const lime = '#A3FF12';

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [zoom, setZoom] = useState(0.85);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const inFlightRef = useRef(false);
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Stable fetch function using refs to avoid re-creating on every render
  const fetchToken = useCallback(() => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    qrAPI
      .generate()
      .then((res) => {
        if (!res.data) throw new Error(res.message || 'Gagal generate QR');
        setTokenData(res.data);
        setAlert(null);
        const expires = new Date(res.data.expiresAt).getTime();
        const seconds = Math.max(1, Math.floor((expires - Date.now()) / 1000));
        setTimeLeft(seconds);
      })
      .catch((err) => {
        const apiErr = err as APIError;
        if (apiErr?.status === 401 || apiErr?.status === 403) {
          routerRef.current.replace('/home');
          return;
        }
        setAlert({ message: getErrorMessage(err, 'Gagal generate QR'), type: 'error' });
        setTimeLeft(RETRY_DELAY_SECONDS);
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, []);

  // Auto-dismiss alert
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  // Initial fetch on mount only
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);
  // Countdown timer — calls fetchToken when it hits 1 → 0
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) fetchToken();
        return Math.max(0, prev - 1);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchToken]);

  return (
    <main className="min-h-screen bg-[#080808] text-white p-4 md:p-6 flex flex-col items-center relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          opacity: 0.3,
        }}
      />

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center">
        <div className="w-full flex justify-between items-start mb-2 md:mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900/50 border border-white/10 flex items-center justify-center active:scale-90 transition-all hover:border-[#A3FF12] hover:shadow-[0_0_12px_rgba(163,255,18,0.4)]"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-lg text-white" />
          </button>

          <div className="flex flex-col items-center gap-1">
            <FontAwesomeIcon icon={faCamera} style={{ color: lime }} className="text-2xl md:text-3xl mb-1" />
            <h1 className="text-[12px] md:text-sm font-black tracking-[0.4em] uppercase" style={{ color: lime }}>
              Scan Presence Code
            </h1>
          </div>

          <div className="w-10 md:w-12" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center -mt-4">
          <motion.div
            animate={{ scale: zoom }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative bg-white p-4 md:p-8 rounded-6xl shadow-2xl"
            style={{
              width: 'min(70vh, 85vw)',
              height: 'min(70vh, 85vw)',
              boxShadow: `0 0 80px rgba(163, 255, 18, 0.25)`,
            }}
          >
            <div className="w-full h-full relative flex items-center justify-center">
              {tokenData?.qrCodeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tokenData.qrCodeImage}
                  alt="QR Token"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-zinc-400 text-sm">Generating...</div>
              )}
            </div>

            <div className="absolute -top-2 -left-2 w-12 h-12 md:w-16 md:h-16 border-t-[5px] border-l-[5px] rounded-tl-2xl md:rounded-tl-3xl" style={{ borderColor: lime }} />
            <div className="absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 border-t-[5px] border-r-[5px] rounded-tr-2xl md:rounded-tr-3xl" style={{ borderColor: lime }} />
            <div className="absolute -bottom-2 -left-2 w-12 h-12 md:w-16 md:h-16 border-b-[5px] border-l-[5px] rounded-bl-2xl md:rounded-bl-3xl" style={{ borderColor: lime }} />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 border-b-[5px] border-r-[5px] rounded-br-2xl md:rounded-br-3xl" style={{ borderColor: lime }} />
          </motion.div>

          <div className="mt-6 md:mt-8 flex flex-col items-center">
            <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-1">
              Refreshing Token In
            </p>
            <p className="text-4xl md:text-5xl font-black italic tracking-tighter" style={{ color: lime, textShadow: `0 0 12px ${lime}88` }}>
              {timeLeft}s
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4 pb-2 w-full flex justify-center">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-3 md:p-4 px-6 md:px-8 rounded-4xl flex items-center gap-6 md:gap-8">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setZoom((z) => Math.max(0.4, z - 0.05))}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black flex items-center justify-center border border-white/5 hover:border-[#A3FF12]/60 transition-colors"
              >
                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
              </button>

              <div className="flex flex-col items-center w-12">
                <span className="text-[8px] md:text-[9px] font-black opacity-30 tracking-widest uppercase">Zoom</span>
                <span className="text-xs md:text-sm font-bold" style={{ color: lime }}>
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <button
                onClick={() => setZoom((z) => Math.min(1.1, z + 0.05))}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black flex items-center justify-center border border-white/5 hover:border-[#A3FF12]/60 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              </button>
            </div>

            <div className="h-6 md:h-7 w-px bg-white/10" />

            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-black opacity-30 tracking-widest uppercase">Token</span>
              <span className="text-[10px] md:text-xs font-bold text-white/70 font-mono">
                {tokenData?.token ? `${tokenData.token.slice(0, 8)}…` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}