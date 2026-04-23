import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#1e293b] selection:bg-[#2536F4] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* ✦ 1. HERO SECTION (MURNI TEKS & POSTER RAKSASA) ✦ */}
      {/* ========================================================= */}
      <section className="relative bg-[#2536F4] text-white pt-20 pb-32 px-6 lg:px-12 w-full flex items-center min-h-[90vh]">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 w-full">
          
          {/* KIRI: TEKS RAKSASA */}
          <div className="w-full lg:w-[45%] flex flex-col items-start z-10 mt-10">
            <h1 className="text-[4rem] md:text-[5.5rem] lg:text-[6rem] font-bold leading-[1.05] tracking-tight mb-8">
              Layanan<br/>
              Cetak on<br/>
              Autopilot
            </h1>
            
            <p className="text-base md:text-lg text-blue-100/90 mb-10 leading-relaxed max-w-md font-medium pr-4">
              <strong className="text-white">PT. Cetaklagi</strong> hadir sebagai platform percetakan digital modern yang didedikasikan untuk mendukung skala produksi UMKM dan industri kreatif. 
              <br/><br/>
              Dilengkapi dengan fitur katalog digital, manajemen pesanan real-time, struk otomatis, hingga integrasi WhatsApp langsung.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/product" className="bg-[#FF5A45] hover:bg-[#FF452D] text-white font-bold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all">
                Mulai Belanja
              </Link>
              <Link href="#features" className="text-white font-bold hover:text-blue-200 transition-colors">
                Saya Desainer
              </Link>
            </div>
          </div>

          {/* KANAN: POSTER RAKSASA (FULL WIDTH) */}
          <div className="w-full lg:w-[55%] relative z-10 flex justify-end">
             {/* Kotak ini kita bikin w-full biar memakan seluruh sisa layar kanan. 
                 Nggak ada lagi batas max-width atau padding yang bikin dia nyusut. 
             */}
             <div className="w-full xl:w-[90%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/20 group relative">
                <img 
                  src="/download.jpg" 
                  alt="Poster Promo Cetaklagi" 
                  /* w-full h-auto bikin gambar narik selebar mungkin secara proporsional */
                  className="w-full h-auto object-cover bg-black/20 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
             </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* ✦ 2. THE NEW FEATURE SECTION (SCROLL KE BAWAH) ✦ */}
      {/* ========================================================= */}
      <section id="features" className="py-24 px-6 lg:px-12 w-full max-w-[1400px] mx-auto bg-[#FAFAFB]">
        
        <div className="text-center md:text-left mb-16">
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#1e293b] leading-[1.1] tracking-tight">
            Cetaklagi System: Layanan Cetak<br/>
            Tanpa Kompromi
          </h2>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/40 via-purple-50/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full lg:w-1/2 relative z-10">
            <h3 className="text-[2rem] md:text-[2.75rem] font-bold text-[#1e293b] mb-8 leading-[1.15] tracking-tight">
              Pesanan selesai dalam hitungan jam, bukan minggu
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Dari pengiriman file desain hingga masuk ke mesin cetak dalam hitungan menit. Dengan <strong className="text-[#1e293b]">penerimaan otomatis, pembaruan status real-time, dan struk instan</strong>, pesanan cetak Anda siap sebelum kompetitor membalas pesan.
            </p>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center relative z-10 pt-4">
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-full max-w-[380px] relative z-10 transform hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400 font-semibold">Notifikasi Pesanan</span>
                <div className="bg-[#2536F4] text-white p-1.5 rounded-lg shadow-md">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-red-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500"></div>
                </div>
                <span className="text-sm font-bold text-[#1e293b]">@umkm_lokal & 28 lainnya</span>
              </div>
            </div>

            <div className="h-10 w-px bg-gradient-to-b from-gray-200 to-gray-300 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 border border-gray-100 shadow-sm text-[10px] text-yellow-500">⚡</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-full max-w-[380px] relative z-10 transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">🖨️</div>
                <span className="text-sm font-bold text-[#1e293b]">Desain masuk mesin cetak</span>
              </div>
            </div>

            <div className="h-10 w-px bg-gradient-to-b from-gray-200 to-gray-300 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 border border-gray-100 shadow-sm text-[10px] text-yellow-500">⚡</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-full max-w-[380px] relative z-10 transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✅</div>
                <span className="text-sm font-bold text-[#1e293b]">29 pesanan siap diambil</span>
              </div>
            </div>

            <div className="h-6 w-px bg-green-200 relative"></div>

            <div className="w-full max-w-[380px] h-32 bg-gray-200 rounded-t-2xl relative overflow-hidden border-x border-t border-gray-200 shadow-inner">
               <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop" alt="Hasil Cetak" className="w-full h-full object-cover opacity-80" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}