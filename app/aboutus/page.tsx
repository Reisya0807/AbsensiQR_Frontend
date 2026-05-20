"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Info, X, Network } from "lucide-react";
import Image from "next/image";
import BottomNav from "../components/BottomNav";
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
    {...panitiaData["253040085"], children: [
      panitiaData["253040080"],
      panitiaData["253040052"],
    ]},
    {...panitiaData["253040079"], children: [
      panitiaData["253040043"],
      panitiaData["253040005"],
    ]},
    panitiaData["253040089"],
    panitiaData["253040056"],
    panitiaData["253040047"],
    panitiaData["253040058"],
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
    <div className="relative ml-2 border-l border-white/10 pl-4 my-4 w-full">
      <div className="absolute top-6 left-0 w-4 h-px bg-white/20" />
      <div className="flex items-center gap-2 pr-4">
        <div
          onClick={() => {
            if (!alwaysExpanded) setIsExpanded(!isExpanded);
          }}
          className={`flex items-center gap-3 p-3 rounded-2xl border bg-black/40 backdrop-blur-md transition-all w-full shadow-lg ${
            !alwaysExpanded && hasChildren
              ? "active:scale-95 cursor-pointer"
              : "cursor-default"
          }`}
          style={{ borderColor: expanded ? lime : `${lime}33` }}
        >
          <div
            className="shrink-0 w-8 h-8 rounded-full border overflow-hidden relative"
            style={{ borderColor: `${lime}44` }}
          >
            <Image
              src={node.foto}
              alt={node.name}
              fill
              sizes="25"
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 text-left overflow-hidden">
            <p className="text-[7px] font-black uppercase opacity-40 tracking-[0.2em] leading-none">
              {node.role}
            </p>
            <p className="text-[10px] font-bold text-white truncate uppercase mt-1 leading-tight">
              {node.name}
            </p>
          </div>

          {hasChildren && !alwaysExpanded && (
            <ChevronRight
              size={14}
              className={`shrink-0 transition-transform duration-300 ${
                isExpanded ? "rotate-90 text-[#A3FF12]" : "text-white/20"
              }`}
            />
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick(node);
          }}
          className="shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center bg-black/40 backdrop-blur-md active:bg-[#A3FF12]/20 shadow-lg"
          style={{ borderColor: `${lime}44`, color: lime }}
        >
          <Info size={16} />
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
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <main
      className={`${spaceGrotesk.className} relative min-h-screen text-white pb-36 flex flex-col items-center overflow-x-hidden bg-black`}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-1 pointer-events-none" />

      <div className="relative z-10 w-full pt-16 px-4 max-w-md">
        <div className="flex items-center gap-4 mb-10 px-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border flex items-center justify-center bg-black/40 backdrop-blur-md shadow-lg shadow-black/50"
            style={{ borderColor: lime }}
          >
            <ArrowLeft size={20} color={lime} />
          </button>
          <div>
            <h1
              className="text-2xl font-black tracking-wider uppercase leading-none"
              style={{ color: lime }}
            >
              ABOUT US
            </h1>
            <p className="text-[8px] font-bold opacity-40 tracking-[0.4em] uppercase mt-1">
              Management Structure
            </p>
          </div>
        </div>

        <div className="mb-10 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <div
            className="p-6 rounded-5xl border bg-black/40 backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/40"
            style={{ borderColor: `${lime}33` }}
          >
            <Network
              className="absolute -top-4 -right-4 opacity-5 rotate-12"
              size={80}
              color={lime}
            />
            <p className="text-xs italic leading-relaxed text-white/70 text-center font-medium">
              &quot;Kepanitiaan Vidya Sambandha terdiri dari Dewan Pengurus Harian sebagai pimpinan tertinggi, didampingi dua Wakil Ketua yaitu Kepkom dan Kelstra. yang masing-masing membawahi bidang-bidang teknis pelaksana acara.&quot;
            </p>
          </div>
        </div>

        <div className="w-full space-y-4 pr-2">
          <div className="flex items-center justify-between px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
              The Structure
            </p>
            <div className="h-px flex-1 ml-4 bg-white/5" />
          </div>
          <div className="bg-black/20 rounded-5xl py-4">
            <VerticalTreeNode
              node={hierarchyData}
              onInfoClick={setSelectedMember}
              alwaysExpanded
            />
          </div>
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="relative w-full max-w-85 p-8 rounded-6xl border bg-black shadow-[0_0_60px_rgba(163,255,18,0.15)] animate-in zoom-in-95 duration-300"
            style={{ borderColor: lime }}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-8 right-8 text-white/30 active:text-white"
            >
              <X size={24} />
            </button>
            <div className="text-center space-y-6">
              <div
                className="w-28 h-28 rounded-full border-2 mx-auto overflow-hidden shadow-inner shadow-black relative"
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
                <p className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em] leading-none">
                  {selectedMember.role}
                </p>
                <h2
                  className="text-xl font-black italic uppercase tracking-tighter mt-1.5 leading-tight"
                  style={{ color: lime }}
                >
                  {selectedMember.name}
                </h2>
              </div>
              <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-sm leading-relaxed text-white/70 italic px-2">
                &quot;{selectedMember.jobdesk || "Tidak ada deskripsi pekerjaan."}&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </main>
  );
}