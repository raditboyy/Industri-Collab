import Link from "next/link";

export default function Features() {
  const mainFeatures = [
    {
      title: "Order Online 24/7",
      description: "Tidak perlu antre di toko. Upload desain, pilih bahan, dan bayar kapan saja dari mana saja.",
      // Dibuat full persegi dengan object-cover
      icon: <img src="/telp.png" alt="Order" className="w-full h-full object-cover" />,
      // p-0 ditambahin biar nggak ada jarak antara gambar dan pinggiran kotak
      color: "bg-blue-50 p-0" 
    },
    {
      title: "Kualitas Standar Industri",
      description: "Dicetak menggunakan mesin Konica Minolta & HP Indigo terbaru. Akurasi warna 99% sesuai monitor.",
      icon: <img src="/printing-pg.png" alt="Order" className="w-full h-full object-cover" />,
      color: "bg-red-50 text-[#D94841] p-0"
    },
    {
      title: "Eksekusi Kilat (Sameday)",
      description: "Deadline mepet? Pilih layanan Express. Pesan pagi, sore pesanan sudah bisa diambil atau dikirim.",
      icon: <img src="/petir-pg.png" alt="Order" className="w-full h-full object-cover" />,
      color: "bg-yellow-50 text-yellow-600 p-0"
    },
    {
      title: "Garansi Cetak Ulang",
      description: "Warna meleset atau potongan miring? Kami ganti 100% tanpa biaya tambahan. Kepuasan terjamin.",
      icon: <img src="/shield-pg.png" alt="Order" className="w-full h-full object-cover" />,
      color: "bg-green-50 text-green-600 p-0"
    },
    {
      title: "Live Tracking Pesanan",
      description: "Pantau status pesananmu secara real-time. Dari antrean cetak, finishing, hingga diserahkan ke kurir.",
      icon: <img src="/handphone-pg.png" alt="Order" className="w-full h-full object-cover" />,
      color: "bg-purple-50 text-purple-600 p-0"
    },
    {
      title: "Support Kuli Design",
      description: "Belum punya desain? Tim Kuli Design siap membantu dari konsep hingga file siap cetak.",
      icon: <img src="/support-pg.png" alt="Order" className="w-full h-full object-cover" />,
      color: "bg-orange-50 text-orange-600 p-0"
    }
  ];

  const steps = [
    { step: "01", title: "Pilih Produk", desc: "Cari kebutuhan cetakmu di katalog." },
    { step: "02", title: "Atur Spesifikasi", desc: "Pilih ukuran, jenis kertas, dan jumlah." },
    { step: "03", title: "Upload & Bayar", desc: "Kirim file desain dan selesaikan pembayaran." },
    { step: "04", title: "Duduk Manis", desc: "Pesanan dicetak dan langsung dikirim ke alamatmu." }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      
      {/* SEKSI 1: HERO */}
      <section className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <span className="text-[#D94841] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
          Kenapa Memilih Cetak Lagi?
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#2E3C8B] mb-6 leading-[1.15]">
          Fokus pada karyamu, <br className="hidden sm:block" /> biarkan kami yang mencetak.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
          Beragam fitur yang dirancang khusus untuk menghemat waktu dan mengamankan kualitas proyek kreatifmu.
        </p>
      </section>

      {/* SEKSI 2: BENTO GRID FEATURES */}
      <section className="px-4 max-w-5xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feat, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* overflow-hidden penting biar gambar nggak keluar dari rounded corner */}
              {/* HAPUS 'border' dari className di sini */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 overflow-hidden ${feat.color}`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-[#2E3C8B] mb-3 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI 3: CARA KERJA */}
      <section className="px-4 max-w-5xl mx-auto mb-32">
        <div className="bg-[#2E3C8B] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-xl shadow-blue-900/10">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D94841]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              Semudah Memesan Makanan Online
            </h2>
            <p className="text-blue-100/80">Alur pemesanan yang tidak akan membuatmu pusing.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div key={idx} className="relative group">
                {idx !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-white/20 border-t border-dashed border-white/30"></div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-black text-xl flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#D94841] group-hover:border-[#D94841] transition-colors shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-blue-100/70 text-sm leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKSI 4: CALL TO ACTION */}
      <section className="px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#2E3C8B] mb-4">
          Siap mengeksekusi ide kreatif Anda?
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Bergabung dengan ribuan pelanggan yang sudah membuktikan kecepatan dan kualitas CetakPro.
        </p>
        <Link 
          href="/product" 
          className="inline-flex items-center gap-2 bg-[#D94841] hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 hover:-translate-y-1"
        >
          Lihat Katalog Produk
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </section>

    </div>
  );
}