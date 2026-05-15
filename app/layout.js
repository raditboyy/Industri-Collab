import Navbar from '@/components/navbar';
// FIX HURUF KECIL SEMUA SESUAI FILE LU BOS!
import FloatingMenu from '@/components/floatingmenu'; 
import './globals.css';

export const metadata = {
  title: 'Kuli Desain | Makes Beautiful Day',
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

        {/* PASANG FLOATING MENU DI SINI BIAR MUNCUL DI SEMUA HALAMAN */}
        <FloatingMenu />

        <Navbar />
        
        <main className="pt-32 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}