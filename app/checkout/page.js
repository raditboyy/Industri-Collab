"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutStruk() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const strukRef = useRef(null);

  // Ganti dengan nomor WA Admin lu
  const NOMOR_WA_ADMIN = "6281234567890"; 

  useEffect(() => {
    const data = localStorage.getItem("cetakpro_last_order");
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, [router]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(angka).replace("Rp", "Rp "); 
  };

  // 🔥 FUNGSI DOWNLOAD PAKAI HTML-TO-IMAGE (ANTI ERROR LAB)
  const downloadStruk = async () => {
    setIsDownloading(true);

    try {
      const htmlToImage = await import("html-to-image");
      const element = strukRef.current;

      const dataUrl = await htmlToImage.toPng(element, { 
        backgroundColor: "#ffffff",
        pixelRatio: 3 // Kualitas HD
      }); 

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Struk_CetakPro_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowPopup(true);
    } catch (error) {
      console.error("Detail Error:", error);
      alert("Gagal mengunduh struk! Pastikan npm install html-to-image sudah dijalankan.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!orderData) return <div className="min-h-screen flex items-center justify-center font-bold text-[#2E3C8B] animate-pulse">Memuat Struk...</div>;

  const pesanWA = `Halo Admin CetakPro, saya ingin konfirmasi pesanan.%0A%0A*Total Tagihan:* ${formatRupiah(orderData.total)}%0A*Tanggal:* ${orderData.date}%0A%0ASaya sudah mendownload struk, mohon instruksi pembayarannya. Terima kasih!`;

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-16 px-4 flex flex-col items-center">
      
      {/* ================================================== */}
      {/* AREA STRUK PEMBELIAN */}
      {/* ================================================== */}
      <div 
        ref={strukRef} 
        className="bg-white w-full max-w-sm rounded-xl shadow-sm p-8 relative font-sans"
      >
        <div className="text-center pb-5 mb-5 border-b-2 border-dashed border-gray-200">
          <h1 className="text-3xl font-black tracking-tight mb-1">
            <span className="text-[#2E3C8B]">Cetak</span><span className="text-[#D94841]">Pro</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Make a good moment!</p>
          <p className="text-xs text-gray-400 mt-3 font-medium">Tanggal: {orderData.date}</p>
        </div>

        <div className="space-y-4 pb-5 mb-5 border-b-2 border-dashed border-gray-200">
          {orderData.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-bold text-[#1e293b] text-sm leading-snug uppercase">
                  {item.name}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {item.quantity || 1} x {formatRupiah(item.price)}
                </p>
              </div>
              <div className="font-bold text-[#1e293b] text-sm">
                {formatRupiah(item.price * (item.quantity || 1))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pb-5 mb-5 border-b border-gray-100">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Subtotal</span>
            <span>{formatRupiah(orderData.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Biaya Layanan</span>
            <span>{formatRupiah(orderData.adminFee)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pb-5 mb-5 border-b-2 border-dashed border-gray-200">
          <span className="font-black text-[#1e293b] text-lg">TOTAL</span>
          <span className="font-black text-[#D94841] text-xl">{formatRupiah(orderData.total)}</span>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-[#475569] uppercase tracking-wide">
            Terima kasih atas pesanan anda
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Harap simpan struk ini sebagai bukti.
          </p>
        </div>
      </div>
      {/* ================================================== */}

      <button 
        onClick={downloadStruk}
        disabled={isDownloading}
        className="mt-8 bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 max-w-sm w-full justify-center disabled:opacity-70 active:scale-95"
      >
        {isDownloading ? "Memproses Gambar..." : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Struk Pesanan
          </>
        )}
      </button>

      <Link href="/" className="mt-4 text-sm font-bold text-gray-500 hover:text-[#1e293b] transition-colors">
        Kembali ke Beranda
      </Link>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✅
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Struk Tersimpan!</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Struk berhasil disimpan ke perangkat Anda. Silakan konfirmasi pembayaran ke Admin.
            </p>
            
            <a 
              href={`https://wa.me/${NOMOR_WA_ADMIN}?text=${pesanWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
              onClick={() => setShowPopup(false)}
            >
              Konfirmasi ke WhatsApp
            </a>
            
            <button 
              onClick={() => setShowPopup(false)}
              className="mt-4 w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}