import Link from "next/link";

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white selection:text-black">
      
      {/* Navbar Khusus Halaman Ini - Super Clean */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center backdrop-blur-sm">
        <div className="font-black text-2xl tracking-tighter">Cetak Lagi</div>
        <div className="flex gap-8 items-center">
          <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            ← Kembali ke Web Utama
          </Link>
          <Link href="mailto:biz@cetakpro.com" className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
            Hubungi Kami
          </Link>
        </div>
      </nav>

      {/* Hero Section - Kesan High-End */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-20 border-b border-white/10">
        <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter mb-10">
          CRAFTING <br /> PRECISION.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl">
            Divisi produksi PT Cetak Lagi Mandiri yang berfokus pada keunggulan material, ketajaman warna, dan kecepatan eksekusi skala industri.
          </p>
          <div className="flex gap-4">
            <div className="h-20 w-px bg-white/20 hidden md:block"></div>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Based in Sidoarjo, Indonesia <br /> Est. 2021
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Korporasi */}
      <section className="py-32 px-6 md:px-20">
        <h2 className="text-xs uppercase tracking-[0.5em] text-gray-600 mb-16">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
          <div className="bg-[#0A0A0A] p-12 hover:bg-white/5 transition-colors">
            <h3 className="text-2xl font-bold mb-4">Digital Printing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Solusi cetak cepat untuk volume menengah dengan akurasi warna CMYK premium.</p>
          </div>
          <div className="bg-[#0A0A0A] p-12 hover:bg-white/5 transition-colors">
            <h3 className="text-2xl font-bold mb-4">Large Format</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Produksi outdoor banner, signage, dan booth exhibition dengan material tahan cuaca.</p>
          </div>
          <div className="bg-[#0A0A0A] p-12 hover:bg-white/5 transition-colors">
            <h3 className="text-2xl font-bold mb-4">B2B Solutions</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Sistem kontrak pengadaan kebutuhan cetak rutin untuk perkantoran dan instansi.</p>
          </div>
        </div>
      </section>

      {/* Footer Khusus */}
      <footer className="py-20 px-6 md:px-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-sm text-gray-600">© 2026 Cetak Lagi Corporate Division.</div>
        <div className="flex gap-10">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Order Platform</Link>
          <Link href="/about" className="text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">About Us</Link>
        </div>
      </footer>
    </div>
  );
}