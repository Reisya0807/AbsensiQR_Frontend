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

  const [loginForm, setLoginForm] = useState<Login>({
    username: '',
    password: '',
  });
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
      {alert && <Alert message={alert.message} type={alert.type} />}

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
          <Image src="/img/logo.png" alt="Logo" width={96} height={96} className="w-24 h-24" />
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
