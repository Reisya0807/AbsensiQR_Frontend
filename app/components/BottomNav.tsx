"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Briefcase, 
  User, 
  ScanLine, 
  Info,    // Digunakan untuk About Us
  Image    // Digunakan untuk Documentation
} from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const lime = "#A3FF12";

  const Item = ({ Icon, route }: any) => {
    // Tombol Home tetap aktif jika berada di path /home, /fund, atau /rundown
    const isActive = route === "/home" 
      ? (path === "/home" || path === "/fund" || path === "/rundown") 
      : path === route;

    return (
      <button
        onClick={() => {
          if (!isActive) router.push(route);
        }}
        className="flex-1 flex justify-center items-center cursor-pointer transition-all duration-200"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          color={isActive ? lime : "white"}
          style={{
            filter: isActive
              ? `drop-shadow(0 0 6px ${lime})`
              : "none",
          }}
        />
      </button>
    );
  };

  const isScanActive = path === "/scan";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50">
      <div
        className="flex items-center px-2 py-3 rounded-full bg-black border"
        style={{
          borderColor: lime,
          boxShadow: "0 0 20px rgba(163,255,18,0.3)",
        }}
      >
        {/* Navigasi Utama */}
        <Item Icon={Home} route="/home" />
        <Item Icon={FileText} route="/certificate" />
        
        {/* Ikon Info untuk About Us */}
        <Item Icon={Info} route="/aboutus" />

        {/* Tombol Scan (Center) */}
        <div
          onClick={() => router.push("/scan")}
          className="w-14 h-14 mx-1 rounded-full flex items-center justify-center border cursor-pointer flex-shrink-0"
          style={{
            borderColor: lime,
            boxShadow: isScanActive
              ? `0 0 25px ${lime}`
              : `0 0 15px rgba(163,255,18,0.5)`,
          }}
        >
          <ScanLine
            size={26}
            strokeWidth={2.5}
            color={isScanActive ? lime : "white"}
            style={{
              filter: isScanActive
                ? `drop-shadow(0 0 8px ${lime})`
                : "none",
            }}
          />
        </div>

        {/* Ikon Image untuk Documentation */}
        <Item Icon={Image} route="/documentation" />
        
        <Item Icon={Briefcase} route="/portfolio" />
        <Item Icon={User} route="/profile" />
      </div>
    </div>
  );
}