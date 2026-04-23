"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminOrderManagement() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ganti dengan email admin lu
  const ADMIN_EMAIL = "admin@cetaklagi.com"; 

  useEffect(() => {
    checkAdminAccess();
    fetchAllOrders();
  }, []);

  // 1. PROTEKSI HALAMAN: Hanya admin yang bisa masuk
  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== ADMIN_EMAIL) {
      alert("Akses ditolak! Halaman ini hanya untuk Admin.");
      router.push("/");
    }
  };

  // 2. AMBIL SEMUA PESANAN DARI DATABASE
  const fetchAllOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setOrders(data);
    }
    setIsLoading(false);
  };

  // 3. FUNGSI UPDATE STATUS (Ini yang bikin di user keganti otomatis)
  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Gagal update status: " + error.message);
    } else {
      // Refresh data di layar admin setelah update
      fetchAllOrders(); 
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Menunggu Pembayaran": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Diproses": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Selesai": return "bg-green-50 text-green-600 border-green-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  if (isLoading) return <div className="min-h-screen pt-32 text-center font-black text-[#2E3C8B] animate-pulse">MEMUAT SEMUA PESANAN...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2E3C8B] tracking-tight">Manajemen Pesanan</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">Kelola status pembayaran dan proses produksi.</p>
          </div>
          <button 
            onClick={fetchAllOrders} 
            className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
          >
            🔄 Refresh Data
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Detail Pesanan</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-gray-400 font-bold italic">Belum ada pesanan yang masuk.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <p className="font-black text-gray-800 text-sm">{order.product_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                          ID: ORD-{order.id} • {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="p-6 font-black text-[#2E3C8B] text-sm">
                        {formatRupiah(order.total_price)}
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tighter ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => updateStatus(order.id, "Diproses")}
                            disabled={order.status === "Diproses" || order.status === "Selesai"}
                            className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                          >
                            PROSES
                          </button>
                          <button 
                            onClick={() => updateStatus(order.id, "Selesai")}
                            disabled={order.status === "Selesai"}
                            className="bg-green-50 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl border border-green-100 hover:bg-green-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-green-50 disabled:hover:text-green-600"
                          >
                            SELESAI
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))