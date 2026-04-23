"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  // FUNGSI 1: TAMBAH KE KERANJANG (TIDAK DIUBAH)
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const isExist = cart.find((item) => item.id === product.id);
    
    if (isExist) {
      alert("Produk ini sudah ada di keranjang Anda!");
    } else {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Berhasil masuk keranjang! Cek menu keranjang untuk checkout.");
    }
  };

  // 🔥 FUNGSI 2: BELI SEKARANG (DIPERBAIKI: MASUK SUPABASE + STRUK)
  const directCheckout = async () => {
    // 1. Cek User pakai getUser (lebih akurat dari getSession)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      alert("Login dulu ya Bos supaya pesanan bisa diproses!");
      router.push("/login");
      return;
    }

    try {
      // 2. Langsung tembak ke tabel 'orders' di Supabase
      const { error: insertError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            product_name: product.name,
            total_price: product.price,
            status: "Menunggu Pembayaran"
          }
        ]);

      if (insertError) throw insertError;

      // 3. Simpan data untuk Struk (sesuai format yang dibaca halaman /checkout)
      const adminFee = 2500;
      localStorage.setItem("cetakpro_last_order", JSON.stringify({
        items: [{ ...product, quantity: 1 }],
        subtotal: product.price,
        adminFee: adminFee,
        total: product.price + adminFee,
        date: new Date().toLocaleString('id-ID')
      }));
      
      // 4. Lempar ke halaman checkout buat lihat struk & konfirmasi
      router.push("/checkout");

    } catch (error) {
      console.error("Error Beli Langsung:", error);
      alert("Waduh, pesanan gagal diproses: " + error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-[#2E3C8B] animate-pulse">
      MEMUAT DETAIL PRODUK...
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-black text-gray-400">
      PRODUK TIDAK DITEMUKAN
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Gambar Produk */}
        <div className="w-full md:w-1/2 aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-inner">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
          />
        </div>

        {/* Info & Action */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-50 text-[#D94841] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">
              {product.category}
            </span>
            <span className="text-gray-300 text-xs font-bold">Stok: {product.stock}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="text-4xl font-black text-[#2E3C8B] mb-10">
            Rp {product.price?.toLocaleString()}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={addToCart} 
              className="flex-1 bg-gray-50 text-gray-500 hover:bg-gray-100 font-bold py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">🛒</span> + Keranjang
            </button>
            <button 
              onClick={directCheckout} 
              className="flex-1 bg-[#2E3C8B] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-900/10 hover:bg-[#1E2B6B] hover:-translate-y-1 transition-all active:scale-95"
            >
              BELI SEKARANG
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400 font-medium leading-relaxed">
            * Klik <b>Beli Sekarang</b> untuk langsung melihat struk pembayaran dan konfirmasi via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}