'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BottomNav from './BottomNav';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  // Memisahkan layout kolom jika di desktop butuh flex gap (seperti di Fund Transparency)
  desktopFlex?: boolean;
}

export default function PageContainer({ title, children, desktopFlex = false }: PageContainerProps) {
  const router = useRouter();
  const lime = '#A3FF12';

  return (
    <main className="relative min-h-screen text-white pb-32 md:pb-0 md:mt-10 bg-black">
      {/* Background Texture Konsisten */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Header Utama (Mobile & Base) */}
      <div className="relative z-10 lg:hidden">
        <div className="flex items-center gap-4 px-6 py-8 border-b border-white/10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90"
            style={{ borderColor: lime }}
          >
            <FontAwesomeIcon icon={faArrowLeft} color={lime} />
          </button>
          <h1 className="font-black text-2xl tracking-tighter uppercase" style={{ color: lime }}>
            {title}
          </h1>
        </div>
        {/* Konten Mobile */}
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>

      {/* Kotakan Utama Desktop (lg:flex) */}
      <div className="relative z-10 hidden lg:flex min-h-screen items-start justify-center px-16 py-12">
        <div className="w-full max-w-5xl border-2 rounded-4xl bg-black/40 backdrop-blur-sm overflow-hidden" style={{ borderColor: lime }}>
          {/* Header didalam Kotak */}
          <div className="flex items-center gap-4 px-8 py-6 border-b-2" style={{ borderColor: `${lime}33` }}>
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90"
              style={{ borderColor: lime }}
            >
              <FontAwesomeIcon icon={faArrowLeft} color={lime} />
            </button>
            <h1 className="font-black text-2xl tracking-tighter uppercase" style={{ color: lime }}>
              {title}
            </h1>
          </div>

          {/* Konten Desktop */}
          <div className={`p-8 ${desktopFlex ? 'flex gap-8' : ''}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Navigasi Bawah */}
      <div className="relative z-20">
        <BottomNav />
      </div>
    </main>
  );
}