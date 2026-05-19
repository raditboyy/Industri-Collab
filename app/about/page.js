import Link from "next/link";

export default function About() {
  const designServices = [
    { title: "Logo & Branding", icon: <img src="/icon-logo.png" alt="Logo & Branding" className="w-full h-full object-cover" /> },
    { title: "Layout Buku & Majalah", icon: <img src="/icon-buku.png" alt="Icon Buku" className="w-full h-full object-cover" /> },
    { title: "Ilustrasi Custom", icon: <img src="/icon-ilustrasi.png" alt="Icon Ilustrasi" className="w-full h-full object-cover" /> },
    { title: "Desain Promosi", icon: <img src="/icon-promosi.png" alt="Icon Promosi" className="w-full h-full object-cover" /> },
  ];

  const branches = [
    {
      id: "Cabang-Kreatif",
      name: "Cetak Lagi",
      path: "https://www.instagram.com/cetaklagi.pkl/", 
      address: "Jl. Otto Iskandardinata No. 99, Kalibaros, Pekalongan Timur, Pekalongan",
      phone: "CS Cetak: +62 812-1731-5188",
      // UPDATE: Ganti emoji gedung jadi logo Cetak Lagi
      icon: <img src="/logo-cetaklagi.png" alt="Cetak Lagi" className="w-14 h-16 object-contain" />
    },
    {
      id: "Pusat",
      name: "Kuli Design",
      path: "https://www.instagram.com/kulidesain.yk/", 
      address: "Jl. Parangtritis No.km 5, RW.7, Pandas, Panggungharjo, Kec.Sewon, Kabupaten bantul, daerah Istimewa Yogyakarta 55188",
      phone: "Konsultasi: +62 856-4001-5125",
      // UPDATE: Ganti emoji palet jadi logo Kuli Design
      icon: <img src="/logo-kulidesain.png" alt="Kuli Design" className="w-14 h-16 object-contain" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      
      {/* SEKSI 1: HERO TENTANG KAMI */}
      <section className="pt-24 pb-20 px-4 max-w-4xl mx-auto text-center">
        <span className="text-[#D94841] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
          Kenali Kami Lebih Dekat
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2E3C8B] mb-6 leading-[1.15]">
          Lebih dari sekadar <br className="hidden md:block" /> tempat percetakan.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
          Kami adalah partner kreatifmu. Mulai dari tugas kuliah yang harus kumpul besok pagi, sampai merchandise custom untuk event besarmu.
        </p>
      </section>

      {/* SEKSI 2: SEJARAH & STATISTIK */}
      <section className="px-4 max-w-5xl mx-auto mb-24">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-[#2E3C8B]">
              Mulai dari garasi kecil, kini melayani ribuan pesanan.
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              PT Cetak Lagi dibangun dengan satu prinsip sederhana: mencetak harusnya gampang, cepat, dan nggak bikin pusing. Kami menggabungkan mesin cetak berteknologi tinggi dengan sistem pemesanan online yang praktis.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-36 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
              <h3 className="text-3xl font-black text-[#2E3C8B] mb-1">2+</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Tahun<br/>Pengalaman</p>
            </div>
            <div className="flex-1 md:w-36 p-6 bg-red-50/50 rounded-2xl border border-red-100/50 text-center">
              <h3 className="text-3xl font-black text-[#D94841] mb-1">10k</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pelanggan<br/>Puas</p>
            </div>
          </div>

        </div>
      </section>

      {/* SEKSI 3: PARTNER */}
      <section className="px-4 max-w-5xl mx-auto mb-24">
        <div className="bg-[#2E3C8B] rounded-[2rem] p-10 md:p-14 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10">
            <span className="inline-block border border-white/20 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Sister Company
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-10">
              Ide mentahmu, dieksekusi <br className="hidden md:block"/> oleh <span className="text-[#D94841]">Cetak Lagi x Kuli Design.</span>
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {designServices.map((service, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm text-left hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-2xl mb-4 bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-[#2E3C8B] text-sm">{service.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI 4: LOKASI CABANG */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-[#2E3C8B] mb-3">Pusat Bantuan & Lokasi</h2>
          <p className="text-gray-500 text-sm">Pilih cabang terdekat atau konsultasikan kebutuhanmu langsung ke tim kami.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <Link 
              key={branch.id} 
              href={branch.path}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group bg-white p-8 rounded-[2rem] border border-gray-200 hover:border-[#2E3C8B] hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gray-50 text-[#2E3C8B] w-14 h-14 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 transition-colors overflow-hidden">
                  {branch.icon}
                </div>
                <h4 className="text-lg font-bold text-[#2E3C8B] group-hover:text-[#D94841] transition-colors">
                  {branch.name}
                </h4>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 text-sm">📍</span>
                  <span className="text-gray-600 font-medium text-sm leading-relaxed">{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">📞</span>
                  <span className="text-gray-600 font-medium text-sm">{branch.phone}</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-400 group-hover:text-[#2E3C8B] transition-colors">Kunjungi Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-300 group-hover:text-[#2E3C8B] transition-colors group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}