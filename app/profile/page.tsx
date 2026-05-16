'use client';

import BottomNav from '../components/BottomNav';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faRightFromBracket,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { X } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';
import Token from '@/utils/auth/token';
import { User } from '@/schema/user';
import { userAPI } from '@/utils/api/listAPI';
import Image from 'next/image';
import { ChangePassword } from '@/schema/request';
import { handleObjectChange } from '@/utils/form/handleChange';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

export default function ProfilePage() {
  const lime = '#A3FF12';
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSignout, setOpenSignout] = useState(false);
  const [formChangePass, setFormChangePass] = useState<ChangePassword>({
    oldPassword: "",
    newPassword:"",
    confirmPassword:""
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>)=>{
    handleObjectChange<ChangePassword>(e,setFormChangePass);
  }
  const handleSave = (e: React.SubmitEvent)=>{
    e.preventDefault();
    userAPI.changePassword(formChangePass).catch(e=>{
      
    })
  }

  useEffect(() => {
    userAPI.getProfile()
      .then((data) => {
        setProfile(data.data as User);
      })
      .catch(() => {
        Token.logout();
        router.push('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      Loading...
    </div>
  );

  if (!profile) return null;

  const nama = profile.peserta?.nama ?? profile.sekretaris?.nama ?? '-';
  const npm  = profile.peserta?.npm  ?? profile.sekretaris?.npm  ?? '-';

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28`}>
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 pt-16 flex flex-col items-center">
        {/* FOTO */}
      <Image
        src={'/img/default-avatar.png'}
        alt={''}
        width={112}
        height={112}
        className="w-28 h-28 rounded-full object-cover border-2"
        style={{
          borderColor: lime,
          boxShadow: '0 0 20px rgba(163,255,18,0.6)',
        }}
      />

        {/* NAMA */}
        <div className="flex items-center gap-2 mt-6 uppercase">
          <FontAwesomeIcon icon={faUser} color={lime} />
          <h2 className="text-xl font-black" style={{ color: lime }}>
            {nama}
          </h2>
        </div>

        <button
          onClick={() => setOpenEdit(true)}
          className="mt-3 px-6 py-2 rounded-full text-black font-black text-xs uppercase active:scale-95"
          style={{ backgroundColor: lime }}
        >
          EDIT PASSWORD
        </button>

        <div className="mt-8 w-full max-w-md px-4">
          <div
            className="p-6 rounded-4xl border-2 backdrop-blur-xl bg-black/40 space-y-4"
            style={{ borderColor: lime }}
          >
            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon icon={faEnvelope} color={lime} />
              <p>{profile.username}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon icon={faPhone} color={lime} />
              <p>{npm}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon icon={faCalendar} color={lime} />
              <p>ANGKATAN 2025</p>
            </div>
          </div>

          <button
            onClick={() => setOpenSignout(true)}
            className="w-full mt-6 py-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase"
            style={{ borderColor: lime, color: lime }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            SIGN OUT
          </button>
        </div>
      </div>

      {/* POPUP EDIT */}
      {openEdit && (
        <form className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onSubmit={handleSave}>
          <div className="p-0.5 rounded-[28px] bg-[#A3FF12] shadow-[0_0_25px_#A3FF12]">
            <div className="bg-black rounded-[26px] p-8 pt-10 w-[320px] relative">
              <X
                className="absolute top-3 right-3 text-[#A3FF12] cursor-pointer"
                size={20}
                onClick={() => setOpenEdit(false)}
              />

              <div className="space-y-4 mt-4">
                <Input
                  icon={faLock}
                  placeholder="OLD PASSWORD"
                  name="oldPassword"
                  type='password'
                  value={formChangePass?.oldPassword}
                  onChange={handleChangeForm}
                />
                <Input
                  icon={faLock}
                  placeholder="NEW PASSWORD"
                  name="newPassword"
                  type='password'
                  value={formChangePass?.newPassword}
                  onChange={handleChangeForm}
                />
                <Input
                  icon={faLock}
                  placeholder="CONFIRM PASSWORD"
                  name="confirmPassword"
                  type='password'
                  value={formChangePass.confirmPassword}
                  onChange={handleChangeForm}
                />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type='submit'
                  className="px-8 py-2 rounded-full bg-[#A3FF12] text-black font-black text-xs active:scale-95"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* POPUP LOGOUT */}
      {openSignout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="p-[2px] rounded-[20px] bg-[#A3FF12] shadow-[0_0_20px_#A3FF12]">
            <div className="bg-black rounded-[18px] px-6 py-6 w-[280px] text-center">
              <p className="text-[#A3FF12] font-black text-sm mb-4 uppercase">
                ARE YOU SURE ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenSignout(false)}
                  className="flex-1 py-2 rounded-full border text-[#A3FF12] text-xs font-bold"
                  style={{ borderColor: lime }}
                >
                  MAYBE LATER
                </button>
                <button
                  onClick={() => {
                    Token.logout();
                    router.push('/login');
                  }}
                  className="flex-1 py-2 rounded-full bg-[#A3FF12] text-black text-xs font-black"
                >
                  YEAH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

interface InputProps {
  icon: IconDefinition;
  placeholder: string;
  type?: string;
  value: string;
  name:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ icon, placeholder, type = 'text', value, onChange, name }: InputProps) {
  return (
    <div className="p-[1.5px] rounded-full bg-[#A3FF12]/70">
      <div className="bg-black rounded-full px-4 py-3 flex items-center gap-3">
        <FontAwesomeIcon icon={icon} color="#A3FF12" className="text-sm" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className="bg-transparent text-[#A3FF12] placeholder:text-white/40 outline-none text-xs w-full"
        />
      </div>
    </div>
  );
}