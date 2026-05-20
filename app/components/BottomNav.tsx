"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Home,
  FileText,
  Briefcase,
  User,
  ScanLine,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

const lime = "#A3FF12";

type ItemProps = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>;
  route: string;
  currentPath: string;
};

type DesktopItemProps = {
  label: string;
  route: string;
  currentPath: string;
};

function MobileItem({ Icon, route, currentPath }: ItemProps) {
  const router = useRouter();

  const isActive =
    route === "/home"
      ? currentPath === "/home" || currentPath === "/fund" || currentPath === "/rundown"
      : currentPath === route;

  const handleClick = useCallback(() => {
    if (currentPath !== route) router.push(route);
  }, [currentPath, route, router]);

  return (
    <button
      onClick={handleClick}
      className="flex-1 flex justify-center items-center cursor-pointer transition-all duration-200"
    >
      <Icon
        size={20}
        strokeWidth={2.5}
        color={isActive ? lime : "rgba(255,255,255,0.5)"}
        style={{ filter: isActive ? `drop-shadow(0 0 6px ${lime})` : "none" }}
      />
    </button>
  );
}

function DesktopItem({ label, route, currentPath }: DesktopItemProps) {
  const router = useRouter();

  const isActive =
    route === "/home"
      ? currentPath === "/home" || currentPath === "/fund" || currentPath === "/rundown"
      : currentPath === route;

  const handleClick = useCallback(() => {
    router.push(route);
  }, [route, router]);

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 cursor-pointer transition-all duration-200 relative group"
    >
      <span
        className="text-sm font-medium uppercase tracking-wide transition-colors duration-200"
        style={{ color: isActive ? lime : "rgba(255,255,255,0.7)" }}
      >
        {label}
      </span>
      {/* Underline aktif */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200"
        style={{
          backgroundColor: lime,
          boxShadow: `0 0 8px ${lime}`,
          opacity: isActive ? 1 : 0,
        }}
      />
      {/* Hover underline */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 opacity-0 group-hover:opacity-40"
        style={{ backgroundColor: lime }}
      />
    </button>
  );
}

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const isScanActive = path === "/scan";

  const handleScanClick = useCallback(() => {
    router.push("/scan");
  }, [router]);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  return (
    <>
      {/* ── Desktop Top Navbar ── */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-70 px-8 py-3 items-center justify-between bg-transparent ">

        {/* Logo kiri — gunakan gambar jika ada, fallback teks */}
        <button onClick={() => router.push("/home")} className="flex items-center cursor-pointer">
          <div className="relative w-10 h-10">
            <Image
              src="/img/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              onError={(e) => {
                // fallback jika gambar tidak ada
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Fallback text logo */}

          </div>
        </button>

        {/* Menu tengah */}
        <div className="flex items-center gap-1">
          <DesktopItem label="HOME" route="/home" currentPath={path} />
          <DesktopItem label="CERTIFICATE" route="/certificate" currentPath={path} />
          <DesktopItem label="ABOUT US" route="/aboutus" currentPath={path} />
          <DesktopItem label="SCAN" route="/scan" currentPath={path} />
          <DesktopItem label="DOKUMENTASI" route="/documentation" currentPath={path} />
          <DesktopItem label="PORTFOLIO" route="/portfolio" currentPath={path} />
        </div>

        {/* Profile icon kanan */}
        <button
          onClick={handleProfileClick}
          className="cursor-pointer transition-all duration-200 p-1"
        >
          <User
            size={22}
            strokeWidth={2}
            color={path === "/profile" ? lime : "rgba(255,255,255,0.7)"}
            style={{
              filter: path === "/profile" ? `drop-shadow(0 0 6px ${lime})` : "none",
            }}
          />
        </button>
      </nav>

      {/* ── Mobile Bottom Navbar ── */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
        <div
          className="flex items-center px-2 py-3 rounded-full bg-[#0a0a0a] border"
          style={{
            borderColor: lime,
            boxShadow: `0 0 18px rgba(163,255,18,0.25), inset 0 0 12px rgba(0,0,0,0.8)`,
          }}
        >
          <MobileItem Icon={Home} route="/home" currentPath={path} />
          <MobileItem Icon={FileText} route="/certificate" currentPath={path} />
          <MobileItem Icon={Info} route="/aboutus" currentPath={path} />

          {/* Scan — tombol tengah lebih besar */}
          <button
            onClick={handleScanClick}
            className="w-12 h-12 mx-2 rounded-full flex items-center justify-center border cursor-pointer shrink-0 transition-all active:scale-90"
            style={{
              borderColor: lime,
              backgroundColor: isScanActive ? `${lime}20` : "transparent",
              boxShadow: isScanActive
                ? `0 0 20px ${lime}, 0 0 40px rgba(163,255,18,0.3)`
                : `0 0 12px rgba(163,255,18,0.4)`,
            }}
          >
            <ScanLine
              size={22}
              strokeWidth={2.5}
              color={isScanActive ? lime : "white"}
              style={{
                filter: isScanActive ? `drop-shadow(0 0 6px ${lime})` : "none",
              }}
            />
          </button>

          <MobileItem Icon={ImageIcon} route="/documentation" currentPath={path} />
          <MobileItem Icon={Briefcase} route="/portfolio" currentPath={path} />
          <MobileItem Icon={User} route="/profile" currentPath={path} />
        </div>
      </div>
    </>
  );
}