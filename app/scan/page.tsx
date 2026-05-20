'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faRotate } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';
import { attendanceAPI } from '@/utils/api/listAPI';
import { ScanAttandance } from '@/schema/request';
import { getErrorMessage } from '@/utils/api/safeRequest';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

type ScanStatus = 'idle' | 'success' | 'failed' | 'submitting';

export default function ScanPage() {
  const lime = '#A3FF12';
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [usingFront, setUsingFront] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = 'qr-scanner-container';

  const extractToken = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      if (parsed && typeof parsed.token === 'string') return parsed.token;
    } catch { /* not json */ }
    return raw;
  };

  const startScanner = async (front: boolean) => {
    const scanner = new Html5Qrcode(SCANNER_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });
    scannerRef.current = scanner;

    await scanner.start(
      { facingMode: front ? 'user' : 'environment' },
      { fps: 10, qrbox: { width: 180, height: 180 } },
      async (decodedText) => {
        await scanner.stop();
        setIsScanning(false);
        setStatus('submitting');
        setMessage('Memvalidasi QR...');

        const payload: ScanAttandance = { token: extractToken(decodedText) };
        try {
          const res = await attendanceAPI.scan(payload);
          setStatus('success');
          setMessage(res.message || 'Absensi berhasil');
        } catch (err) {
          setStatus('failed');
          setMessage(getErrorMessage(err, 'QR tidak valid'));
        }
      },
      () => { /* frame error, abaikan */ }
    );
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* ignore */ }
      scannerRef.current = null;
    }
  };

  const handleToggleScan = async () => {
    if (isScanning) {
      await stopScanner();
      setIsScanning(false);
    } else {
      setIsScanning(true);
      await startScanner(usingFront);
    }
  };

  const handleToggleCamera = async () => {
    await stopScanner();
    const next = !usingFront;
    setUsingFront(next);
    await startScanner(next);
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  useEffect(() => {
    if (status === 'idle' || status === 'submitting') return;
    const t = setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <main
      className={`${spaceGrotesk.className} relative min-h-screen text-white flex items-center justify-center pb-28 md:pb-0 overflow-hidden bg-black`}
    >
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-30" />

      {status !== 'idle' && (
        <div className="absolute top-10 z-50 animate-bounce">
          <div
            className="w-75 p-4 rounded-2xl flex flex-col items-center border-[1.5px] bg-black/90 backdrop-blur-md"
            style={{ borderColor: lime }}
          >
            <h3 className="font-bold text-sm tracking-widest mb-1" style={{ color: lime }}>
              {status === 'success' ? 'SCAN SUCCESS' : status === 'submitting' ? 'PROCESSING' : 'SCAN FAILED'}
            </h3>
            <p className="text-[10px] uppercase opacity-80 text-center">{message}</p>
          </div>
        </div>
      )}

      <div
        className="relative z-10 w-[320px] p-8 rounded-[40px] text-center border-[1.5px] bg-black/60 backdrop-blur-xl"
        style={{ borderColor: `${lime}66` }}
      >
        <div className="flex justify-center mb-5">
          <div
            className="w-14 h-14 rounded-full border flex items-center justify-center shadow-[0_0_15px_#A3FF12]"
            style={{ borderColor: lime }}
          >
            <FontAwesomeIcon icon={faCamera} style={{ color: lime }} />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ color: lime }}>Scan Presence Code</h2>
        <p className="text-[11px] text-white/50 mb-8">Position the QR code within the frame</p>

        {/* Container wajib ada di DOM sebelum scanner start */}
        <div className="relative w-55 h-55 mx-auto mb-4 overflow-hidden bg-zinc-900 border border-white/10">
          <div id={SCANNER_ID} className="w-full h-full" />

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <FontAwesomeIcon icon={faCamera} className="text-3xl opacity-10" />
            </div>
          )}

          {isScanning && (
            <div className="absolute left-0 w-full h-0.5 bg-[#A3FF12] shadow-[0_0_15px_#A3FF12] animate-scan z-20 pointer-events-none" />
          )}

          <Corner pos="tl" /> <Corner pos="tr" />
          <Corner pos="bl" /> <Corner pos="br" />
        </div>

        {isScanning && (
          <button
            onClick={handleToggleCamera}
            className="mb-4 flex items-center gap-2 mx-auto text-[10px] tracking-widest font-bold py-1.5 px-4 rounded-full border transition-all"
            style={{ borderColor: lime, color: lime }}
          >
            <FontAwesomeIcon icon={faRotate} />
            {usingFront ? 'BACK CAM' : 'FRONT CAM'}
          </button>
        )}

        <button
          onClick={handleToggleScan}
          disabled={status === 'submitting'}
          className="w-full py-3.5 rounded-full font-black text-[10px] tracking-widest transition-all disabled:opacity-50"
          style={{
            backgroundColor: isScanning ? 'transparent' : lime,
            color: isScanning ? lime : 'black',
            border: `1.5px solid ${lime}`,
            boxShadow: isScanning ? 'none' : `0 0 20px ${lime}88`,
          }}
        >
          {isScanning ? 'STOP CAMERA' : 'SCAN NOW'}
        </button>
      </div>

      <BottomNav />

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </main>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-8 h-8 border-[#A3FF12] z-30';
  const map = {
    tl: 'top-0 left-0 border-t-4 border-l-4',
    tr: 'top-0 right-0 border-t-4 border-r-4',
    bl: 'bottom-0 left-0 border-b-4 border-l-4',
    br: 'bottom-0 right-0 border-b-4 border-r-4',
  };
  return <div className={`${base} ${map[pos]}`} />;
}