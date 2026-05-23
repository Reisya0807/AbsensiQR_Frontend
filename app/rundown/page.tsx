'use client';

import PageContainer from '../components/PageContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot, faLock } from '@fortawesome/free-solid-svg-icons';
import { Space_Grotesk } from 'next/font/google';
import { useState, useEffect, useMemo } from 'react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space',
});

const EVENT_DATE = { year: 2026, month: 4, day: 24 };
const lime = '#A3FF12';

const RUNDOWN_DATA = [
  { id: 1, title: "Registrasi & Open Gate", time: "09:00", duration: 30, location: "Aula Hadji Hasan" },
  { id: 2, title: "Pembukaan Oleh MC", time: "09:30", duration: 5, location: "Aula Hadji Hasan" },
  { id: 3, title: "Sambutan Tarian", time: "09:35", duration: 5, location: "Aula Hadji Hasan" },
  { id: 4, title: "Pembacaan Ayat Suci Al-Qur'an", time: "09:40", duration: 5, location: "Aula Hadji Hasan" },
  { id: 5, title: "Indonesia Raya & Karatagan Pasundan", time: "09:45", duration: 10, location: "Aula Hadji Hasan" },
  { id: 6, title: "Sambutan Ketua Pelaksana", time: "09:55", duration: 5, location: "Aula Hadji Hasan" },
  { id: 7, title: "Sambutan Ketua Angkatan 25", time: "10:00", duration: 5, location: "Aula Hadji Hasan" },
  { id: 8, title: "Sambutan Ketua Umum HMTIF", time: "10:05", duration: 5, location: "Aula Hadji Hasan" },
  { id: 9, title: "Sambutan Ketua Prodi", time: "10:10", duration: 5, location: "Aula Hadji Hasan" },
  { id: 10, title: "Sesi Apresiasi & Penyerahan Piagam", time: "10:15", duration: 5, location: "Aula Hadji Hasan" },
  { id: 11, title: "Prosesi Pelantikan & Potong Tumpeng", time: "10:20", duration: 10, location: "Aula Hadji Hasan" },
  { id: 12, title: "Doa Bersama & Dokumentasi", time: "10:30", duration: 10, location: "Aula Hadji Hasan" },
  { id: 13, title: "Ramah Tamah", time: "10:40", duration: 70, location: "Aula Hadji Hasan" },
  { id: 14, title: "ISHOMA & CLOSE GATE", time: "11:50", duration: 70, location: "Fleksibel" },
  { id: 15, title: "Talkshow Angkatan", time: "13:00", duration: 40, location: "Aula Hadji Hasan" },
  { id: 16, title: "Ice Breaking", time: "13:40", duration: 10, location: "Aula Hadji Hasan" },
  { id: 17, title: "Menfess", time: "13:50", duration: 15, location: "Aula Hadji Hasan" },
  { id: 18, title: "Bingo Challenge", time: "14:05", duration: 40, location: "Aula Hadji Hasan" },
  { id: 19, title: "Ice Breaking", time: "14:45", duration: 15, location: "Aula Hadji Hasan" },
  { id: 20, title: "ISHOMA", time: "15:00", duration: 30, location: "Fleksibel" },
  { id: 21, title: "Parallel Event & Showcase (Nintendo Sport, Food Court, dll)", time: "15:30", duration: 150, location: "Aula Hadji Hasan" },
  { id: 22, title: "ISHOMA", time: "18:00", duration: 30, location: "Fleksibel" },
  { id: 23, title: "Penampilan IF 25", time: "18:30", duration: 15, location: "Aula Hadji Hasan" },
  { id: 24, title: "Video Angkatan 25", time: "18:45", duration: 15, location: "Aula Hadji Hasan" },
  { id: 25, title: "Awarding Lomba", time: "19:00", duration: 5, location: "Aula Hadji Hasan" },
  { id: 26, title: "Penutupan & Foto Bersama", time: "19:05", duration: 5, location: "Aula Hadji Hasan" },
  { id: 27, title: "Guest Star Performance", time: "19:10", duration: 110, location: "Aula Hadji Hasan" }
];

export default function RundownPage() {
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

  const RundownCard = ({ item }: { item: typeof RUNDOWN_DATA[0] }) => {
    const status = checkTimeStatus(item.time, item.duration, currentTime);
    const isUpcoming = status === "UPCOMING_CANDIDATE";
    const isLive = status === "LIVE";
    const isPast = status === "PAST";

    return (
      <div
        className="relative p-5 rounded-3xl border-2 flex items-start transition-all duration-300"
        style={{
          borderColor: isLive ? lime : isUpcoming ? `${lime}44` : `${lime}22`,
          boxShadow: isLive ? `0 0 20px ${lime}44` : 'none',
          backgroundColor: isLive ? 'rgba(163,255,18,0.1)' : 'rgba(0,0,0,0.4)',
          opacity: isPast ? 0.4 : 1,
        }}
      >
        <div className="flex flex-col items-center mr-5 min-w-16">
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
  };

  return (
    <div className={spaceGrotesk.className}>
      <PageContainer title="EVENT RUNDOWN">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRundown.map(item => <RundownCard key={item.id} item={item} />)}
          {filteredRundown.length === 0 && (
            <div className="md:col-span-2 text-center py-20 opacity-40 uppercase font-black tracking-widest italic">
              Event Scheduled for May 17
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}