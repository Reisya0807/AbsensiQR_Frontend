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
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 flex flex-col items-center`}>
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

      <div className="relative z-10 w-full flex flex-col items-center pt-16">
        <h1 className="text-2xl font-black mb-6 tracking-wider uppercase" style={{ color: lime }}>
          CERTIFICATE
        </h1>

        <div className="w-full max-w-md px-4 space-y-4">
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

          {items.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl border flex justify-between items-center backdrop-blur-md bg-black/40"
              style={{ borderColor: lime }}
            >
              <div>
                <p style={{ color: lime }} className="font-black uppercase tracking-tight">
                  {cert.event?.nama ?? 'EVENT'}
                </p>
                <p className="text-xs text-white/60 font-bold tracking-tighter">
                  {formatDate(cert.issuedAt)}
                </p>
                <p className="text-[10px] text-white/40 mt-1">{cert.certificateNumber}</p>
              </div>

              <a
                href={cert.softFile}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-black font-black text-xs uppercase tracking-widest"
                style={{ backgroundColor: lime }}
              >
                DOWNLOAD
              </a>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
