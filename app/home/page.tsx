'use client';

import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDollarToSlot, faCalendarDays, faQrcode, faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { useState } from 'react';
import Token from '@/utils/auth/token';
import { Role } from '@/schema/user';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

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
      className="flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer bg-black/40 backdrop-blur-sm"
      style={{
        borderColor: isSpecial ? '#FFFFFF' : lime,
        boxShadow: isSpecial
          ? '0 0 15px rgba(255,255,255,0.1)'
          : '0 0 15px rgba(163,255,18,0.2)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2" style={{ borderColor: isSpecial ? '#FFFFFF' : lime }}>
          <FontAwesomeIcon icon={icon} style={{ color: isSpecial ? '#FFFFFF' : lime }} className="text-xl" />
        </div>

        <div>
          <p className="text-sm font-black tracking-wider uppercase" style={{ color: isSpecial ? '#FFFFFF' : lime }}>
            {title}
          </p>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">{desc}</p>
        </div>
      </div>

      <span className="font-black text-xl" style={{ color: isSpecial ? '#FFFFFF' : lime }}>
        →
      </span>
    </motion.div>
  );
}

export default function HomePage() {
  const lime = '#A3FF12';
  const router = useRouter();
  const user = Token.getUser();
  const [isAdmin] = useState(user?.role === Role.SEKRETARIS);

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen bg-black text-white flex flex-col items-center pt-16 pb-28 overflow-hidden`}>
      {/* BG */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      {/* HEADER */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <Image src="/img/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
        {isAdmin && (
          <div className="px-3 py-1 rounded-full border border-[#A3FF12] text-[#A3FF12] text-[10px] font-bold tracking-widest uppercase">
            Admin Panel
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="z-10 w-full max-w-md px-6 flex flex-col gap-6 mt-10">
        {/* TITLE CARD */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/about')}
          className="rounded-4xl border-2 overflow-hidden cursor-pointer bg-black/20"
          style={{
            borderColor: lime,
            boxShadow: '0 0 25px rgba(163,255,18,0.3)',
          }}
        >
          <Image src="/img/vidya.png" alt="Vidya Sambandha Event" width={500} height={300} className="w-full h-auto object-cover" />
        </motion.div>

        {/* MENU SECTION TITLE */}
        <p className="text-[10px] font-black tracking-[0.2em] text-white/40 px-2 uppercase">Navigation Menu</p>

        {/* ADMIN CONTROLS SECTION - Only visible for admin */}
        {isAdmin && (
          <section className="flex flex-col gap-4">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#A3FF12] px-2 uppercase">
              Admin Controls
            </p>
            <div className="flex flex-col gap-4">
              <MenuCard
                title="GENERATE QR"
                desc="Create unique QR for participants"
                icon={faQrcode}
                link="/generate-qr"
                isSpecial={true}
              />
              <MenuCard
                title="PARTICIPANT DATA"
                desc="Manage & export attendee list"
                icon={faUsersViewfinder}
                link="/participants"
                isSpecial={true}
              />
            </div>
          </section>
        )}

        {/* GENERAL MENU SECTION */}
        <section className="flex flex-col gap-4">
          {isAdmin && (
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 px-2 uppercase">
              General Navigation
            </p>
          )}
          <div className="flex flex-col gap-4">
            <MenuCard title="FUND TRANSPARENCY" desc="Track event budget & expenses" icon={faCircleDollarToSlot} link="/fund" />
            <MenuCard title="EVENT RUNDOWN" desc="Check event schedules & timeline" icon={faCalendarDays} link="/rundown" />
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
