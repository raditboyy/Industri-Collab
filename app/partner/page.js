import Link from "next/link";

export default function Partner() {
  const designServices = [
    {
      title: "Logo & Branding",
      desc: "Dari sketsa kasar hingga identitas visual yang profesional untuk bisnismu.",
      icon: "✒️"
    },
    {
      title: "Layout & Editorial",
      desc: "Tata letak buku, majalah, atau company profile yang rapi dan nyaman dibaca.",
      icon: "📖"
    },
    {
      title: "Ilustrasi Custom",
      desc: "Artwork unik untuk kebutuhan merchandise, kaos, atau kemasan produkmu.",
      icon: "🎨"
    },
    {
      title: "Desain Promosi",
      desc: "Brosur, poster, dan banner digital/cetak yang dirancang untuk menarik perhatian.",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* 1. Hero Section - Kolaborasi */}
      <section className="py-24 px-4 max-w-5xl mx-auto text-center border-b border-gray-100">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-bold text-black uppercase tracking-widest">
            CetakPro
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <span className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold uppercase tracking-widest">
            Kuli Design
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6 leading-tight">
          Punya ide, <br /> tapi nggak bisa desain?
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Perkenalkan <strong className="text-black">Kuli Design</strong>. Cabang resmi dari PT Cetak Lagi yang fokus mengubah ide mentahmu menjadi visual siap cetak berstandar tinggi.
        </p>
      </section>

      {/* 2. Story / About Kuli Design Split Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Bagian Visual/Placeholder */}
          <div className="bg-[#FAFAFA] rounded-[2rem] aspect-square flex flex-col items-center justify-center border border-gray-200 p-8 relative overflow-hidden group">
            {/* Dekorasi tipis */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-8xl mb-6">📐</div>
              <h3 className="text-2xl font-bold text-black mb-2">Creative Studio</h3>
              <p className="text-gray-500">Sidoarjo, Jawa Timur</p>
            </div>
          </div>

          {/* Bagian Teks */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black mb-6">
              Satu pintu, dari konsep hingga produk fisik.
            </h2>
            <div className="space-y-6 text-gray-500 leading-relaxed">
              <p>
                Seringkali proses produksi terhambat karena resolusi gambar pecah, format file salah, atau warna yang tidak sesuai standar CMYK. Di sinilah Kuli Design mengambil peran.
              </p>
              <p>
                Sebagai *sister company* dari PT Cetak Lagi, desainer kami tahu persis spesifikasi teknis yang dibutuhkan oleh mesin cetak kami. Artinya: <strong className="text-black">Nol miskomunikasi.</strong>
              </p>
              <p>
                Kamu cukup ceritakan visimu, tim Kuli Design yang akan merancang, mengatur tata letak, dan langsung mengirimkannya ke divisi cetak kami. Terima beres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Layanan Kuli Design Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-gray-100 mt-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-black">Layanan Kreatif</h2>
          <p className="text-gray-500 mt-2">Apa yang bisa Kuli Design buat untukmu?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {designServices.map((service, index) => (
            <div key={index} className="p-8 md:p-10 rounded-3xl border border-gray-200 hover:border-black transition-all duration-300 group bg-white">
              <div className="flex gap-6 items-start">
                <div className="text-4xl bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 group-hover:-translate-y-2 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA Konsultasi Desain */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-[2.5rem] p-12 md:p-20">
          <h2 className="text-3xl font-bold tracking-tighter text-black mb-4">
            Mari diskusikan visualmu.
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Tim Kuli Design siap membantu menterjemahkan idemu menjadi desain yang profesional dan siap cetak.
          </p>
          <a 
            href="https://wa.me/628xxxxxxxxxx" // Ganti dengan nomor khusus Kuli Design atau CS PT Cetak Lagi
            target="_blank"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors"
          >
            Konsultasi via WhatsApp
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}