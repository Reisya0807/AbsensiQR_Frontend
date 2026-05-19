interface Panitia {
  id: number;
  name: string;
  foto: string;
  jobdesk: string;
  role: string;
}
const panitiaData: Record<string, Panitia> = {
  "253040072": {
		id: 1,
    name: "Moch Fadhil Fadilah",
    foto: "/img/panitia/253040072.png",
    jobdesk:
      "Penanggung jawab utama dalam memegang kendali seluruh rangkaian kegiatan.",
    role: "Ketua Pelaksana",
  },
  "253040079": {
		id: 2,
    name: "Ginanjar Al Farizi",
    foto: "/img/panitia/253040079.png",
    jobdesk: "Pendamping Ketua Pelaksana dalam menjalankan seluruh tanggung jawab kepanitiaan dalam kelengkapan dan strategis.",
    role: "WKP KELSTRA",
  },
  "253040085": {
		id: 3,
    name: "Adinda Putri Kirana",
    foto: "/img/panitia/253040085.png",
    jobdesk: "Pendamping Ketua Pelaksana dalam menjalankan seluruh tanggung jawab kepanitiaan dalam kegiatan, publikasi, dan dokumentasi.",
    role: "WKP KEPKOM",
  },
  "253040089": {
		id: 4,
    name: "Naila Radhika Oktaviatri",
    foto: "/img/panitia/253040089.png",
    jobdesk: "Mengelola administrasi, surat-menyurat, dan pendataan peserta kepanitiaan.",
    role: "Sekretaris 1",
  },
  "253040056": {
		id: 5,
    name: "Raffi Fatahillah Sudrajat",
    foto: "/img/panitia/253040056.png",
    jobdesk: "Membuat notulensi rapat, mengurus surat internal, dan pengarsipan administrasi kepanitiaan.",
    role: "Sekretaris 2",
  },
  "253040047": {
		id: 6,
    name: "Farrel Nizri Fahrezi",
    foto: "/img/panitia/253040047.png",
    jobdesk: "Mengumpulkan bukti transaksi, membantu distribusi dana, dan pencatatan keuangan kepanitiaan.",
    role: "Bendahara 2",
  },
  "253040058": {
		id: 7,
    name: "Yusnia Nurhasanah",
    foto: "/img/panitia/253040058.png",
    jobdesk: "Menyusun RAB, mengelola dana, dan membuat laporan keuangan kepanitiaan.",
    role: "Bendahara 1",
  },
  "253040080": {
		id: 8,
    name: "Nayla Amelia Putri",
    foto: "/img/panitia/253040080.png",
    jobdesk: "Mengelola publikasi, desain grafis, dan dokumentasi kegiatan.",
    role: "Bidang KPK",
  },
  "253040052": {
		id: 9,
    name: "Muhamad Rifaldi",
    foto: "/img/panitia/253040052.png",
    jobdesk: "Publikasi, Desain, dan Dokumentasi.",
    role: "Bidang PDD",
  },
  "253040043": {
		id: 10,
    name: "Febra Kahfi Saputra",
    foto: "/img/panitia/253040043.png",
    jobdesk: "Mengelola kebutuhan barang, konsumsi, vendor, dan penataan ruangan acara.",
    role: "Bidang Logistik",
  },
  "253040005": {
		id: 11,
    name: "Muhammad Rifqi Rajif",
    foto: "/img/panitia/253040005.png",
    jobdesk: "Mengelola keamanan, kebersihan, dan kesehatan.",
    role: "Bidang K3",
  },
};

export { panitiaData };
export type { Panitia };
