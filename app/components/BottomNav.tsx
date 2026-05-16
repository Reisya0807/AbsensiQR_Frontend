"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Briefcase,
  User,
  ScanLine,
  Info,
  Image as ImageIcon,
} from "lucide-react";

const lime = "#A3FF12";

type ItemProps = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>;
  route: string;
  currentPath: string;
};

function Item({ Icon, route, currentPath }: ItemProps) {
  const router = useRouter();

  const isActive =
    route === "/home"
      ? currentPath === "/home" || currentPath === "/fund" || currentPath === "/rundown"
      : currentPath === route;

  return (
    <button
      onClick={() => { if (currentPath !== route) router.push(route); }}
      className="flex-1 flex justify-center items-center cursor-pointer transition-all duration-200"
    >
      <Icon
        size={20}
        strokeWidth={2.5}
        color={isActive ? lime : "white"}
        style={{ filter: isActive ? `drop-shadow(0 0 6px ${lime})` : "none" }}
      />
    </button>
  );
}

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
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
        <Item Icon={Home} route="/home" currentPath={path} />
        <Item Icon={FileText} route="/certificate" currentPath={path} />
        <Item Icon={Info} route="/aboutus" currentPath={path} />

        <div
          onClick={() => router.push("/scan")}
          className="w-14 h-14 mx-1 rounded-full flex items-center justify-center border cursor-pointer shrink-0 transition-all active:scale-90"
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
            style={{ filter: isScanActive ? `drop-shadow(0 0 8px ${lime})` : "none" }}
          />
        </div>

        <Item Icon={ImageIcon} route="/documentation" currentPath={path} />
        <Item Icon={Briefcase} route="/portfolio" currentPath={path} />
        <Item Icon={User} route="/profile" currentPath={path} />
      </div>
    </div>
  );
}