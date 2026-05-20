'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { PortfolioData } from '@/schema/portfolio';

const lime = '#A3FF12';

interface PortfolioDetailModalProps {
  item: PortfolioData;
  onClose: () => void;
}

export default function PortfolioDetailModal({ item, onClose }: PortfolioDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border overflow-hidden"
        style={{
          borderColor: lime,
          boxShadow: '0 0 30px rgba(163,255,18,0.3)',
          backgroundColor: 'rgba(0,0,0,0.95)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-[#A3FF12]/70 hover:text-[#A3FF12] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <Image
          src="/img/vidya.png"
          alt={item.title}
          width={500}
          height={280}
          className="w-full object-cover"
          style={{ maxHeight: 200 }}
        />

        {/* Content */}
        <div className="p-5">
          {/* Title — klik redirect ke link */}
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-black text-base uppercase tracking-wide mb-1 hover:underline transition-all"
              style={{ color: lime }}
            >
              {item.title}
            </a>
          ) : (
            <p className="font-black text-base uppercase tracking-wide mb-1" style={{ color: lime }}>
              {item.title}
            </p>
          )}

          {/* Link display */}
          {item.link && (
            <p className="text-white/40 text-[11px] mb-3 truncate">
              {item.link.replace(/^https?:\/\//, '')}
            </p>
          )}

          {/* Description */}
          <p className="text-white/70 text-xs leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}