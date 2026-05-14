'use client';

import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDollarSign, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

export default function FundPage() {
  const lime = '#A3FF12';
  const router = useRouter();
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  const divisionData = [
    { 
      id: 'KPK', 
      date: 'MAY 07, 2026', 
      total: 'Rp. 3.138.500',
      items: [
        { name: 'Tumpeng (1 Buah)', price: '300.000' },
        { name: 'Plakat (3 Buah)', price: '195.000' },
        { name: 'Karton (6 Buah)', price: '36.000' },
        { name: 'Sticky Note (3 Buah)', price: '10.500' },
        { name: 'ATK (1 Buah)', price: '30.000' },
        { name: 'Konsumsi Tamu (18 Buah)', price: '180.000' },
        { name: 'Kebutuhan WEB (1 Buah)', price: '200.000' },
        { name: 'Switch Nintendo (12 Buah - Sewa)', price: '252.000' },
        { name: 'Guest Star (1 Band - Sewa)', price: '1.000.000' },
        { name: 'Penari (1 Orang - Sewa)', price: '135.000' },
        { name: 'Aula (1 Tempat - Sewa)', price: '300.000' },
        { name: 'Lighting (1 Buah - Sewa)', price: '500.000' },
      ]
    },
    { 
      id: 'K3', 
      date: 'MAY 07, 2026', 
      total: 'Rp. 123.000',
      items: [
        { name: 'Oxycan (1 Buah)', price: '45.000' },
        { name: 'Tisu (1 Buah)', price: '17.000' },
        { name: 'Kapas (1 Pics)', price: '7.000' },
        { name: 'Kantong Plastik (1 Pack)', price: '10.000' },
        { name: 'Gula (1 Pack)', price: '6.000' },
        { name: 'Galon (3 Buah)', price: '18.000' },
        { name: 'Kebutuhan Medis (2 Buah)', price: '20.000' },
      ]
    },
    { 
      id: 'LOGISTIK', 
      date: 'MAY 07, 2026', 
      total: 'Rp. 3.227.000',
      items: [
        { name: 'Roll Banner (2 Meter)', price: '80.000' },
        { name: 'X Banner (1 Meter)', price: '80.000' },
        { name: 'Banner Welcome (2x1 Meter)', price: '36.000' },
        { name: 'Pin Merch (85 Buah)', price: '170.000' },
        { name: 'Name Tag (40 Buah)', price: '88.000' },
        { name: 'Es Kristal (10 Kg)', price: '100.000' },
        { name: 'Kue Basah Pagi (85 Porsi)', price: '595.000' },
        { name: 'KBR Malem (80 Porsi)', price: '1.200.000' },
        { name: 'Cireng (85 Porsi)', price: '170.000' },
        { name: 'Es Cream Aice (8 Liter)', price: '180.000' },
        { name: 'Batagor (85 Porsi)', price: '170.000' },
        { name: 'Snack & Perlengkapan Makan', price: '258.000' },
      ]
    },
    { 
      id: 'PDD', 
      date: 'MAY 07, 2026', 
      total: 'Rp. 1.120.000',
      items: [
        { name: 'Sony ZV-E10 (2 Buah - Sewa)', price: '350.000' },
        { name: 'Sigma 28-70mm (1 Buah - Sewa)', price: '130.000' },
        { name: 'Sigma 16mm F1.4 (1 Buah - Sewa)', price: '100.000' },
        { name: 'DJI RS 3 mini (1 Buah - Sewa)', price: '235.000' },
        { name: 'Rode VideoMic (1 Buah - Sewa)', price: '50.000' },
        { name: 'Baterai Sony NP-FW50 (3 Buah)', price: '105.000' },
        { name: 'Canon EF 24-70mm (1 Buah - Sewa)', price: '150.000' },
      ]
    }
  ];

  const TransactionCard = ({ division, date, amount, items }: any) => {
    const isExpanded = expandedDivision === division;

    return (
      <div 
        className="rounded-[1.5rem] border-2 bg-black/20 mb-4 transition-all duration-300" 
        style={{ borderColor: lime }}
      >
        <div 
          className="p-5 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedDivision(isExpanded ? null : division)}
        >
          <div>
            <p className="text-xs font-black tracking-wider uppercase" style={{ color: lime }}>
              DIVISI {division}
            </p>
            <p className="text-[10px] font-bold text-white/50 tracking-tighter mt-1">{date}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-red-500 font-black text-xl italic tracking-tighter">{amount}</p>
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-xs opacity-50" />
          </div>
        </div>

        {isExpanded && (
          <div className="px-5 pb-5 pt-2 border-t border-white/10 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[11px] font-medium border-b border-white/5 pb-1">
                <span className="text-white/70 w-2/3">{item.name}</span>
                <span style={{ color: lime }} className="w-1/3 text-right">Rp. {item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-32 bg-black`}>
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/img/bg-texture.jpeg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          opacity: 0.4
        }} 
      />
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 flex items-center gap-4 px-6 py-8 border-b border-white/10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90" style={{ borderColor: lime }}>
          <FontAwesomeIcon icon={faArrowLeft} color={lime} />
        </button>
        <h1 className="font-black text-2xl tracking-tighter uppercase" style={{ color: lime }}>FUND TRANSPARENCY</h1>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="p-6 rounded-[2rem] border-2 bg-black/40 backdrop-blur-sm" style={{ borderColor: lime }}>
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center" style={{ borderColor: lime }}>
              <FontAwesomeIcon icon={faDollarSign} color={lime} className="text-3xl" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/70 tracking-widest uppercase mb-1">TOTAL PENGELUARAN SEMUA DIVISI</p>
              <h2 style={{ color: lime }} className="font-black text-3xl italic tracking-tight">Rp. 7.608.500</h2>
            </div>
          </div>
          
          <div className="w-full h-4 bg-black/50 rounded-full border-2 overflow-hidden" style={{ borderColor: lime }}>
            <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: lime }} />
          </div>
        </div>

        <div className="space-y-4">
          <p style={{ color: lime }} className="font-black text-sm tracking-widest px-1 uppercase">Division Transactions</p>
          {divisionData.map((div) => (
            <TransactionCard key={div.id} division={div.id} date={div.date} amount={div.total} items={div.items} />
          ))}
        </div>
      </div>

      <div className="relative z-20">
        <BottomNav />
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A3FF12; border-radius: 10px; }
      `}</style>
    </main>
  );
}