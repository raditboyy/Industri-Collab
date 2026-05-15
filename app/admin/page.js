"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  
  // ==========================================
  // STATE UNTUK PRODUK (KODE LAMA)
  // ==========================================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: "", message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, imageUrl: null });
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "Buku" });

  // ==========================================
  // STATE UNTUK PESANAN (FITUR BARU)
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState([]); 

  // TAMBAHAN STATE UNTUK FILTER & LIMIT PESANAN
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [limitTampil, setLimitTampil] = useState(10);

  const ADMIN_EMAIL = "admin@cetaklagi.com";

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/login");
    } else {
      fetchProducts();
      fetchAllOrders();
    }
  };

  // ==========================================
  // FUNGSI MANAJEMEN PRODUK
  // ==========================================
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      return setNotification({
        isOpen: true, title: "Foto Produk Diperlukan", message: "Mohon pilih file foto produk terlebih dahulu sebelum menyimpan.", type: "warning"
      });
    }
    setIsSubmitting(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;
      const { error: dbError } = await supabase.from("products").insert([
        { name: formData.name, price: parseInt(formData.price), stock: parseInt(formData.stock), category: formData.category, image_url: imageUrl }
      ]);
      if (dbError) throw dbError;
      setNotification({ isOpen: true, title: "Berhasil Disimpan", message: "Produk baru telah berhasil ditambahkan ke katalog.", type: "success" });
      setFormData({ name: "", price: "", stock: "", category: "Buku" });
      setImageFile(null);
      document.getElementById('file-upload').value = ""; 
      fetchProducts();
    } catch (error) {
      setNotification({ isOpen: true, title: "Gagal Menyimpan", message: "Terjadi kesalahan pada sistem: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDelete = (id, imageUrl) => {
    setConfirmDialog({ isOpen: true, id, imageUrl });
  };

  const executeDelete = async () => {
    const { id, imageUrl } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null, imageUrl: null });
    setLoading(true);
    try {
      const { error: dbError } = await supabase.from("products").delete().eq("id", id);
      if (dbError) throw dbError;
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        await supabase.storage.from('product-images').remove([fileName]);
      }
      setNotification({ isOpen: true, title: "Produk Dihapus", message: "Produk beserta fotonya telah berhasil dihapus dari sistem.", type: "success" });
      fetchProducts();
    } catch (error) {
      setNotification({ isOpen: true, title: "Gagal Menghapus", message: "Terjadi kesalahan: " + error.message, type: "error" });
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // ==========================================
  // FUNGSI MANAJEMEN PESANAN
  // ==========================================
  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) setOrders(data);
    setLoadingOrders(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      setNotification({ isOpen: true, title: "Gagal Update", message: "Gagal merubah status pesanan.", type: "error" });
    } else {
      fetchAllOrders(); 
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Menunggu Pembayaran").length;
  const processOrders = orders.filter(o => o.status === "Diproses").length;

  const toggleExpand = (categoryName) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(item => item !== categoryName));
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  // LOGIKA FILTER STATUS SEBELUM DI-GROUP
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "Semua") return true;
    if (filterStatus === "Proses") return order.status === "Diproses";
    if (filterStatus === "Selesai") return order.status === "Selesai";
    if (filterStatus === "Menunggu") return order.status === "Menunggu Pembayaran";
    return true;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const cat = order.product_name || "Lainnya"; 
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(order);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <header className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-[#2E3C8B] tracking-tight">Panel Admin Cetaklagi</h1>
          <p className="text-gray-500 font-medium mt-2">Kelola stok produk dan proses pesanan pelanggan dalam satu tempat.</p>
        </header>

        {/* ========================================================= */}
        {/* SECTION 1: MANAJEMEN PRODUK */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-gray-800">Manajemen Produk</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Form Tambah Produk */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#2E3C8B] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-50 text-[#2E3C8B] rounded-lg flex items-center justify-center text-sm">＋</span>
                Tambah Produk
              </h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Nama Produk</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2E3C8B] outline-none text-sm" placeholder="Contoh: Buku Sketsa A4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Harga</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm" placeholder="20000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Stok</label>
                    <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm" placeholder="50" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Kategori</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-bold text-[#2E3C8B]">
                    <option>Buku</option>
                    <option>Stiker</option>
                    <option>Dokumen</option>
                    <option>Souvenir</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Foto Produk</label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-[#2E3C8B] hover:file:bg-blue-100 cursor-pointer" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/10 transition-all mt-4 disabled:opacity-50">
                  {isSubmitting ? "Menyimpan Data..." : "Simpan Produk"}
                </button>
              </form>
            </div>

            {/* Katalog Produk Aktif */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#2E3C8B] tracking-tight">Katalog Aktif</h2>
                <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-400 uppercase tracking-widest">{products.length} Produk</span>
              </div>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-[#2E3C8B]/20 border-t-[#2E3C8B] rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 overflow-hidden">
                          {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : "📦"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{p.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-[#D94841] bg-red-50 px-2 py-0.5 rounded uppercase">{p.category}</span>
                            <span className="text-[10px] font-bold text-gray-400">Stok: {p.stock}</span>
                            <span className="text-xs font-black text-[#2E3C8B] ml-2">{formatRupiah(p.price)}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => requestDelete(p.id, p.image_url)} className="p-3 text-gray-300 hover:text-[#D94841] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: MANAJEMEN PESANAN (DENGAN FILTER & LIMIT) */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center gap-4 mb-8 pt-8">
            <h2 className="text-2xl font-black text-gray-800">Manajemen Pesanan</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
            <button onClick={fetchAllOrders} className="text-[10px] font-black uppercase text-gray-400 bg-white border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">
              Refresh Data
            </button>
          </div>

          {/* WIDGET STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">📦</div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pesanan</p>
                <h3 className="text-2xl font-black text-gray-800">{totalOrders}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-2xl">⏳</div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menunggu Bayar</p>
                <h3 className="text-2xl font-black text-gray-800">{pendingOrders}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">⚙️</div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sedang Diproses</p>
                <h3 className="text-2xl font-black text-gray-800">{processOrders}</h3>
              </div>
            </div>
          </div>

          {/* FITUR BARU: MENU FILTER & LIMIT TAMPILAN */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 sm:w-auto bg-gray-50 border border-gray-200 text-[#2E3C8B] font-bold text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2E3C8B]/30 transition-all cursor-pointer"
              >
                <option value="Semua">Semua Pesanan</option>
                <option value="Menunggu">Menunggu Pembayaran</option>
                <option value="Proses">Sedang Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tampilkan:</label>
              <select 
                value={limitTampil} 
                onChange={(e) => setLimitTampil(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="flex-1 sm:w-auto bg-gray-50 border border-gray-200 text-[#2E3C8B] font-bold text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2E3C8B]/30 transition-all cursor-pointer"
              >
                <option value={10}>10 Pesanan</option>
                <option value={20}>20 Pesanan</option>
                <option value="All">Semua (All)</option>
              </select>
            </div>
          </div>

          {/* DAFTAR PESANAN PER KATEGORI */}
          {loadingOrders ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#2E3C8B]/20 border-t-[#2E3C8B] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center shadow-sm">
                  <p className="text-gray-400 font-bold">Tidak ada pesanan yang sesuai filter.</p>
                </div>
              ) : (
                Object.entries(groupedOrders).map(([kategori, items], index) => {
                  const isExpanded = expandedCategories.includes(kategori);
                  
                  // Logika Limit yang terhubung ke Dropdown
                  const limitNum = limitTampil === "All" ? items.length : limitTampil;
                  const listTampil = isExpanded ? items : items.slice(0, limitNum);
                  const totalSisa = items.length - limitNum;

                  return (
                    <div key={index} className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                      <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="text-xl font-bold text-[#2E3C8B] flex items-center gap-3">
                          <span className="w-2 h-8 bg-[#D94841] rounded-full"></span>
                          {kategori}
                        </h2>
                        <span className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
                          {items.length} Pesanan
                        </span>
                      </div>

                      {/* TABEL */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-gray-400 text-[11px] uppercase tracking-[2px] border-b border-gray-100">
                              <th className="pb-4 font-bold pl-4">ID & Tanggal</th>
                              <th className="pb-4 font-bold">Total</th>
                              <th className="pb-4 font-bold text-center">Status</th>
                              <th className="pb-4 font-bold text-right pr-4">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {listTampil.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-5 pl-4">
                                  <div className="text-xs font-bold text-gray-800 mb-1">ORD-{order.id}</div>
                                  <div className="text-[10px] text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </div>
                                </td>
                                <td className="py-5 font-bold text-[#2E3C8B]">
                                  {formatRupiah(order.total_price)}
                                </td>
                                <td className="py-5 text-center">
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-wider uppercase ${
                                    order.status === "Menunggu Pembayaran" ? "bg-orange-50 text-orange-600 border border-orange-100" : 
                                    order.status === "Diproses" ? "bg-blue-50 text-blue-600 border border-blue-100" : 
                                    "bg-green-50 text-green-600 border border-green-100"
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-5 text-right pr-4">
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => updateStatus(order.id, "Diproses")}
                                      disabled={order.status === "Diproses" || order.status === "Selesai"}
                                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-20 disabled:hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95"
                                    >
                                      PROSES
                                    </button>
                                    <button 
                                      onClick={() => updateStatus(order.id, "Selesai")}
                                      disabled={order.status === "Selesai"}
                                      className="bg-[#22C55E] hover:bg-green-600 disabled:opacity-20 disabled:hover:bg-[#22C55E] text-white px-5 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95"
                                    >
                                      SELESAI
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* TOMBOL LIHAT SEMUA (Cuma muncul kalau sisa pesanan > 0) */}
                      {totalSisa > 0 && (
                        <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
                          <button 
                            onClick={() => toggleExpand(kategori)}
                            className="bg-[#F8F9FB] text-[#2E3C8B] px-8 py-3 rounded-2xl text-xs font-black hover:bg-[#2E3C8B] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
                          >
                            {isExpanded ? 'TUTUP SEBAGIAN' : `LIHAT ${totalSisa} PESANAN LAINNYA`}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" 
                              className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5-7.5-7.5-7.5" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>

      {/* ========================================================= */}
      {/* CUSTOM POP-UP */}
      {/* ========================================================= */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' : 
              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
              'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '!' : '✕'}
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">{notification.title}</h3>
            <p className="text-gray-500 text-sm mb-8">{notification.message}</p>
            <button 
              onClick={() => setNotification({ ...notification, isOpen: false })}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-[#D94841] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Hapus Produk?</h3>
            <p className="text-gray-500 text-sm mb-8">Tindakan ini tidak dapat dibatalkan. Produk dan fotonya akan dihapus dari sistem secara permanen.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, id: null, imageUrl: null })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-all"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 bg-[#D94841] hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}