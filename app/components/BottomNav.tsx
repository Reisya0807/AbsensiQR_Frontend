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

const ADMIN_ROUTES = ["/admin", "/generate-qr", "/participants"];

function isAdminPath(path: string): boolean {
  return ADMIN_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const lime = "#A3FF12";

  const isAdminRole = isAdminPath(path);
  const homeRoute = isAdminRole ? "/admin" : "/home";

  type ItemProps = {
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>;
    route: string;
  };

  const Item = ({ Icon, route }: ItemProps) => {
    const isActive =
      route === "/admin"
        ? isAdminPath(path)
        : route === "/home"
        ? path === "/home" || path === "/fund" || path === "/rundown"
        : path === route;

    return (
      <button
        onClick={() => {
          if (path !== route) router.push(route);
        }}
        className="flex-1 flex justify-center items-center cursor-pointer transition-all duration-200"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          color={isActive ? lime : "white"}
          style={{
            filter: isActive ? `drop-shadow(0 0 6px ${lime})` : "none",
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
        <Item Icon={Home} route={homeRoute} />
        <Item Icon={FileText} route="/certificate" />
        <Item Icon={Info} route="/aboutus" />

        <div
          onClick={() => router.push("/scan")}
          className="w-14 h-14 mx-1 rounded-full flex items-center justify-center border cursor-pointer flex-shrink-0 transition-all active:scale-90"
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
              filter: isScanActive ? `drop-shadow(0 0 8px ${lime})` : "none",
            }}
          />
        </div>

        <Item Icon={ImageIcon} route="/documentation" />
        <Item Icon={Briefcase} route="/portfolio" />
        <Item Icon={User} route="/profile" />
      </div>
    </div>
  );
}
