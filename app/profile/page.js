"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    
    // 1. Cek User Aktif
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      router.push("/login");
      return;
    }
    setUser(user);

    // 2. Tarik Riwayat Pesanan Khusus User Ini Saja
    const { data: orderData, error: dbError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id) // Kunci diaktifkan kembali
      .order("created_at", { ascending: false });

    if (!dbError && orderData) {
      setOrders(orderData);
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; 
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black text-[#2E3C8B] tracking-widest animate-pulse">MEMUAT PROFIL...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* ==================================== */}
        {/* KIRI: INFO USER */}
        {/* ==================================== */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center sticky top-32">
            <div className="w-24 h-24 mx-auto bg-[#2E3C8B] text-white rounded-[1.5rem] flex items-center justify-center text-4xl font-black mb-5 shadow-inner">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-gray-800 truncate px-2">{user?.email}</h2>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Pelanggan CetakPro</p>
            
            <div className="mt-10">
              <button 
                onClick={handleLogout} 
                className="w-full bg-[#D94841] text-white font-black py-4 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>

        {/* ==================================== */}
        {/* KANAN: RIWAYAT PESANAN PRIBADI */}
        {/* ==================================== */}
        <div className="w-full md:w-2/3">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-800">Riwayat Pesanan</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-black px-4 py-1.5 rounded-full border border-gray-200">
              {orders.length} Transaksi
            </span>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <div className="text-5xl mb-4 opacity-50">🛍️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                <p className="text-gray-500 text-sm">Ayo buat momen terbaikmu bersama CetakPro sekarang!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-3 py-1 rounded-md uppercase tracking-widest border border-gray-200">
                        ORD-{order.id}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-snug mb-1">{order.product_name}</h3>
                    <p className="text-[#2E3C8B] font-black text-xl">{formatRupiah(order.total_price)}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-center pt-3 md:pt-0 border-t border-gray-50 md:border-none">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border 
                      ${order.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-100' : 
                        order.status === 'Diproses' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      {order.status || 'Menunggu'}
                    </span>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}