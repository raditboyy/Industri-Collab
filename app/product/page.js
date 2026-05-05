"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// --- KOMPONEN KARTU PRODUK & POP UP ---
function ProductCard({ product, formatRupiah }) {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const handleOpenModal = (e) => {
    e.preventDefault();
    setQty(1);
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleAddQty = () => { if (qty < product.stock) setQty(qty + 1); };
  const handleMinQty = () => { if (qty > 1) setQty(qty - 1); };

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Alarm buat navbar
    setShowModal(false);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart'); // Ganti '/cart' kalau rute keranjang lu beda
  };

  return (
    <>
      <div className="bg-white rounded-[2rem] p-4 border border-gray-50 hover:border-[#2E3C8B]/10 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
        <Link href={`/product/${product.id}`} className="block flex-grow">
          <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-4 flex items-center justify-center relative overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <span className="text-4xl">📦</span>
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2E3C8B] text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
              STOK: {product.stock}
            </div>
          </div>

          <div className="text-[10px] font-black uppercase text-[#D94841] mb-1 tracking-widest">{product.category}</div>
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="text-[#2E3C8B] font-black text-base">{formatRupiah(product.price || 0)}</div>
          
          <button 
            onClick={handleOpenModal} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2E3C8B] text-white hover:bg-blue-800 transition-colors shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* POP UP (MODAL) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-lg">
              ✕
            </button>

            <div className="flex gap-4 mb-6 items-center mt-2">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} /> : <span>📦</span>}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{product.name}</h4>
                <p className="text-[#2E3C8B] font-black mt-1">{formatRupiah(product.price * qty)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl mb-6 border border-gray-100">
              <span className="text-xs font-bold text-gray-500 ml-2">Jumlah:</span>
              <div className="flex items-center gap-3">
                <button onClick={handleMinQty} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 font-bold hover:bg-gray-100">-</button>
                <span className="font-black text-gray-800 w-4 text-center">{qty}</span>
                <button onClick={handleAddQty} className="w-8 h-8 rounded-lg bg-[#2E3C8B] shadow-sm text-white font-bold hover:bg-blue-800">+</button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart} className="w-full py-3 rounded-xl bg-blue-50 text-[#2E3C8B] font-black border border-blue-100 hover:bg-blue-100 transition">
                + Keranjang
              </button>
              <button onClick={handleBuyNow} className="w-full py-3 rounded-xl bg-[#2E3C8B] text-white font-black hover:bg-blue-800 transition shadow-md">
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- HALAMAN PRODUK UTAMA ---
export default function Product() {
  const [activeTab, setActiveTab] = useState("produk");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Buku Tulis & Kertas", icon: "📓" },
    { name: "Perlengkapan Sekolah & Kantor", icon: "📎" },
    { name: "Majalah & Koran", icon: "📰" },
    { name: "Peralatan Makan", icon: "🍽️" },
    { name: "Souvenir & Hadiah", icon: "🎁" },
    { name: "Perlengkapan Pesta", icon: "🎉" },
    { name: "Surat-Menyurat", icon: "✉️" },
    { name: "Panahan", icon: "🏹" },
  ];

  const filteredProducts = selectedCategory === "Semua" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-y-auto">
      <section className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-black text-[#2E3C8B] mb-4">Katalog Produk</h1>
        <p className="text-gray-500 italic">Kualitas cetak premium untuk UMKM.</p>
      </section>

      <div className="flex justify-center mb-10 sticky top-20 z-40 px-4">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-gray-200 shadow-sm flex gap-2">
          <button onClick={() => { setActiveTab("produk"); setSelectedCategory("Semua"); }} 
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === "produk" ? "bg-[#2E3C8B] text-white" : "text-gray-500"}`}>
            Produk
          </button>
          <button onClick={() => setActiveTab("kategori")} 
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === "kategori" ? "bg-[#2E3C8B] text-white" : "text-gray-500"}`}>
            Kategori
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {activeTab === "produk" ? (
          <>
            {selectedCategory !== "Semua" && (
              <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-sm font-bold text-[#2E3C8B]">Kategori: <span className="font-black underline">{selectedCategory}</span></p>
                <button onClick={() => setSelectedCategory("Semua")} className="text-[10px] font-black text-[#D94841] bg-white px-3 py-1 rounded-full border border-red-100 shadow-sm transition-all active:scale-95">RESET ✕</button>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading ? (
                <p className="col-span-full text-center py-10">Memuat data...</p>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                   <p className="text-gray-400 font-bold">Produk belum tersedia di kategori ini.</p>
                </div>
              ) : filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} formatRupiah={formatRupiah} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <button key={i} onClick={() => { setSelectedCategory(cat.name); setActiveTab("produk"); }}
                className="bg-white p-6 rounded-[2rem] border border-gray-50 hover:shadow-lg hover:border-[#2E3C8B]/20 transition-all flex items-center gap-4 text-left">
                <span className="text-3xl bg-gray-50 p-4 rounded-2xl">{cat.icon}</span>
                <span className="font-black text-gray-800">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}