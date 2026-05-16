'use client';

import BottomNav from '../components/BottomNav';
import { useState } from 'react';
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
import { X } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

export default function ProfilePage() {
  const lime = '#A3FF12';
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: 'WILSON LOSIENTO',
    email: 'alex.johnson@email.com',
    phone: '+1 555 123',
    angkatan: '2025',
    image: '/img/profile.png',
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [openSignout, setOpenSignout] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formImage, setFormImage] = useState(profile.image);

  // GANTI FOTO
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormImage(imageUrl);
  };

  // SAVE
  const handleSave = () => {
    if (password && password !== confirmPassword) {
      alert('Password tidak sama!');
      return;
    }

    setProfile({
      ...profile,
      image: formImage,
    });

    setPassword('');
    setConfirmPassword('');

    setOpenEdit(false);
  };

  // LOGOUT
  const handleSignOut = () => {
    // hapus cookie token
    document.cookie =
      'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // hapus local storage
    localStorage.removeItem('userRole');

    setOpenSignout(false);

    router.replace('/login');
  };

  return (
    <main
      className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28`}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/img/bg-texture.jpeg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 pt-16 flex flex-col items-center">
        {/* FOTO */}
        <img
          src={profile.image}
          className="w-28 h-28 rounded-full object-cover border-2"
          style={{
            borderColor: lime,
            boxShadow: '0 0 20px rgba(163,255,18,0.6)',
          }}
        />

        {/* NAMA */}
        <div className="flex items-center gap-2 mt-6 uppercase">
          <FontAwesomeIcon icon={faUser} color={lime} />

          <h2
            className="text-xl font-black"
            style={{ color: lime }}
          >
            {profile.name}
          </h2>
        </div>

        {/* EDIT */}
        <button
          onClick={() => setOpenEdit(true)}
          className="mt-3 px-6 py-2 rounded-full text-black font-black text-xs uppercase active:scale-95"
          style={{ backgroundColor: lime }}
        >
          EDIT PROFILE
        </button>

        {/* INFO */}
        <div className="mt-8 w-full max-w-md px-4">
          <div
            className="p-6 rounded-[2rem] border-2 backdrop-blur-xl bg-black/40 space-y-4"
            style={{ borderColor: lime }}
          >
            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon
                icon={faEnvelope}
                color={lime}
              />
              <p>{profile.email}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon icon={faPhone} color={lime} />
              <p>{profile.phone}</p>
            </div>

            {/* ANGKATAN */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <FontAwesomeIcon
                icon={faCalendar}
                color={lime}
              />
              <p>ANGKATAN {profile.angkatan}</p>
            </div>
          </div>

          {/* SIGN OUT */}
          <button
            onClick={() => setOpenSignout(true)}
            className="w-full mt-6 py-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase"
            style={{
              borderColor: lime,
              color: lime,
            }}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
            />
            SIGN OUT
          </button>
        </div>
      </div>

      {/* POPUP EDIT */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="p-[2px] rounded-[28px] bg-[#A3FF12] shadow-[0_0_25px_#A3FF12]">
            <div className="bg-black rounded-[26px] p-8 pt-10 w-[320px] relative">
              {/* CLOSE */}
              <X
                className="absolute top-3 right-3 text-[#A3FF12] cursor-pointer"
                size={20}
                onClick={() => setOpenEdit(false)}
              />

              {/* FOTO */}
              <div className="flex justify-center mb-6">
                <label className="cursor-pointer relative">
                  <img
                    src={formImage}
                    className="w-24 h-24 rounded-full object-cover border-2"
                    style={{
                      borderColor: lime,
                    }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="absolute bottom-0 right-0 bg-[#A3FF12] text-black text-[10px] px-2 py-1 rounded-full font-black">
                    EDIT
                  </div>
                </label>
              </div>

              {/* PASSWORD */}
              <div className="space-y-4">
                <Input
                  icon={faLock}
                  placeholder="NEW PASSWORD"
                  type="password"
                  value={password}
                  onChange={(e: any) =>
                    setPassword(e.target.value)
                  }
                />

                <Input
                  icon={faLock}
                  placeholder="CONFIRM PASSWORD"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: any) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>

              {/* SAVE */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSave}
                  className="px-8 py-2 rounded-full bg-[#A3FF12] text-black font-black text-xs active:scale-95"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  onClick={handleSignOut}
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

function Input({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
}: any) {
  return (
    <div className="p-[1.5px] rounded-full bg-[#A3FF12]/70">
      <div className="bg-black rounded-full px-4 py-3 flex items-center gap-3">
        <FontAwesomeIcon
          icon={icon}
          color="#A3FF12"
          className="text-sm"
        />

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent text-[#A3FF12] placeholder:text-white/40 outline-none text-xs w-full"
        />
      </div>
    </div>
  );
}