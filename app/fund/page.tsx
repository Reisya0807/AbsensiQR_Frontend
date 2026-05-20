'use client';

import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChevronDown, faChevronUp, faArrowTrendDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

const TOTAL_BUDGET = 7608500;
const TOTAL_SPENT  = 7608500;
const REMAINING    = TOTAL_BUDGET - TOTAL_SPENT;
const SPENT_PERCENT = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);

const divisionData = [
  {
    id: 'KPK', date: 'MAY 07, 2026', total: 'Rp. 3.138.500',
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
    id: 'K3', date: 'MAY 07, 2026', total: 'Rp. 123.000',
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
    id: 'LOGISTIK', date: 'MAY 07, 2026', total: 'Rp. 3.227.000',
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
    id: 'PDD', date: 'MAY 07, 2026', total: 'Rp. 1.120.000',
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

const lime = '#A3FF12';

interface TransactionCardProps {
  division: string;
  date: string;
  amount: string;
  items: Array<{ name: string; price: string }>;
  expandedDivision: string | null;
  setExpandedDivision: (division: string | null) => void;
}

function TransactionCard({ division, date, amount, items, expandedDivision, setExpandedDivision }: TransactionCardProps) {
  const isExpanded = expandedDivision === division;
  return (
    <div className="rounded-2xl border-2 bg-black/20 transition-all duration-300" style={{ borderColor: lime }}>
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedDivision(isExpanded ? null : division)}>
        <div>
          <p className="text-xs font-black tracking-wider uppercase" style={{ color: lime }}>DIVISI {division}</p>
          <p className="text-[10px] font-bold text-white/50 tracking-tighter mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-red-500 font-black text-base italic tracking-tighter">{amount}</p>
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-xs opacity-50" color={lime} />
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {items.map((item, idx: number) => (
            <div key={idx} className="flex justify-between text-[11px] font-medium border-b border-white/5 pb-1">
              <span className="text-white/70 w-2/3">{item.name}</span>
              <span style={{ color: lime }} className="w-1/3 text-right">Rp. {item.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BudgetSummary() {
  return (
    <div className="w-full lg:w-95 shrink-0 space-y-4">
      <div className="p-5 rounded-3xl border-2 bg-black/40" style={{ borderColor: lime }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0" style={{ borderColor: lime }}>
            <FontAwesomeIcon icon={faDollarSign} color={lime} className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/70 tracking-widest uppercase mb-1">TOTAL BUDGET</p>
            <h2 style={{ color: lime }} className="font-black text-2xl italic tracking-tight">
              Rp. {TOTAL_BUDGET.toLocaleString('id-ID')}
            </h2>
          </div>
        </div>
        <div className="flex justify-between text-[11px] font-bold text-white/60 mb-2">
          <span>SPENT: Rp. {TOTAL_SPENT.toLocaleString('id-ID')}</span>
          <span>{SPENT_PERCENT}%</span>
        </div>
        <div className="w-full h-4 bg-black/50 rounded-full border overflow-hidden" style={{ borderColor: lime }}>
          <div className="h-full rounded-full" style={{ width: `${SPENT_PERCENT}%`, backgroundColor: lime }} />
        </div>
        <div className="mt-2 text-[11px] font-bold text-white/40">
          REMAINING: Rp. {REMAINING.toLocaleString('id-ID')}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border-2 bg-black/30" style={{ borderColor: lime }}>
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faArrowTrendDown} color="#ef4444" className="text-xs" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">SPENT</span>
          </div>
          <p className="font-black text-lg italic text-red-500 leading-tight">
            Rp. {TOTAL_SPENT.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-4 rounded-2xl border-2 bg-black/30" style={{ borderColor: lime }}>
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faArrowTrendUp} color={lime} className="text-xs" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">REMAINING</span>
          </div>
          <p className="font-black text-lg italic leading-tight" style={{ color: lime }}>
            Rp. {REMAINING.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FundPage() {
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  return (
    <div className={spaceGrotesk.className}>
      <PageContainer title="FUND TRANSPARENCY" desktopFlex>
        {/* Sisi Kiri: Ringkasan Dana */}
        <BudgetSummary />

        {/* Sisi Kanan: Daftar Transaksi per Divisi */}
        <div className="flex-1 space-y-4">
          <p style={{ color: lime }} className="font-black text-sm tracking-widest uppercase">DATA TRANSAKSI PER BIDANG</p>
          {divisionData.map(div => (
            <TransactionCard
              key={div.id}
              division={div.id}
              date={div.date}
              amount={div.total}
              items={div.items}
              expandedDivision={expandedDivision}
              setExpandedDivision={setExpandedDivision}
            />
          ))}
        </div>
      </PageContainer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A3FF12; border-radius: 10px; }
      `}</style>
    </div>
  );
}