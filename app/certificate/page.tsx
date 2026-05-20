'use client';

import BottomNav from '../components/BottomNav';
import { Space_Grotesk } from 'next/font/google';
import { useEffect, useState } from 'react';
import { certificateAPI } from '@/utils/api/listAPI';
import { CertificateData } from '@/schema/certificate';
import { getErrorMessage } from '@/utils/api/safeRequest';
import Alert from '../components/Alert';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

export default function CertificatePage() {
  const lime = '#A3FF12';

  const [items, setItems] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await certificateAPI.getMy();
        if (cancelled) return;
        setItems(res.data ?? []);
      } catch (err) {
        if (cancelled) return;
        setAlert({ message: getErrorMessage(err, 'Gagal memuat sertifikat'), type: 'error' });
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 md:pb-8`}>
      {/* Background texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="relative z-10 w-full pt-20 md:pt-24 px-4 md:px-8 max-w-5xl mx-auto">

        {/* Judul — mobile center, desktop kiri */}
        <h1
          className="text-xl md:text-2xl font-black mb-6 tracking-wider uppercase text-center md:text-left"
          style={{ color: lime }}
        >
          CERTIFICATE
        </h1>

        {loading && (
          <div className="text-center py-10 text-white/40 text-xs uppercase tracking-widest italic">
            Loading...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/40 text-xs uppercase tracking-widest italic">
            Belum ada sertifikat
          </div>
        )}

        {/* Mobile: single col, Desktop: grid 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-sm mx-auto md:max-w-none">
          {items.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border backdrop-blur-md bg-black/40 overflow-hidden"
              style={{
                borderColor: lime,
                boxShadow: `0 0 10px rgba(163,255,18,0.2)`,
              }}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Avatar icon */}
                <div
                  className="shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center mt-0.5"
                  style={{
                    borderColor: lime,
                    boxShadow: `0 0 8px rgba(163,255,18,0.4)`,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={lime} strokeWidth="2">
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <path d="M7 21h10M12 17v4" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase tracking-tight text-sm" style={{ color: lime }}>
                    {cert.event?.nama ?? 'EVENT'}
                  </p>
                  <p className="text-[11px] text-white/50 tracking-tight">
                    {cert.certificateNumber}
                  </p>
                </div>
              </div>

              {/* Divider subtle */}
              <div className="mx-4 border-t border-white/5" />

              {/* Footer: tanggal + tombol */}
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">DATE</p>
                  <p className="text-[11px] text-white/60">{formatDate(cert.issuedAt)}</p>
                </div>

                {cert.softFile ? (
                  <a
                    href={cert.softFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-black font-black text-[10px] uppercase tracking-widest"
                    style={{
                      backgroundColor: lime,
                      boxShadow: `0 0 10px rgba(163,255,18,0.5)`,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                      <path d="M12 3v13M5 16l7 7 7-7" />
                      <path d="M3 21h18" />
                    </svg>
                    DOWNLOAD
                  </a>
                ) : (
                  <span
                    className="px-4 py-1.5 rounded-lg text-black font-black text-[10px] uppercase tracking-widest opacity-70"
                    style={{ backgroundColor: lime }}
                  >
                    PENDING
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}