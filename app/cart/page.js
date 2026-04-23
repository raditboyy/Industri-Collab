"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    window.dispatchEvent(new Event('storage'));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const adminFee = cartItems.length > 0 ? 2500 : 0;
  const total = subtotal + adminFee;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity || 1;
        const newQuantity = currentQty + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    if (window.confirm("Yakin mau hapus produk ini?")) {
      const updatedCart = cartItems.filter(item => item.id !== id);
      saveCart(updatedCart);
    }
  };

  // 2. 🔥 FUNGSI CHECKOUT - KIRIM KE SUPABASE + STRUK
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    try {
      // A. Cek User yang lagi login
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Sesi login berakhir. Silakan login ulang, Bos!");
        router.push("/login");
        return;
      }

      console.log("Mengirim data untuk User ID:", user.id);

      // B. Simpan setiap item ke tabel 'orders'
      for (const item of cartItems) {
        const { error: insertError } = await supabase
          .from("orders")
          .insert([
            {
              user_id: user.id, // Pastikan kolom di DB tipe UUID
              product_name: item.name,
              total_price: item.price * (item.quantity || 1),
              status: "Menunggu Pembayaran"
            }
          ]);

        if (insertError) {
          console.error("Gagal insert ke Supabase:", insertError);
          throw new Error(`Gagal menyimpan ${item.name}: ${insertError.message}`);
        }
      }

      // C. Simpan data untuk Struk (Penyimpanan Lokal)
      localStorage.setItem('cetakpro_last_order', JSON.stringify({
        items: cartItems,
        subtotal: subtotal,
        adminFee: adminFee,
        total: total,
        date: new Date().toLocaleString('id-ID')
      }));

      // D. Kosongkan keranjang setelah berhasil
      saveCart([]); 

      // E. Berhasil! Lempar ke halaman struk (sesuaikan path folder lu)
      router.push('/checkout'); 

    } catch (error) {
      console.error("Checkout Error:", error.message);
      alert("Waduh Gagal Simpan! Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black text-[#2E3C8B]">MEMUAT...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 pt-32">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-black text-[#2E3C8B] mb-10 tracking-tight">Keranjang Belanja</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* KOLOM KIRI: DAFTAR BARANG (50%) */}
          <div className="w-full lg:w-1/2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                <p className="text-gray-400 font-bold mb-6">Keranjang lu masih kosong.</p>
                <Link href="/product" className="inline-block bg-[#2E3C8B] text-white font-black py-3 px-8 rounded-full">Belanja Sekarang</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-5 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.name}</h3>
                    <p className="text-[#2E3C8B] font-black">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                      Hapus
                    </button>
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 font-black">-</button>
                      <span className="px-2 text-xs font-black">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 font-black">+</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* KOLOM KANAN: RINGKASAN (50%) */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-gray-800 mb-8 border-b border-gray-50 pb-6">Ringkasan</h2>
              <div className="space-y-4 mb-8 text-gray-500 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin</span>
                  <span>{formatRupiah(adminFee)}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-[2rem] mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-600">Total Tagihan</span>
                  <span className="text-2xl font-black text-[#D94841]">{formatRupiah(total)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={cartItems.length === 0 || isProcessing}
                className="w-full bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-black py-5 rounded-[1.5rem] shadow-xl transition-all disabled:opacity-50 active:scale-95"
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