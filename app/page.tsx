'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function LandingPage() {
  const [phase, setPhase] = useState(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 800);
    const timer2 = setTimeout(() => setPhase(3), 2800);
    const timer3 = setTimeout(() => setPhase(4), 4200);
    const timer4 = setTimeout(() => setPhase(5), 5200);
    const timer5 = setTimeout(() => setPhase(6), 6000);
    return () => {
      [timer1, timer2, timer3, timer4, timer5].forEach(clearTimeout);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  const greenBase = '#96C15E';
  const greenText = '#A3FF12';

  return (
    <main className={`${spaceGrotesk.className} relative w-full h-screen overflow-hidden flex items-center justify-center`} style={{ backgroundColor: greenBase }}>
      {/* BASE BACKGROUND */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: greenBase }} />

      {/* PHASE 2: Welcome */}
      <AnimatePresence mode="wait">
        {phase === 2 && !isLoggingIn && (
          <motion.h1
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ duration: 1, ease: 'circOut' }}
            className="text-4xl font-bold text-black z-10 flex items-center gap-2"
          >
            welcome
          </motion.h1>
        )}
      </AnimatePresence>

      {/* OVERLAY UTAMA */}
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{
          clipPath: isLoggingIn ? 'circle(0% at 50% 50%)' : phase >= 3 ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{
          backgroundColor: '#080808',
          backgroundImage: phase >= 4 ? "url('/img/bg-texture.jpeg')" : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div animate={{ y: phase >= 5 ? -50 : 0 }} transition={{ duration: 1 }} className="flex flex-col-reverse items-center z-30">
          {/* TEXT */}
          <div className="flex flex-col items-center text-center mt-4">
            <motion.div initial={{ opacity: 0 }} animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 1 }}>
              <h2
                className="font-space text-2xl font-bold tracking-[0.25em] mb-2"
                style={{
                  color: greenText,
                  textShadow: `
                    0 0 5px #A3FF12,
                    0 0 15px #A3FF12,
                    0 0 30px rgba(163,255,18,0.6)
                  `,
                }}
              >
                VIDYA SAMBANDHA
              </h2>

              <p className="text-[10px] font-bold tracking-[0.2em] opacity-60 uppercase" style={{ color: greenText }}>
                Syukuran Angkatan 2025
              </p>
            </motion.div>

            {/* BUTTON */}
            <AnimatePresence>
              {phase >= 6 && !isLoggingIn && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-4">
                  <motion.button
                    onClick={handleLogin}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-3 px-24 rounded-full font-bold text-black shadow-xl cursor-pointer"
                    style={{
                      backgroundColor: greenText,
                      boxShadow: '0 8px 25px -5px rgba(180, 227, 75, 0.5)',
                    }}
                  >
                    LOGIN
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LOGO */}
          <motion.div initial={{ y: 60, opacity: 0 }} animate={phase >= 5 ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="mb-2">
            <Image src="/img/logo.png" alt="Logo" width={128} height={128} className="w-32 h-32 drop-shadow-[0_0_20px_rgba(180,227,75,0.4)]" priority />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
