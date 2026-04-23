"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
        if (data) setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // DAFTAR KATEGORI TERBARU SESUAI PERMINTAAN
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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      
      {/* HEADER SECTION */}
      <section className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#2E3C8B] mb-4">
          Katalog Produk
        </h1>
        <p className="text-gray-500 font-medium italic">
          Kualitas cetak premium untuk setiap kebutuhan Anda.
        </p>
      </section>

      {/* NAVIGASI TAB UTAMA */}
      <div className="flex justify-center mb-10 sticky top-20 z-40 px-4">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-200 shadow-sm flex">
          <button 
            onClick={() => { setActiveTab("produk"); setSelectedCategory("Semua"); }}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "produk" 
              ? "bg-[#2E3C8B] text-white shadow-md" 
              : "text-gray-500 hover:text-[#2E3C8B]"
            }`}
          >
            Semua Produk
          </button>
          <button 
            onClick={() => setActiveTab("kategori")}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "kategori" 
              ? "bg-[#2E3C8B] text-white shadow-md" 
              : "text-gray-500 hover:text-[#2E3C8B]"
            }`}
          >
            Pilih Kategori
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* VIEW 1: SEMUA PRODUK */}
        {activeTab === "produk" && (
          <>
            {selectedCategory !== "Semua" && (
              <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-bold text-[#2E3C8B]">
                  Kategori: <span className="font-black underline">{selectedCategory}</span>
                </p>
                <button 
                  onClick={() => setSelectedCategory("Semua")}
                  className="text-[10px] font-black text-[#D94841] bg-white px-3 py-1 rounded-full border border-red-100 shadow-sm transition-all active:scale-95"
                >
                  RESET FILTER ✕
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-[#2E3C8B]/20 border-t-[#2E3C8B] rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-100 shadow-inner">
                <div className="text-6xl mb-4 opacity-20">📦</div>
                <h3 className="text-lg font-bold text-gray-400">Belum ada produk untuk kategori ini.</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link 
                    href={`/product/${product.id}`} 
                    key={product.id} 
                    className="bg-white rounded-[2rem] p-4 border border-gray-50 hover:border-[#2E3C8B]/10 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col"
                  >
                    <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-4 flex items-center justify-center text-6xl relative overflow-hidden group-hover:bg-blue-50/50 transition-colors">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        "📦"
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2E3C8B] text-[10px] font-black px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                        STOK: {product.stock}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-[#D94841] mb-1 tracking-widest">{product.category}</div>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-[#2E3C8B] transition-colors leading-relaxed">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="text-[#2E3C8B] font-black text-base">{formatRupiah(product.price)}</div>
                        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#D94841] group-hover:text-white group-hover:rotate-90 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: PILIHAN KATEGORI */}
        {activeTab === "kategori" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-300">
            {categories.map((cat, index) => (
              <button 
                key={index}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setActiveTab("produk");
                }}
                className="bg-white p-6 rounded-[2.5rem] border border-gray-50 hover:border-[#2E3C8B]/20 hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left group flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <div>
                    <span className="block text-md font-black text-gray-800 group-hover:text-[#2E3C8B] transition-colors">{cat.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Lihat Koleksi ➜</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}