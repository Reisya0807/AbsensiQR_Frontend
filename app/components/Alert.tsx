import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

export default function Alert({ message, type }: AlertProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-99"
      >
        <div
          className={`px-6 py-4 rounded-2xl backdrop-blur-xl border text-white shadow-lg ${
            type === 'success'
              ? 'border-[#A3FF12] bg-[#A3FF12]/10'
              : 'border-red-400 bg-red-400/10'
          }`}
          style={{
            boxShadow:
              type === 'success'
                ? '0 0 15px #A3FF12'
                : '0 0 15px rgba(255,0,0,0.5)',
          }}
        >
          {message}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
