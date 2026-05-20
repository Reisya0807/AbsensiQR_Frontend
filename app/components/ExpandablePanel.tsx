'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const lime = '#A3FF12';

interface ExpandablePanelProps {
  /** Judul header panel */
  title: string;
  /** Konten utama yang selalu tampil */
  children: React.ReactNode;
  /** Konten tambahan yang muncul saat expand (opsional) */
  expandContent?: React.ReactNode;
  /** Path gambar di atas konten (opsional) */
  imageSrc?: string;
  /** Alt gambar */
  imageAlt?: string;
  /** Default open state */
  defaultOpen?: boolean;
  className?: string;
}

export default function ExpandablePanel({
  title,
  children,
  expandContent,
  imageSrc,
  imageAlt = '',
  defaultOpen = false,
  className = '',
}: ExpandablePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-3xl p-5 border h-fit flex flex-col ${className}`}
      style={{
        borderColor: lime,
        boxShadow: '0 0 25px rgba(163,255,18,0.3)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header — hanya bisa di-toggle jika ada expandContent */}
      <div
        onClick={() => expandContent && setOpen(!open)}
        className={`flex items-center justify-between mb-4 ${expandContent ? 'cursor-pointer' : ''}`}
      >
        <h2 className="font-bold text-base tracking-widest uppercase" style={{ color: lime }}>
          {title}
        </h2>
        {expandContent && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ color: lime }}
              className="text-xl drop-shadow-[0_0_6px_#A3FF12]"
            />
          </motion.div>
        )}
      </div>

      {/* Image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={500}
          height={300}
          className="rounded-xl mb-4 w-full h-auto"
        />
      )}

      {/* Main content */}
      {children}

      {/* Expandable content */}
      {expandContent && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              {expandContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}