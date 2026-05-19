"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Keranjang() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. AMBIL DATA DARI LOCAL STORAGE
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    setIsLoading(false);
  }, []);

  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch ke storage & custom event biar navbar update badge
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Logika hitung subtotal (menggunakan .qty agar sinkron dengan detail produk)
  const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
  const adminFee = cartItems.length > 0 ? 2500 : 0;
  const total = subtotal + adminFee;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const currentQty = item.qty || 1;
        const newQuantity = currentQty + change;
        return { ...item, qty: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    saveCart(updatedCart);
  };

  // 2. 🔥 FUNGSI CHECKOUT
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Sesi login berakhir. Silakan login ulang, Bos!");
        router.push("/login");
        return;
      }

      // Simpan setiap item ke tabel 'orders'
      for (const item of cartItems) {
        const { error: insertError } = await supabase
          .from("orders")
          .insert([
            {
              user_id: user.id,
              product_name: item.name,
              total_price: item.price * (item.qty || 1),
              status: "Menunggu Pembayaran"
            }
          ]);

        if (insertError) throw new Error(`Gagal menyimpan ${item.name}: ${insertError.message}`);
      }

      // Simpan data untuk Struk
      localStorage.setItem('cetakpro_last_order', JSON.stringify({
        items: cartItems,
        subtotal: subtotal,
        adminFee: adminFee,
        total: total,
        date: new Date().toLocaleString('id-ID')
      }));

      saveCart([]); 
      router.push('/checkout'); 

    } catch (error) {
      console.error("Checkout Error:", error.message);
      alert("Gagal Simpan! Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black text-[#2E3C8B]">MEMUAT...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 pt-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* TOMBOL KEMBALI */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-3 text-gray-500 hover:text-[#2E3C8B] font-bold transition-colors group"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <span>Kembali</span>
        </motion.button>

        <h1 className="text-4xl font-black text-[#2E3C8B] mb-10 tracking-tight uppercase">Keranjang Belanja</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* KOLOM KIRI: DAFTAR BARANG */}
          <div className="w-full lg:w-2/3 space-y-6">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center"
                >
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-400 font-bold mb-6 text-xl">Keranjang lu masih kosong.</p>
                  <Link href="/product" className="inline-block bg-[#2E3C8B] text-white font-black py-4 px-10 rounded-2xl hover:scale-105 transition-transform active:scale-95">
                    Mulai Belanja
                  </Link>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-6 items-center group"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 p-2 shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-[#0A0F2C] leading-tight mb-1 uppercase truncate">{item.name}</h3>
                      <p className="text-[#2536F4] font-black text-xl mb-4">{formatRupiah(item.price)}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-200 p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-black">-</button>
                          <span className="px-4 font-black text-[#0A0F2C]">{item.qty || 1}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-black">+</button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-400 font-bold text-sm hover:text-red-600 transition-colors mr-2"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* KOLOM KANAN: RINGKASAN */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-[#0A0F2C] mb-8 border-b border-gray-50 pb-6 uppercase">Ringkasan</h2>
              
              <div className="space-y-4 mb-8 text-gray-500 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0A0F2C]">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin</span>
                  <span className="text-[#0A0F2C]">{formatRupiah(adminFee)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] mb-8 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-600">Total Tagihan</span>
                  <span className="text-2xl font-black text-[#D94841]">{formatRupiah(total)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={cartItems.length === 0 || isProcessing}
                className="w-full bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-black py-5 rounded-2xl shadow-lg shadow-[#2E3C8B]/20 transition-all disabled:opacity-50 active:scale-95 uppercase tracking-wider"
              >
                {isProcessing ? "MEMPROSES..." : "CHECKOUT SEKARANG"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}