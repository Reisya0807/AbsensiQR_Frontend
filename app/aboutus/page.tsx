"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ChevronRight, 
  UserCircle2, 
  Info, 
  X, 
  Network 
} from "lucide-react";
import BottomNav from "../components/BottomNav"; 

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"],
});

// Mock data panitia
const hierarchyData = {
  id: "1",
  role: "Ketua Pelaksana",
  name: "Moch Fadhil Fadilah",
  jobdesk: "Penanggung jawab utama seluruh rangkaian acara dan koordinator antar divisi.",
  children: [
    {
      id: "2",
      role: "Bendahara 2",
      name: "Farrel Nizri Fahrezi",
      jobdesk: "Verifikasi pengeluaran divisi KEPKOM (KPK & PDD).",
      children: [
        {
          id: "wkp1",
          role: "WKP KEPKOM",
          name: "Adinda Putri Kirana",
          jobdesk: "Wakil Ketua Pelaksana bidang Kompetensi.",
          children: [
            { id: "b1", role: "Bidang KPK", name: "Nayla Amelia Putri", jobdesk: "Pelaksana teknis konten kompetensi." },
            { id: "b2", role: "Bidang PDD", name: "Muhamad Rifaldi", jobdesk: "Publikasi, Dekorasi, dan Dokumentasi." },
          ]
        }
      ]
    },
    { id: "3", role: "Bendahara 1", name: "Yusnia Nurhasanah", jobdesk: "Pengelola anggaran masuk utama." },
    { id: "4", role: "Sekretaris 1", name: "Naila Radhika Oktaviatri", jobdesk: "Administrasi persuratan dan berkas formal." },
    {
      id: "5",
      role: "Sekretaris 2",
      name: "Raffi Fatahillah Sudrajat",
      jobdesk: "Arsip dokumen operasional dan notulensi.",
      children: [
        {
          id: "wkp2",
          role: "WKP KELSTRA",
          name: "Ginanjar Al Farizi",
          jobdesk: "Wakil Ketua Pelaksana bidang Strategis.",
          children: [
            { id: "b3", role: "Bidang Logistik", name: "Febra Kahfi Saputra", jobdesk: "Logistik, Konsumsi, dan Perlengkapan." },
            { id: "b4", role: "Bidang K3", name: "Muhammad Rifqi Rajif", jobdesk: "Keamanan, Kebersihan, dan Kesehatan." },
          ]
        }
      ]
    },
  ],
};

// Sub-komponen buat list tree vertikal
const VerticalTreeNode = ({ node, lime, onInfoClick }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative ml-2 border-l border-white/10 pl-4 my-4 w-full">
      {/* Branch lines */}
      <div className="absolute top-6 left-0 w-4 h-[1px] bg-white/20" />
      
      <div className="flex items-center gap-2 pr-4">
        {/* Card info user */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 p-3 rounded-2xl border bg-black/40 backdrop-blur-md transition-all active:scale-95 w-full shadow-lg`}
          style={{ borderColor: isExpanded ? lime : `${lime}33` }}
        >
          <div className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center bg-white/5" style={{ borderColor: `${lime}44` }}>
            <UserCircle2 size={16} style={{ color: lime, opacity: 0.6 }} />
          </div>
          <div className="flex-1 min-w-0 text-left overflow-hidden">
            <p className="text-[7px] font-black uppercase opacity-40 tracking-[0.2em] leading-none">{node.role}</p>
            <p className="text-[10px] font-bold text-white truncate uppercase mt-1 leading-tight">{node.name}</p>
          </div>
          {hasChildren && (
            <ChevronRight size={14} className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#A3FF12]' : 'text-white/20'}`} />
          )}
        </div>

        {/* Info button trigger modal */}
        <button 
          onClick={(e) => { e.stopPropagation(); onInfoClick(node); }}
          className="shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center bg-black/40 backdrop-blur-md active:bg-[#A3FF12]/20 shadow-lg"
          style={{ borderColor: `${lime}44`, color: lime }}
        >
          <Info size={16} />
        </button>
      </div>

      {/* Recursive children list */}
      {isExpanded && hasChildren && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {node.children.map((child: any) => (
            <VerticalTreeNode key={child.id} node={child} lime={lime} onInfoClick={onInfoClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AboutUsPage() {
  const lime = '#A3FF12';
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-36 flex flex-col items-center overflow-x-hidden bg-black`}>
      
      {/* Background set (texture + overlay) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-[1] pointer-events-none" />

      {/* Konten utama */}
      <div className="relative z-10 w-full pt-16 px-4 max-w-md">
        
        {/* Header section */}
        <div className="flex items-center gap-4 mb-10 px-2">
           <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border flex items-center justify-center bg-black/40 backdrop-blur-md shadow-lg shadow-black/50"
            style={{ borderColor: lime }}
           >
             <ArrowLeft size={20} color={lime} />
           </button>
           <div>
             <h1 className="text-2xl font-black tracking-wider uppercase leading-none" style={{ color: lime }}>
               ABOUT US
             </h1>
             <p className="text-[8px] font-bold opacity-40 tracking-[0.4em] uppercase mt-1">Management Structure</p>
           </div>
        </div>

        {/* Info/Penjelasan Section */}
        <div className="mb-10 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="p-6 rounded-[2.5rem] border bg-black/40 backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/40" style={{ borderColor: `${lime}33` }}>
              <Network className="absolute -top-4 -right-4 opacity-5 rotate-12" size={80} color={lime} />
              <p className="text-xs italic leading-relaxed text-white/70 text-center font-medium">
                "Project ini dikembangkan sebagai wadah kolaborasi kreatif antar divisi, mengedepankan nilai transparansi dan profesionalitas dalam setiap aspek operasional."
              </p>
           </div>
        </div>

        {/* Tree structure section */}
        <div className="w-full space-y-4 pr-2">
          <div className="flex items-center justify-between px-4">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">The Structure</p>
             <div className="h-[1px] flex-1 ml-4 bg-white/5" />
          </div>
          
          <div className="bg-black/20 rounded-[2.5rem] py-4">
            <VerticalTreeNode node={hierarchyData} lime={lime} onInfoClick={(m: any) => setSelectedMember(m)} />
          </div>
        </div>
      </div>

      {/* Modal popup detail anggota */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="relative w-full max-w-[340px] p-8 rounded-[3rem] border bg-black shadow-[0_0_60px_rgba(163,255,18,0.15)] animate-in zoom-in-95 duration-300" 
            style={{ borderColor: lime }}
          >
            <button onClick={() => setSelectedMember(null)} className="absolute top-8 right-8 text-white/30 active:text-white">
              <X size={24} />
            </button>
            
            <div className="text-center space-y-6">
              {/* Zoomed profile icon */}
              <div 
                className="w-28 h-28 rounded-full border-2 mx-auto flex items-center justify-center bg-white/5 shadow-inner shadow-black" 
                style={{ borderColor: `${lime}55` }}
              >
                <UserCircle2 size={64} strokeWidth={1} style={{ color: lime, opacity: 0.6 }} />
              </div>
              
              <div>
                <p className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em] leading-none">{selectedMember.role}</p>
                <h2 className="text-xl font-black italic uppercase tracking-tighter mt-1.5 leading-tight" style={{ color: lime }}>{selectedMember.name}</h2>
              </div>
              
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <p className="text-sm leading-relaxed text-white/70 italic px-2">
                "{selectedMember.jobdesk}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigasi bawah */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
      
    </main>
  );
}