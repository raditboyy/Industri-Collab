import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#1e293b] selection:bg-white selection:text-[#0500fa] font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* ✦ 1. HERO SECTION (UPFLUENCE EXACT GRADIENT) ✦ */}
      {/* ========================================================= */}
      <section 
        className="relative text-white pt-20 pb-32 px-6 lg:px-12 w-full flex items-center min-h-[90vh] overflow-hidden"
        style={{ 
          background: 'radial-gradient(circle at 75% 50%, #2948ff 0%, #0500fa 45%, #020040 100%)' 
        }}
      >
        
        {/* KANAN: FOTO PLANET DENGAN FADE HALUS (FIXED) */}
        <div className="absolute right-0 top-0 h-full w-full lg:w-[55%] pointer-events-none z-0">
           {/* Trik Masking CSS: Pinggiran kiri dibikin transparan pelan-pelan biar nggak ada garis kaku */}
           <div 
             className="absolute inset-0 w-full h-full bg-cover bg-left opacity-80 mix-blend-screen"
             style={{
               backgroundImage: "url('/planet.jpeg')",
               WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
               maskImage: "linear-gradient(to right, transparent 0%, black 30%, black 100%)"
             }}
           ></div>
        </div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 w-full relative z-10">
          
          {/* KIRI: TEKS RAKSASA */}
          <div className="w-full lg:w-[50%] flex flex-col items-start mt-10">
            <h1 className="text-[4rem] md:text-[5.5rem] lg:text-[6rem] font-bold leading-[1.05] tracking-tight mb-8">
              Layanan<br/>
              Cetak on<br/>
              Autopilot
            </h1>
            
            <p className="text-base md:text-lg text-blue-50/90 mb-10 leading-relaxed max-w-md font-medium pr-4">
              <strong className="text-white">PT. Cetaklagi</strong> hadir sebagai platform percetakan digital modern yang didedikasikan untuk mendukung skala produksi UMKM dan industri kreatif. 
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/product" className="bg-[#FF4A3D] hover:bg-[#FF3322] text-white font-bold py-3.5 px-8 rounded-lg shadow-lg transition-all">
                Mulai Belanja
              </Link>
              <Link href="#features" className="text-white font-bold hover:text-white/80 transition-colors">
                Selengkapnya
              </Link>
            </div>
          </div>

          {/* KANAN: KOSONG (Buat nahan layout doang) */}
          <div className="w-full lg:w-[50%] flex justify-center lg:justify-end">
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* ✦ 2. FEATURE SECTION (BAWAH) ✦ */}
      {/* ========================================================= */}
      <section id="features" className="py-24 px-6 lg:px-12 w-full max-w-[1400px] mx-auto bg-[#FAFAFB]">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#1e293b] leading-[1.1] tracking-tight">
            Cetaklagi System: Layanan Cetak<br/>
            Tanpa Kompromi
          </h2>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/60 shadow-sm p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="w-full lg:w-1/2 relative z-10">
            <h3 className="text-[2rem] md:text-[2.75rem] font-bold text-[#1e293b] mb-8 leading-[1.15]">
              Pesanan selesai dalam hitungan jam
            </h3>
            <p className="text-lg text-gray-500 leading-relaxed">
              Penerimaan otomatis, pembaruan status real-time, dan struk instan. Kami memastikan operasional cetak Anda berjalan efisien.
            </p>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center relative z-10">
             <div className="space-y-4 w-full max-w-[380px]">
                <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-50 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                   <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                   <span className="font-bold text-[#1e293b]">Terima Pesanan</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-50 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                   <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">2</div>
                   <span className="font-bold text-[#1e293b]">Proses Cetak</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-50 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                   <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
                   <span className="font-bold text-[#1e293b]">Selesai & Kirim</span>
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}