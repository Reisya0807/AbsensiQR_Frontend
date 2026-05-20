"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { ChevronRight, Info, X, Network } from "lucide-react";
import Image from "next/image";
import PageContainer from "../components/PageContainer";
import { Panitia, panitiaData } from "@/vidya/listPanitia";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface Member extends Panitia {
  children?: Member[];
}

const hierarchyData: Member = {
  ...panitiaData["253040072"],
  children: [
    {
      ...panitiaData["253040085"],
      children: [panitiaData["253040080"], panitiaData["253040052"]],
    },
    {
      ...panitiaData["253040079"],
      children: [panitiaData["253040043"], panitiaData["253040005"]],
    },
    panitiaData["253040089"],
    panitiaData["253040056"],
    panitiaData["253040058"],
    panitiaData["253040047"],
  ],
};

const lime = "#A3FF12";

function VerticalTreeNode({
  node,
  onInfoClick,
  alwaysExpanded = false,
}: {
  node: Member;
  onInfoClick: (m: Member) => void;
  alwaysExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const expanded = alwaysExpanded || isExpanded;

  return (
    <div className="relative ml-2 md:ml-4 border-l border-white/10 pl-4 my-4 w-full">
      <div className="absolute top-6 md:top-8 left-0 w-4 h-px bg-white/20" />
      <div className="flex items-center gap-2 pr-2 md:pr-4">
        <div
          onClick={() => {
            if (!alwaysExpanded) setIsExpanded(!isExpanded);
          }}
          className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border bg-black/40 backdrop-blur-md transition-all w-full shadow-lg ${
            !alwaysExpanded && hasChildren
              ? "active:scale-95 cursor-pointer hover:bg-black/60"
              : "cursor-default"
          }`}
          style={{ borderColor: expanded ? lime : `${lime}33` }}
        >
          <div
            className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border overflow-hidden relative"
            style={{ borderColor: `${lime}44` }}
          >
            <Image
              src={node.foto}
              alt={node.name}
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 text-left overflow-hidden">
            <p className="text-[8px] md:text-[10px] font-black uppercase opacity-50 tracking-[0.2em] leading-none">
              {node.role}
            </p>
            <p className="text-[11px] md:text-sm font-bold text-white truncate uppercase mt-1.5 md:mt-1 leading-tight">
              {node.name}
            </p>
          </div>

          {hasChildren && !alwaysExpanded && (
            <ChevronRight
              size={16}
              className={`shrink-0 transition-transform duration-300 ${
                isExpanded ? "rotate-90 text-[#A3FF12]" : "text-white/30"
              }`}
            />
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick(node);
          }}
          className="shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-2xl border flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-white/10 active:bg-[#A3FF12]/20 shadow-lg transition-colors"
          style={{ borderColor: `${lime}44`, color: lime }}
        >
          <Info size={20} className="md:w-6 md:h-6" />
        </button>
      </div>

      {expanded && hasChildren && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {node.children!.map((child) => (
            <VerticalTreeNode
              key={child.id}
              node={child}
              onInfoClick={onInfoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AboutUsPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className={spaceGrotesk.className}>
      <PageContainer title="ABOUT US" desktopFlex>
        
        {/* KOLOM KIRI: QUOTES (25% di Desktop, Full di Mobile) */}
        <div className="w-full lg:w-1/3 shrink-0 animate-in fade-in slide-in-from-left-4 duration-700">
          <div
            className="p-6 md:p-8 rounded-3xl border bg-black/40 backdrop-blur-md relative overflow-hidden shadow-xl lg:h-full flex items-center justify-center lg:min-h-87.5"
            style={{ borderColor: `${lime}33` }}
          >
            <Network
              className="absolute -top-4 -right-4 opacity-10 rotate-12"
              size={80}
              color={lime}
            />
            <p className="text-xs md:text-sm italic leading-relaxed text-white/85 text-center font-medium relative z-10">
              &quot;Kepanitiaan Vidya Sambandha terdiri dari Dewan Pengurus Harian sebagai pimpinan tertinggi, didampingi dua Wakil Ketua yaitu Kepkom dan Kelstra. yang masing-masing membawahi bidang-bidang teknis pelaksana acara.&quot;
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: STRUCTURE TREE (75% di Desktop, Full di Mobile) */}
        <div className="w-full lg:w-2/3 space-y-4 md:space-y-6 flex-1 mt-6 lg:mt-0">
          <div className="flex items-center justify-between px-2 md:px-4">
            <p
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: lime }}
            >
              Management Structure
            </p>
            <div className="h-px flex-1 ml-4 bg-white/10" />
          </div>

          <div className="bg-black/20 rounded-3xl md:rounded-4xl py-4 md:p-6 border border-white/5">
            <VerticalTreeNode
              node={hierarchyData}
              onInfoClick={setSelectedMember}
              alwaysExpanded
            />
          </div>
        </div>

      </PageContainer>

      {/* Modal Detail Panitia */}
      {selectedMember && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="relative w-full max-w-md p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border bg-black shadow-[0_0_60px_rgba(163,255,18,0.15)] animate-in zoom-in-95 duration-300"
            style={{ borderColor: lime }}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center space-y-6">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 mx-auto overflow-hidden shadow-inner shadow-black relative"
                style={{ borderColor: `${lime}55` }}
              >
                <Image
                  src={selectedMember.foto}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase opacity-50 tracking-[0.3em] leading-none">
                  {selectedMember.role}
                </p>
                <h2
                  className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mt-2 md:mt-3 leading-tight"
                  style={{ color: lime }}
                >
                  {selectedMember.name}
                </h2>
              </div>
              <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
              <p className="text-sm md:text-base leading-relaxed text-white/80 italic px-2">
                &quot;{selectedMember.jobdesk || "Tidak ada deskripsi pekerjaan."}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}