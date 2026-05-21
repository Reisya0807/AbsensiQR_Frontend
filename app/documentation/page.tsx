"use client";

import { Space_Grotesk } from "next/font/google";
import PageContainer from "../components/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faVideo } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import dok1 from "@/public/img/dokumentasi/1.jpeg";
import dok2 from "@/public/img/dokumentasi/2.jpeg";
import dok3 from "@/public/img/dokumentasi/3.png";
import dok4 from "@/public/img/dokumentasi/4.jpeg";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space",
});

interface DocCardProps {
  title: string;
  type: string;
  icon: IconDefinition;
  lime: string;
  comingSoon?: boolean;
  embedUrl?: string;
}

function DocCard({ title, type, icon, lime, comingSoon = true, embedUrl }: DocCardProps) {
  const handleViewClick = () => {
    if (embedUrl) window.open(embedUrl, "_blank");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 bg-black/40 backdrop-blur-sm p-4 transition-all active:scale-95" style={{ borderColor: lime }}>
      {/* badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-black/80 text-[8px] font-black tracking-widest px-2 py-1 rounded border" style={{ color: lime, borderColor: lime }}>
            COMING SOON
          </span>
        </div>
      )}

      {/* media */}
      <div className="aspect-video w-full rounded-xl bg-white/10 mb-4 flex items-center justify-center border border-white/5 overflow-hidden relative">
        {!comingSoon && embedUrl ? (
          <iframe className="absolute inset-0 w-full h-full rounded-xl" src={embedUrl} title={title} frameBorder="0" allowFullScreen />
        ) : (
          <FontAwesomeIcon icon={icon} className="text-4xl opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: lime }} />
        )}
      </div>

      {/* content */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] opacity-50 uppercase">{type}</p>
          <h3 className="text-lg font-black italic tracking-tighter mt-1" style={{ color: lime }}>
            {title}
          </h3>
        </div>

        {/* action */}
        <button
          onClick={handleViewClick}
          disabled={comingSoon && !embedUrl}
          className={`px-4 py-1 rounded-full text-[10px] font-black border transition-colors ${comingSoon && !embedUrl ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
          style={{ borderColor: lime, color: lime }}
        >
          VIEW
        </button>
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  const lime = "#A3FF12";
  const photos = [dok1, dok2, dok3, dok4];

  return (
    <div className={spaceGrotesk.className}>
      <PageContainer title="DOKUMENTASI">
        <div className="w-full space-y-8">
          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocCard title="VIDEO DOCUMENTER" type="Doc" icon={faVideo} lime={lime} />
            <DocCard title="AFTER MOVIE" type="Cinematic" icon={faVideo} lime={lime} />
          </div>

          {/* gallery */}
          <div className="pt-4">
            <p className="text-[10px] font-black tracking-[0.3em] mb-4 opacity-50 uppercase" style={{ color: lime }}>
              Dokumentasi Foto
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl border-2 bg-black/40 overflow-hidden" style={{ borderColor: lime }}>
                  <Image src={photo} alt={`Dokumentasi ${i + 1}`} fill className="object-cover transition-transform hover:scale-110 duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
