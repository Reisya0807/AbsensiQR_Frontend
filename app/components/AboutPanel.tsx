'use client';

import ExpandablePanel from './ExpandablePanel';

export default function AboutPanel() {
  return (
    <ExpandablePanel
      title="ABOUT"
      imageSrc="/img/vidya.png"
      imageAlt="Vidya Sambandha"
      expandContent={
        <>
          <p className="text-xs text-white/70 mt-3 leading-relaxed normal-case tracking-normal">
            Di era yang serba cepat, inovasi lahir dari kolaborasi. Vidya Sambandha (Sanskerta:
            Keterhubungan Ilmu) hadir untuk menjembatani ide dan kreativitas antar mahasiswa.
          </p>
          <p className="text-xs text-white/70 mt-3 leading-relaxed normal-case tracking-normal">
            Melalui tema{' '}
            <strong>&quot;Menjalin Silaturahmi, Menyatukan Logika, Membangun Karya&quot;</strong>,
            kami memanfaatkan potensi dan sumber daya di lingkungan Unpas untuk tumbuh dan
            berkembang bersama.
          </p>
        </>
      }
    >
      <p className="text-xs text-white/70 leading-relaxed normal-case tracking-normal">
        Vidya Sambandha hadir sebagai wadah kolaborasi mahasiswa angkatan 2025. Mengusung filosofi
        &apos;keterhubungan ilmu pengetahuan&apos;, acara ini menjadi ruang menyatukan ide, logika,
        dan kreativitas untuk membangun karya bersama.
      </p>
    </ExpandablePanel>
  );
}