"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* KONTEN AESTHETIC DI TENGAH */}
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000 mt-10">
        
        {/* Label Badge Aesthetic */}
        <div className="inline-block mb-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white/90 text-xs font-black tracking-[0.2em] uppercase shadow-lg hover:bg-white/20 transition-colors cursor-default">
          Cetak Lagi - Make A Good Moments
        </div>

        {/* TULISAN PUTIH SEMUA */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
          Ciptakan Karya <br /> 
          Tanpa Batas.
        </h1>
        
        {/* Deskripsi */}
        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Setiap ide itu berharga. Kami hadir untuk menyulap imajinasi liarmu menjadi realitas visual dan hasil cetak premium yang memukau mata.
        </p>
        
        {/* Tombol */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
          {/* WARNA TEKS DISESUAIKAN (BIRU GELAP) */}
          <Link 
            href="/product" 
            className="bg-white text-[#1C325B] px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]"
          >
            Eksplorasi Produk
          </Link>
          <Link 
            href="/about" 
            className="bg-white/10 border border-white/40 text-white backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 hover:border-white transition-all duration-300 shadow-lg"
          >
            Kenali Kami
          </Link>
        </div>

      </div>
    </main>
  );
}