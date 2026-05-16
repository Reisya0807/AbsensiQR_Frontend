'use client';

import { useState, useEffect } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
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

  const extractToken = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      if (parsed && typeof parsed.token === 'string') return parsed.token;
    } catch {
      /* not json, fall through */
    }
    return raw;
  };

  const handleScan = async (results: IDetectedBarcode[]) => {
    if (!results || results.length === 0) return;
    const raw = results[0].rawValue;
    setIsScanning(false);
    setStatus('submitting');
    setMessage('Memvalidasi QR...');

    const payload: ScanAttandance = { token: extractToken(raw) };
    try {
      const res = await attendanceAPI.scan(payload);
      setStatus('success');
      setMessage(res.message || 'Absensi berhasil');
    } catch (err) {
      setStatus('failed');
      setMessage(getErrorMessage(err, 'QR tidak valid'));
    }
  };

  const handleError = (error: unknown) => {
    console.error(error);
    setStatus('failed');
    setMessage('Gagal mengakses kamera');
    setIsScanning(false);
  };

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
      className={`${spaceGrotesk.className} relative min-h-screen text-white flex items-center justify-center pb-28 overflow-hidden bg-black`}
    >
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center opacity-30" />

      {status !== 'idle' && (
        <div className="absolute top-10 z-50 animate-bounce">
          <div
            className="w-[300px] p-4 rounded-2xl flex flex-col items-center border-[1.5px] bg-black/90 backdrop-blur-md"
            style={{ borderColor: lime }}
          >
            <h3 className="font-bold text-sm tracking-widest mb-1" style={{ color: lime }}>
              {status === 'success'
                ? 'SCAN SUCCESS'
                : status === 'submitting'
                ? 'PROCESSING'
                : 'SCAN FAILED'}
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

        <h2 className="text-xl font-bold mb-1" style={{ color: lime }}>
          Scan Presence Code
        </h2>
        <p className="text-[11px] text-white/50 mb-8">Position the QR code within the frame</p>

        <div className="relative w-[220px] h-[220px] mx-auto mb-10 overflow-hidden bg-zinc-900 border border-white/10">
          {isScanning ? (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              allowMultiple={false}
              scanDelay={2000}
              components={{ finder: false }}
              styles={{ container: { width: '100%', height: '100%' } }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <FontAwesomeIcon icon={faCamera} className="text-3xl opacity-10" />
            </div>
          )}

          {isScanning && (
            <div className="absolute left-0 w-full h-[2px] bg-[#A3FF12] shadow-[0_0_15px_#A3FF12] animate-scan z-20" />
          )}

          <Corner pos="tl" /> <Corner pos="tr" />
          <Corner pos="bl" /> <Corner pos="br" />
        </div>

        <button
          onClick={() => setIsScanning((v) => !v)}
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
        .animate-scan {
          animation: scan 2s linear infinite;
        }
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
