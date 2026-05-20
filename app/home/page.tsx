'use client';

import BottomNav from '../components/BottomNav';
import AboutPanel from '../components/AboutPanel';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDollarToSlot, faCalendarDays, faQrcode, faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { useSyncExternalStore } from 'react';
import Token from '@/utils/auth/token';
import { Role } from '@/schema/user';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

function subscribe() { return () => {}; }
function getSnapshot() { return true; }
function getServerSnapshot() { return false; }

interface MenuCardProps {
  title: string;
  desc: string;
  icon: IconDefinition;
  link: string;
  isSpecial?: boolean;
}

function MenuCard({ title, desc, icon, link, isSpecial = false }: MenuCardProps) {
  const lime = '#A3FF12';
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(link)}
      className="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer bg-black/40 backdrop-blur-sm transition-shadow hover:shadow-[0_0_25px_rgba(163,255,18,0.45)]"
      style={{
        borderColor: isSpecial ? '#FFFFFF' : lime,
        boxShadow: isSpecial
          ? '0 0 15px rgba(255,255,255,0.1)'
          : '0 0 15px rgba(163,255,18,0.2)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0"
          style={{ borderColor: isSpecial ? '#FFFFFF' : lime }}
        >
          <FontAwesomeIcon
            icon={icon}
            style={{ color: isSpecial ? '#FFFFFF' : lime }}
            className="text-lg"
          />
        </div>
        <div>
          <p
            className="text-xs font-black tracking-wider uppercase"
            style={{ color: isSpecial ? '#FFFFFF' : lime }}
          >
            {title}
          </p>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      <span className="font-black text-xl shrink-0 ml-2" style={{ color: isSpecial ? '#FFFFFF' : lime }}>
        →
      </span>
    </motion.div>
  );
}

export default function HomePage() {
  const lime = '#A3FF12';

  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isAdmin = mounted && Token.getUser()?.role === Role.SEKRETARIS;

  return (
    <main
      className={`${spaceGrotesk.className} relative min-h-screen bg-black text-white`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      {/* Layout wrapper */}
      <div className="relative z-10 flex min-h-screen max-w-5xl pt-16 md:pt-20 pb-28 md:pb-8 px-4 md:px-10 gap-6 mx-auto">
  
          {/* Kolom kiri — di desktop jadi 50% */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 min-w-0 py-4">
          {/* Hero card */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl border-2 overflow-hidden cursor-pointer bg-black/20 shrink-0"
            style={{
              borderColor: lime,
              boxShadow: '0 0 25px rgba(163,255,18,0.3)',
            }}
          >
            <Image
              src="/img/vidya.png"
              alt="Vidya Sambandha"
              width={1200}
              height={500}
              className="w-full h-auto object-center object-cover"
            />
          </motion.div>

          {/* Admin controls */}
          {isAdmin && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black tracking-[0.2em] text-[#A3FF12] uppercase px-1">
                Admin Controls
              </p>
              <MenuCard title="GENERATE QR" desc="Create unique QR for participants" icon={faQrcode} link="/generate-qr" isSpecial />
              <MenuCard title="FUND TRANSPARENCY" desc="Track event budget & expenses" icon={faCircleDollarToSlot} link="/fund" />
              <MenuCard title="EVENT RUNDOWN" desc="Check event schedules & timeline" icon={faCalendarDays} link="/rundown" />
              <MenuCard title="PARTICIPANT DATA" desc="Manage & export attendee list" icon={faUsersViewfinder} link="/participants" isSpecial />
            </div>
          )}

          {/* Peserta menu */}
          {!isAdmin && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase px-1">
                Navigation Menu
              </p>
              <MenuCard title="FUND TRANSPARENCY" desc="Track event budget & expenses" icon={faCircleDollarToSlot} link="/fund" />
              <MenuCard title="EVENT RUNDOWN" desc="Check event schedules & timeline" icon={faCalendarDays} link="/rundown" />
            </div>
          )}
        </div>

        {/* Kolom kanan — About panel, desktop only */}
        <div className="hidden md:flex md:w-1/2 shrink-0 py-4">
          <AboutPanel /> 
        </div>
      </div>

      <BottomNav />
    </main>
  );
}