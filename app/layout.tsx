import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidya Sambandha",
  description: "Vidya Sambandha berasal dari bahasa Sanskerta, di mana Vidya berarti ilmu pengetahuan dan Sambandha berarti hubungan atau keterkaitan. Sehingga, secara keseluruhan, Vidya Sambandha dapat diartikan sebagai keterhubungan dalam ilmu pengetahuan.",
  icons: {
    icon: "img/logo.png",
    shortcut: "img/logo.png",
    apple: "img/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
