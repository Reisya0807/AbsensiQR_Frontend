"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

export default function AboutPage() {
  const lime = "#A3FF12";
  const [open, setOpen] = useState(false);

  

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 flex justify-center uppercase tracking-wider`}>

      {/* BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-sm mt-16 px-4">

        <div
          className="rounded-3xl p-5 border"
          style={{
            borderColor: lime,
            boxShadow: "0 0 25px rgba(163,255,18,0.3)",
          }}
        >

          {/* HEADER */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between mb-4 cursor-pointer"
          >
            <h2
              style={{ color: lime }}
              className="font-bold text-base tracking-wide"
            >
              ABOUT
            </h2>

            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ color: lime }}
                className="text-xl drop-shadow-[0_0_6px_#A3FF12]"
              />
            </motion.div>
          </div>

          {/* IMAGE */}
          <Image
            src="/img/vidya.png"
            alt="Vidya Sambandha Event"
            width={500}
            height={300}
            className="rounded-xl mb-4 w-full h-auto"
          />

          {/* TEXT UTAMA */}
          <p className="text-xs text-white/70 leading-relaxed">
            Vidya Sambandha hadir sebagai wadah kolaborasi mahasiswa angkatan 2025. Mengusung filosofi &apos;keterhubungan ilmu pengetahuan&apos;, acara ini menjadi ruang menyatukan ide, logika, dan kreativitas untuk membangun karya bersama.
          </p>

          {/* EXPAND */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-white/70 mt-3 leading-relaxed">
                  Di era yang serba cepat, inovasi lahir dari kolaborasi. Vidya Sambandha (Sanskerta: 
                  Keterhubungan Ilmu) hadir untuk menjembatani ide dan kreativitas antar mahasiswa.
                </p>
                <p className="text-xs text-white/70 mt-3 leading-relaxed">
                  Melalui tema <strong>&quot;Menjalin Silaturahmi, Menyatukan Logika, Membangun Karya&quot;</strong>, 
                  kami memanfaatkan potensi dan sumber daya di lingkungan Unpas untuk tumbuh dan 
                  berkembang bersama.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <BottomNav />
    </main>
  );
}