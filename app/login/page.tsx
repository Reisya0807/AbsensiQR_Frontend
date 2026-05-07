'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function LoginPage() {
  const router = useRouter();
  
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const green = '#A3FF12';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setAlert({ message: 'Login berhasil, mengalihkan...', type: 'success' });

    setTimeout(() => {
      router.push('/home');
    }, 1000);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleNpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setNpm(value);
  };

  return (
    <main
      className={`${spaceGrotesk.className} relative w-full h-screen flex items-center justify-center bg-[#080808] overflow-hidden`}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="absolute top-0 z-50"
          >
            <div
              className={`px-6 py-4 rounded-2xl backdrop-blur-xl border text-white shadow-lg
              ${
                alert.type === 'success'
                  ? 'border-[#A3FF12] bg-[#A3FF12]/10'
                  : 'border-red-400 bg-red-400/10'
              }`}
              style={{
                boxShadow:
                  alert.type === 'success'
                    ? '0 0 15px #A3FF12'
                    : '0 0 15px rgba(255,0,0,0.5)',
              }}
            >
              {alert.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-[90%] max-w-md p-8 rounded-[40px] border border-[#A3FF12]/30 bg-black/60 backdrop-blur-xl"
      >
        <button
          onClick={() => router.push('/')}
          className="text-[#A3FF12] mb-4 text-xl active:scale-90 transition-transform"
        >
          ←
        </button>

        <div className="flex justify-center mb-6">
          <img src="/img/logo.png" className="w-24" alt="Logo" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm opacity-60">NPM</label>
            <input
              value={npm}
              onChange={handleNpmChange}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors"
              placeholder="Masukkan NPM"
            />
          </div>

          <div>
            <label className="text-white text-sm opacity-60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors"
              placeholder="********"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-black uppercase tracking-widest"
            style={{
              background: green,
              boxShadow: '0 0 20px #A3FF12',
            }}
          >
            {loading ? 'LOADING...' : 'LOGIN'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}