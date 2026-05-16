'use client';

import { Space_Grotesk } from 'next/font/google';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlayCircle, faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

interface DocCardProps {
  title: string;
  type: string;
  icon: IconDefinition;
  lime: string;
}

function DocCard({ title, type, icon, lime }: DocCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 bg-black/40 backdrop-blur-sm p-4 transition-all active:scale-95" style={{ borderColor: lime }}>
      <div className="aspect-video w-full rounded-xl bg-white/10 mb-4 flex items-center justify-center border border-white/5 overflow-hidden">
        <FontAwesomeIcon icon={icon} className="text-4xl opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: lime }} />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] opacity-50 uppercase">{type}</p>
          <h3 className="text-lg font-black italic tracking-tighter mt-1" style={{ color: lime }}>{title}</h3>
        </div>
        <button className="px-4 py-1 rounded-full text-[10px] font-black border" style={{ borderColor: lime, color: lime }}>VIEW</button>
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  const lime = '#A3FF12';
  const router = useRouter();

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-32 overflow-hidden`}>
      {/* BG IMAGE KONSISTEN */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/img/bg-texture.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center gap-4 px-6 py-8 border-b border-white/10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: lime }}>
          <FontAwesomeIcon icon={faArrowLeft} color={lime} />
        </button>
        <h1 className="font-black text-2xl tracking-tighter" style={{ color: lime }}>DOKUMENTASI</h1>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-6 space-y-6">
        <div className="grid gap-4">
          <DocCard title="LIVE STREAMING" type="Live" icon={faPlayCircle} lime={lime} />
          <DocCard title="VIDEO DOCUMENTER" type="Doc" icon={faVideo} lime={lime} />
          <DocCard title="AFTER MOVIE" type="Cinematic" icon={faVideo} lime={lime} />
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-black tracking-[0.3em] mb-4 opacity-50 uppercase">Dokumentasi Foto</p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl border-2 bg-black/40 flex items-center justify-center" style={{ borderColor: lime }}>
                <FontAwesomeIcon icon={faCamera} className="opacity-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}