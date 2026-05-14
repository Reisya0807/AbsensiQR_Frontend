'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPen, faChevronRight, faChevronLeft, 
  faChevronDown 
} from '@fortawesome/free-solid-svg-icons';

const INITIAL_DATA = [
  { id: 1, name: 'GANJAR PRANOWO', npm: '0123456801', hadir: true },
  { id: 2, name: 'PRABOWO SUBIANTO', npm: '0123456802', hadir: false },
  { id: 3, name: 'ANIES BASWEDAN', npm: '0123456803', hadir: true },
  { id: 4, name: 'RIDWAN KAMIL', npm: '0123456804', hadir: true },
  { id: 5, name: 'SANDIAGA UNO', npm: '0123456805', hadir: false },
  { id: 6, name: 'GIBRAN RAKABUMING', npm: '0123456806', hadir: true },
  { id: 7, name: 'ERIK THOHIR', npm: '0123456807', hadir: true },
  { id: 8, name: 'SRI MULYANI', npm: '0123456808', hadir: true },
  { id: 9, name: 'MAHFUD MD', npm: '0123456809', hadir: false },
  { id: 10, name: 'MUHAIMIN ISKANDAR', npm: '0123456810', hadir: true },
  { id: 11, name: 'NAJWA SHIHAB', npm: '0123456811', hadir: true },
  { id: 12, name: 'RAFFI AHMAD', npm: '0123456812', hadir: false },
  { id: 13, name: 'BASUKI HADIMULJONO', npm: '0123456813', hadir: true },
  { id: 14, name: 'BUDI GUNADI', npm: '0123456814', hadir: true },
  { id: 15, name: 'LUHUT PANDJAITAN', npm: '0123456815', hadir: false },
  { id: 16, name: 'PUAN MAHARANI', npm: '0123456816', hadir: true },
  { id: 17, name: 'AGUS HARIMURTI', npm: '0123456817', hadir: true },
  { id: 18, name: 'DEDY CORBUZIER', npm: '0123456818', hadir: false },
  { id: 19, name: 'KHAFIFAH INDAR', npm: '0123456819', hadir: true },
  { id: 20, name: 'SURYOHADI', npm: '0123456820', hadir: true },
].map(user => ({
  ...user,
  img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
}));

export default function ParticipantPage() {
  const lime = '#A3FF12';
  
  const [participants, setParticipants] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return participants.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.npm.includes(searchTerm)
    );
  }, [searchTerm, participants]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateStatus = (id: number, status: boolean) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, hadir: status } : p));
    setSelectedUser((prev: any) => ({ ...prev, hadir: status }));
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32 relative overflow-hidden">
      <div 
        className="fixed inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/img/bg-texture.jpeg')", 
          backgroundSize: 'cover',
          opacity: 0.5 
        }} 
      />

      <div className="relative z-10">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} style={{ color: lime }} className="opacity-60" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-black/60 border-2 py-4 pl-12 pr-4 rounded-full outline-none text-sm tracking-widest transition-all focus:border-[#A3FF12]"
            style={{ borderColor: lime }}
            placeholder="CARI NAMA ATAU NPM..."
          />
        </div>

        <div className="flex flex-col gap-4 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {currentItems.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-[1.5rem] border-2 bg-black/80 backdrop-blur-md"
                style={{ borderColor: lime, boxShadow: `0 0 10px ${lime}22` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl border-2 overflow-hidden bg-zinc-900" style={{ borderColor: lime }}>
                    <img src={user.img} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-[13px] tracking-tighter" style={{ color: lime }}>{user.name}</h3>
                    <p className="text-[10px] font-bold opacity-60 tracking-widest">{user.npm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${user.hadir ? 'bg-[#A3FF12]' : 'bg-red-500'}`} />
                      <span className="text-[8px] font-bold uppercase opacity-60">{user.hadir ? 'Hadir' : 'Tidak'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="w-8 h-8 flex items-center justify-center rounded-full active:scale-75 transition-transform"
                >
                  <FontAwesomeIcon icon={faPen} style={{ color: lime }} className="text-sm" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-8">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={currentPage === 1 ? 'opacity-10' : 'active:scale-90'}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ color: lime }} className="text-xl" />
            </button>
            <p className="text-xs font-black tracking-[0.3em] italic" style={{ color: lime }}>{currentPage} / {totalPages}</p>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'opacity-10' : 'active:scale-90'}>
              <FontAwesomeIcon icon={faChevronRight} style={{ color: lime }} className="text-xl" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black p-8 flex flex-col items-center"
          >
             <div 
              className="absolute inset-0 z-0" 
              style={{ backgroundImage: "url('/img/bg-texture.jpeg')", backgroundSize: 'cover', opacity: 0.5 }} 
            />
            
            <div className="relative z-10 w-full max-w-md">
              <div className="w-full flex justify-end mb-6">
                <button onClick={() => setSelectedUser(null)}>
                  <FontAwesomeIcon icon={faChevronDown} style={{ color: lime }} className="text-2xl" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-black mb-4" style={{ borderColor: lime, boxShadow: `0 0 20px ${lime}` }}>
                  <img src={selectedUser.img} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-black text-xl tracking-widest text-center" style={{ color: lime }}>{selectedUser.name}</h2>
              </div>

              <div className="space-y-4">
                <div className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">NPM</span>
                  <span className="font-bold text-sm" style={{ color: lime }}>{selectedUser.npm}</span>
                </div>

                <div className="px-6 py-4 rounded-full border-2 bg-black/60 flex justify-between items-center" style={{ borderColor: lime }}>
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Kehadiran</span>
                  <div className="flex gap-6">
                    <button onClick={() => handleUpdateStatus(selectedUser.id, true)} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedUser.hadir ? 'bg-[#A3FF12]' : 'border border-white'}`} style={{ boxShadow: selectedUser.hadir ? `0 0 10px ${lime}` : 'none' }} />
                      <span className={`text-[10px] font-black ${selectedUser.hadir ? 'text-[#A3FF12]' : 'text-white'}`}>HADIR</span>
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedUser.id, false)} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${!selectedUser.hadir ? 'bg-red-500' : 'border border-white'}`} />
                      <span className={`text-[10px] font-black ${!selectedUser.hadir ? 'text-red-500' : 'text-white'}`}>TIDAK</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-5 mt-8 rounded-full font-black text-black tracking-[0.3em] text-xs transition-all active:scale-95"
                  style={{ background: lime, boxShadow: `0 0 30px ${lime}66` }}
                >
                  UPDATE DATA
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}