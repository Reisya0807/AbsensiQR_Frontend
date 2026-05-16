'use client';

import BottomNav from '../components/BottomNav';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faLocationDot, faLock } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';
import { useState, useEffect, useMemo } from 'react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

const EVENT_DATE = { year: 2026, month: 4, day: 17 };

const RUNDOWN_DATA = [
  { id: 1, title: "Registrasi & Open Gate", time: "09:00", duration: 30, location: "Aula Hadji Hasan" },
  { id: 2, title: "Pembukaan Oleh MC", time: "09:30", duration: 5, location: "Aula Hadji Hasan" },
  { id: 3, title: "Ayat Suci Al-Qur'an", time: "09:35", duration: 10, location: "Aula Hadji Hasan" },
  { id: 4, title: "Indonesia Raya & Karatagan", time: "09:45", duration: 10, location: "Aula Hadji Hasan" },
  { id: 5, title: "Sambutan Ketua Pelaksana", time: "09:55", duration: 5, location: "Aula Hadji Hasan" },
  { id: 6, title: "Sambutan Ketua Angkatan", time: "10:00", duration: 5, location: "Aula Hadji Hasan" },
  { id: 7, title: "Sambutan Ketum HMTIF", time: "10:05", duration: 5, location: "Aula Hadji Hasan" },
  { id: 8, title: "Sambutan Kaprodi", time: "10:10", duration: 5, location: "Aula Hadji Hasan" },
  { id: 9, title: "Prosesi Pelantikan", time: "10:15", duration: 15, location: "Aula Hadji Hasan" },
  { id: 10, title: "Doa & Dokumentasi", time: "10:30", duration: 10, location: "Aula Hadji Hasan" },
  { id: 11, title: "Ramah Tamah", time: "10:40", duration: 60, location: "Aula Hadji Hasan" },
  { id: 12, title: "ISHOMA", time: "11:40", duration: 80, location: "Fleksibel" },
  { id: 13, title: "Talkshow Angkatan", time: "13:00", duration: 35, location: "Aula Hadji Hasan" },
  { id: 14, title: "Ice Breaking", time: "13:35", duration: 15, location: "Aula Hadji Hasan" },
  { id: 15, title: "Menfess", time: "13:50", duration: 15, location: "Aula Hadji Hasan" },
  { id: 16, title: "Bingo Challange", time: "14:05", duration: 40, location: "Aula Hadji Hasan" },
  { id: 17, title: "Ice Breaking", time: "14:45", duration: 15, location: "Aula Hadji Hasan" },
  { id: 18, title: "ISHOMA", time: "15:00", duration: 30, location: "Fleksibel" },
  { id: 19, title: "Parallel Event & Showcase", time: "15:30", duration: 150, location: "Aula Hadji Hasan" },
  { id: 20, title: "ISHOMA", time: "18:00", duration: 30, location: "Fleksibel" },
  { id: 21, title: "Penampilan IF 25", time: "18:30", duration: 15, location: "Aula Hadji Hasan" },
  { id: 22, title: "Video Angkatan 25", time: "18:45", duration: 15, location: "Aula Hadji Hasan" },
  { id: 23, title: "Awarding Lomba", time: "19:00", duration: 5, location: "Aula Hadji Hasan" },
  { id: 24, title: "Penutupan", time: "19:05", duration: 5, location: "Aula Hadji Hasan" },
  { id: 25, title: "Guest Star Performance", time: "19:10", duration: 120, location: "Aula Hadji Hasan" },
];

export default function RundownPage() {
  const lime = '#A3FF12';
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const checkTimeStatus = (startTimeStr: string, durationMin: number, now: Date) => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);

    const start = new Date(now);
    start.setFullYear(EVENT_DATE.year, EVENT_DATE.month, EVENT_DATE.day);
    start.setHours(hours, minutes, 0);

    const end = new Date(start);
    end.setMinutes(start.getMinutes() + durationMin);

    if (now >= start && now < end) return "LIVE";
    if (now < start) return "UPCOMING_CANDIDATE";
    return "PAST";
  };

  const filteredRundown = useMemo(() => {
  return RUNDOWN_DATA.reduce<typeof RUNDOWN_DATA>((acc, item) => {
    const status = checkTimeStatus(item.time, item.duration, currentTime);
    if (status === "PAST" || status === "LIVE") {
      acc.push(item);
    } else if (status === "UPCOMING_CANDIDATE" && !acc.some(i => checkTimeStatus(i.time, i.duration, currentTime) === "UPCOMING_CANDIDATE")) {
      acc.push(item);
    }
    return acc;
  }, []);
}, [currentTime]);
  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen text-white pb-28 bg-black`}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/img/bg-texture.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex items-center gap-4 px-6 py-8 border-b border-white/10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90" style={{ borderColor: lime }}>
          <FontAwesomeIcon icon={faArrowLeft} color={lime} />
        </button>
        <h1 className="font-black text-2xl tracking-tighter uppercase" style={{ color: lime }}>
          EVENT RUNDOWN
        </h1>
      </div>

      <div className="relative z-10 px-6 pt-6">
        {filteredRundown.map((item) => {
          const status = checkTimeStatus(item.time, item.duration, currentTime);
          const isUpcoming = status === "UPCOMING_CANDIDATE";
          const isLive = status === "LIVE";
          const isPast = status === "PAST";

          return (
            <div
              key={item.id}
              className="relative p-5 rounded-3xl border-2 mb-5 flex items-start transition-all duration-300"
              style={{
                borderColor: isLive ? lime : isUpcoming ? `${lime}44` : `${lime}22`,
                boxShadow: isLive ? `0 0 20px ${lime}44` : 'none',
                backgroundColor: isLive ? 'rgba(163,255,18,0.1)' : 'rgba(0,0,0,0.4)',
                opacity: isPast ? 0.4 : 1,
              }}
            >
              <div className="flex flex-col items-center mr-5 min-w-16.25">
                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-1" style={{ borderColor: lime }}>
                  <FontAwesomeIcon icon={isUpcoming ? faLock : faClock} color={lime} className="text-xl" />
                </div>
                <span className="text-[10px] font-bold text-white/80 uppercase text-center leading-tight">
                  {item.time}
                </span>
              </div>

              <div className="flex-1 pt-1">
                {isUpcoming ? (
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-[15px] font-black mb-3 leading-tight italic uppercase" style={{ color: lime }}>
                      {item.title}
                    </p>
                    <div className="space-y-2 text-white/90">
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
                        <FontAwesomeIcon icon={faClock} style={{ color: lime }} />
                        <span>{item.duration} MIN</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: lime }} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {(isLive || isUpcoming) && (
                <div className="absolute right-4 top-6">
                  <span
                    className={`text-[9px] font-black px-3 py-0.5 rounded-full border-2 italic ${isLive ? 'animate-pulse' : ''}`}
                    style={{
                      borderColor: lime,
                      color: lime,
                      backgroundColor: isLive ? `${lime}22` : 'transparent'
                    }}
                  >
                    {isLive ? 'LIVE' : 'LOCKED'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filteredRundown.length === 0 && (
          <div className="text-center py-20 opacity-40 uppercase font-black tracking-widest italic">
            Event Scheduled for May 24
          </div>
        )}
      </div>

      <div className="relative z-20">
        <BottomNav />
      </div>
    </main>
  );
}