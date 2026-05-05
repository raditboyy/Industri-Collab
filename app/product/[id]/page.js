"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data produk berdasarkan ID dari URL
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Error ambil produk:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params?.id]);

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  // FUNGSI SAKTI: Tambah ke Keranjang + Pencet Alarm
  const handleAddToCart = () => {
    if (!product) return;
    
    // 1. Ambil memori
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // 2. Cek barang
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].qty += 1; 
    } else {
      cart.push({ ...product, qty: 1 }); 
    }

    // 3. Simpan
    localStorage.setItem("cart", JSON.stringify(cart));

    // 4. PUKUL ALARM KE NAVBAR
    window.dispatchEvent(new Event("cartUpdated"));

    // 5. Kasih Notif Pop-up Browser
    alert(`${product.name} berhasil masuk keranjang!`);
  };

  // Fungsi Langsung Beli
  const handleBuyNow = () => {
    handleAddToCart(); // Masukin keranjang dulu otomatis
    router.push('/cart'); // Terus lempar ke halaman keranjang
  };

  // Tampilan Loading
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-bold text-gray-500">Memuat produk...</div>;
  }

  // Tampilan Kalau Produk Gak Ada
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-bold text-red-500">Produk tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* KARTU PUTIH GEDE */}
        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          
          {/* KIRI: Gambar Produk */}
          <div className="w-full md:w-1/2">
            {/* Warna background pink ngikutin screenshot, tapi bisa lu ganti/dinamis sesuai kategori */}
            <div className="aspect-square bg-[#D85B88] rounded-[2.5rem] flex items-center justify-center p-8 overflow-hidden relative shadow-inner">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-8xl">📦</span>
              )}
            </div>
          </div>

          {/* KANAN: Detail Produk */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            
            {/* Kategori & Stok */}
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-50 text-[#D94841] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">
                {product.category || "UMUM"}
              </span>
              <span className="text-gray-400 font-bold text-sm">Stok: {product.stock}</span>
            </div>

            {/* Judul Produk */}
            <h1 className="text-3xl md:text-5xl font-black text-[#0A0F2C] mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Harga */}
            <p className="text-4xl font-black text-[#2536F4] mb-10 drop-shadow-sm">
              {formatRupiah(product.price)}
            </p>

            {/* Tombol Action */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              
              {/* Tombol + Keranjang (Putih) */}
              <button 
                onClick={handleAddToCart} 
                className="flex-1 py-4 rounded-2xl bg-gray-50 text-[#596475] font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors border border-gray-200 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                + Keranjang
              </button>

              {/* Tombol Beli Sekarang (Biru Gelap) */}
              <button 
                onClick={handleBuyNow} 
                className="flex-1 py-4 rounded-2xl bg-[#2E3C8B] text-white font-black hover:bg-[#1C28B5] transition-all shadow-lg shadow-[#2E3C8B]/30 active:scale-95"
              >
                BELI SEKARANG
              </button>

            </div>

            {/* Teks Disclaimer */}
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              * Klik <strong className="text-gray-500 font-bold">Beli Sekarang</strong> untuk langsung melihat struk pembayaran dan konfirmasi via WhatsApp.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}