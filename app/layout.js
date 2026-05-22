import Navbar from '@/components/navbar';
import FloatingNav from "@/components/floatingnav"; // Ini yang buat tombol "Selanjutnya"
import FloatingMenu from '@/components/floatingmenu'; 
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://cetaklagi.id'),
  title: 'Cetak Lagi | Make a good moment!',
  description: 'Platform cetak dan desain terbaik',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased relative">
        
        {/* GAMBAR AWAN FULL NYENTRONG */}
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/bg-awan.jpg')` }}
        ></div>
        
        {/* LAPISAN KACA FILM BIRU GELAP */}
        <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-[#2E3C8B]/60 to-[#0A1128]/80"></div>

        {/* Menu melayang lu yang lama */}
        <FloatingMenu />

        <Navbar />
        
        <main className="pt-32 pb-10">
          {children}
        </main>

        {/* --- INI YANG GUE TAMBAHIN --- */}
        {/* Tombol "Halaman Selanjutnya" bakal muncul di pojok kanan bawah di semua page */}
        <FloatingNav /> 

      </body>
    </html>
  );
}