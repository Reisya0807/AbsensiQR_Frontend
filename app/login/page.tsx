'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { Login } from '@/schema/request';
import { handleObjectChange } from '@/utils/form/handleChange';
import { authAPI } from '@/utils/api/listAPI';
import { getErrorMessage } from '@/utils/api/safeRequest';
import Token, { homeRouteForRole } from '@/utils/auth/token';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

type AlertState = { message: string; type: 'success' | 'error' };

export default function LoginPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<Login>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<AlertState | null>(null);

  const green = '#A3FF12';

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      setAlert({ message: 'Harap isi semua field!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(loginForm);
      if (!res.data?.token) {
        setAlert({ message: res.message || 'Login gagal', type: 'error' });
        return;
      }
      Token.login(res.data.token, res.data.user);
      router.replace(homeRouteForRole(res.data.user.role));
    } catch (err) {
      setAlert({ message: getErrorMessage(err, 'Login failed. Please try again.'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleObjectChange<Login>(e, setLoginForm);
  };

  return (
    <main
      className={`${spaceGrotesk.className} relative w-full h-screen flex items-center justify-center bg-[#080808] overflow-hidden`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="absolute top-0 z-50"
          >
            <div
              className={`px-6 py-4 rounded-2xl backdrop-blur-xl border text-white shadow-lg ${
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

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-[90%] max-w-md p-8 rounded-[40px] border border-[#A3FF12]/30 bg-black/60 backdrop-blur-xl"
      >
        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="text-[#A3FF12] mb-4 text-xl active:scale-90 transition-transform"
        >
          ←
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/img/logo.png" className="w-24" alt="Logo" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-white text-sm opacity-60">Username</label>
            <input
              autoComplete="off"
              name="username"
              value={loginForm.username}
              onChange={handleFormChange}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors"
              placeholder="Masukkan Username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm opacity-60">Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleFormChange}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors"
              placeholder="********"
            />
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`w-full py-4 rounded-full font-bold text-black uppercase tracking-widest transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            style={{
              background: green,
              boxShadow: loading ? 'none' : '0 0 20px #A3FF12',
            }}
          >
            {loading ? 'VERIFYING...' : 'LOGIN'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
