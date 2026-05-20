'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { Login } from '@/schema/request';
import { handleObjectChange } from '@/utils/form/handleChange';
import { authAPI } from '@/utils/api/listAPI';
import { getErrorMessage } from '@/utils/api/safeRequest';
import Token from '@/utils/auth/token';
import Alert from '../components/Alert';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

type AlertState = { message: string; type: 'success' | 'error' };

export default function LoginPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<Login>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const green = '#A3FF12';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      Token.login(res.data.token, res.data.user, res.data.user.firstLogin);
      router.replace('/home');
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
      className={`${spaceGrotesk.className} relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#080808] md:bg-[#6A8445]`}
    >
      {/* Alert */}
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* ======================================================== */}
      {/* 📱 TAMPILAN MOBILE (Hanya muncul di layar < md)          */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 z-0 pointer-events-none block md:hidden"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-[90%] max-w-md p-8 rounded-[40px] border border-[#A3FF12]/30 bg-black/60 backdrop-blur-xl block md:hidden"
      >
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="text-[#A3FF12] mb-4 text-xl active:scale-90 transition-transform block"
        >
          ←
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/img/logo.png" alt="Logo" width={96} height={96} className="w-24 h-24 object-contain" />
        </div>

        {/* Form Mobile */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm opacity-60">Username</label>
            <input
              autoComplete="off"
              name="username"
              value={loginForm.username}
              onChange={handleFormChange}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors placeholder:text-white/20"
              placeholder="Masukkan Username"
            />
          </div>

          <div>
            <label className="text-white text-sm opacity-60">Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleFormChange}
              className="w-full mt-1 p-4 rounded-xl bg-black/40 border border-[#A3FF12]/30 text-white outline-none focus:border-[#A3FF12] transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-center pt-2">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className={`px-10 py-2.5 rounded-lg font-bold text-black text-xs uppercase tracking-widest transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
              }`}
              style={{
                background: green,
                boxShadow: loading ? 'none' : `0 0 16px ${green}`,
              }}
            >
              {loading ? 'VERIFYING...' : 'LOGIN'}
            </motion.button>
          </div>
        </form>
      </motion.div>


      {/* ======================================================== */}
      {/* 💻 TAMPILAN DESKTOP (Sama seperti kode awal, tidak diubah) */}
      {/* ======================================================== */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative hidden md:flex rounded-3xl overflow-hidden"
        style={{
          width: '80vw',
          height: '80vh',
          padding: '3px',
          backgroundColor: '#6A8445',
        }}
      >
        {/* Inner wrapper — texture background untuk seluruh card */}
        <div
          className="relative flex w-full h-full rounded-[22px] overflow-hidden"
          style={{
            backgroundImage: "url('/img/bg-texture.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Kolom kiri — Form dengan dark overlay di atas texture */}
          <div className="relative w-full md:w-[50%] flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/75" />

            <div className="relative z-10 p-8 md:p-12">
              <h2 className="text-white text-2xl text-center font-semibold mb-8">Welcome</h2>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-widest block mb-1.5">Username</label>
                  <input
                    autoComplete="off"
                    name="username"
                    value={loginForm.username}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-lg bg-black/40 border border-[#A3FF12]/20 text-white text-sm outline-none focus:border-[#A3FF12] transition-colors placeholder:text-white/20"
                    placeholder="Masukkan NPM/username"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-xs uppercase tracking-widest block mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-lg bg-black/40 border border-[#A3FF12]/20 text-white text-sm outline-none focus:border-[#A3FF12] transition-colors placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className={`px-10 py-2.5 rounded-lg font-bold text-black text-xs uppercase tracking-widest transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                    }`}
                    style={{
                      background: green,
                      boxShadow: loading ? 'none' : `0 0 16px ${green}`,
                    }}
                  >
                    {loading ? 'VERIFYING...' : 'LOGIN'}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Kolom kanan — Logo (desktop only) */}
          <div className="hidden md:flex md:w-[50%] flex-col items-center justify-center px-8 py-10 text-center relative">
            <div
              className="absolute inset-3 rounded-2xl pointer-events-none"
              style={{ border: '2px solid rgba(163,255,18,0.5)', boxShadow: '0 0 12px rgba(163,255,18,0.2)' }}
            />
            <div
              className="absolute inset-0 rounded-r-[22px] pointer-events-none"
              style={{ border: '12px solid rgba(0,0,0,0.75)' }}
            />
            <div
              className="w-28 h-28 rounded-full border-2 border-[#A3FF12]/80 flex items-center justify-center overflow-hidden mb-6"
              style={{ boxShadow: `0 0 24px rgba(163,255,18,0.4)` }}
            >
              <Image src="/img/logo.png" alt="Logo" width={112} height={112} className="object-contain" />
            </div>
            <p className="text-[#A3FF12] font-black text-2xl uppercase tracking-widest leading-tight drop-shadow-lg">
              VIDYA SAMBANDHA
            </p>
            <p className="text-white/80 text-xs uppercase tracking-widest mt-3">
              SYUKURAN ANGKATAN 2025
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}