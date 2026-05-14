"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
          <img
            src="/img/vidya.png"
            alt="Vidya"
            className="rounded-xl mb-4"
          />

          {/* TEXT UTAMA */}
          <p className="text-xs text-white/70 leading-relaxed">
            Vidya Sambandha adalah acara untuk mempererat silaturahmi
            dan membangun kebersamaan antar mahasiswa angkatan 2025.
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
                  Acara ini juga menjadi wadah kolaborasi, inovasi,
                  serta pengembangan potensi mahasiswa melalui berbagai
                  kegiatan seperti seminar, workshop, dan hiburan.
                  Dengan semangat kebersamaan, diharapkan tercipta
                  hubungan yang solid dan berkelanjutan antar mahasiswa.
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