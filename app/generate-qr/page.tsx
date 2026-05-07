'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faMinus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function GenerateQR() {
  const router = useRouter();
  const lime = '#A3FF12';
  
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [zoom, setZoom] = useState(0.85);

  const generateNewToken = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    setQrValue(`PRESENCE-${timestamp}-${randomString}`);
    setTimeLeft(20);
  };

  useEffect(() => {
    generateNewToken();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white p-4 md:p-6 flex flex-col items-center relative overflow-hidden">
      <div 
        className="fixed inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/img/bg-texture.jpeg')", 
          backgroundSize: 'cover',
          opacity: 0.3 
        }} 
      />

      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center">
        <div className="w-full flex justify-between items-start mb-2">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 rounded-full bg-zinc-900/50 border border-white/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-lg text-white" />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <FontAwesomeIcon icon={faCamera} style={{ color: lime }} className="text-2xl mb-1" />
            <h1 className="text-[12px] font-black tracking-[0.4em] uppercase" style={{ color: lime }}>
              Scan Presence Code
            </h1>
          </div>

          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center -mt-4">
          <motion.div 
            animate={{ scale: zoom }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative bg-white p-4 md:p-8 rounded-[3rem] shadow-2xl"
            style={{ 
              width: 'min(70vh, 85vw)', 
              height: 'min(70vh, 85vw)',
              boxShadow: `0 0 80px rgba(163, 255, 18, 0.1)`
            }}
          >
            <div className="w-full h-full relative flex items-center justify-center">
              {qrValue && (
                <QRCodeSVG 
                  value={qrValue} 
                  size={1024} 
                  style={{ width: '100%', height: '100%' }}
                  level="H"
                />
              )}
            </div>
            
            <div className="absolute -top-2 -left-2 w-12 h-12 border-t-[5px] border-l-[5px] rounded-tl-2xl" style={{ borderColor: lime }} />
            <div className="absolute -top-2 -right-2 w-12 h-12 border-t-[5px] border-r-[5px] rounded-tr-2xl" style={{ borderColor: lime }} />
            <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-[5px] border-l-[5px] rounded-bl-2xl" style={{ borderColor: lime }} />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-[5px] border-r-[5px] rounded-br-2xl" style={{ borderColor: lime }} />
          </motion.div>

          <div className="mt-6 flex flex-col items-center">
            <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mb-1">Refreshing Token In</p>
            <p className="text-4xl font-black italic tracking-tighter" style={{ color: lime }}>{timeLeft}s</p>
          </div>
        </div>

        <div className="mt-auto pt-4 pb-2 w-full flex justify-center">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-3 px-6 rounded-[2rem] flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setZoom(Math.max(0.4, zoom - 0.05))}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/5"
              >
                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
              </button>
              
              <div className="flex flex-col items-center w-12">
                <span className="text-[8px] font-black opacity-30 tracking-widest uppercase">Zoom</span>
                <span className="text-xs font-bold" style={{ color: lime }}>{Math.round(zoom * 100)}%</span>
              </div>

              <button 
                onClick={() => setZoom(Math.min(1.1, zoom + 0.05))}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/5"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              </button>
            </div>

            <div className="h-6 w-[1px] bg-white/10" />

            <div className="flex flex-col">
              <span className="text-[8px] font-black opacity-30 tracking-widest uppercase">Encryption</span>
              <span className="text-[10px] font-bold text-white/70">SHA-256 LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}