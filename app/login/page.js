"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/"); // Kembali ke Home setelah login sukses
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container utama dibikin Full Screen (mentok tanpa jarak)
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* PANEL KIRI: Full Layout dengan Background Gambar */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center p-10 lg:p-20 bg-[url('https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center">
        
        {/* Overlay Putih Transparan/Blur agar teks biru & merah tetap terbaca jelas */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 max-w-lg mx-auto w-full">
          {/* Logo Cetaklagi (Selaras dengan Navbar) */}
          <div className="mb-12">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter">
                  <span className="text-[#2E3C8B]">Cetak</span>
                  <span className="text-[#D94841]">lagi</span>
                </span>
                <span className="text-[9px] font-bold text-[#2E3C8B] tracking-widest mt-0.5 uppercase">
                  Make a good moment!
                </span>
              </div>
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-[#2E3C8B] leading-[1.15] mb-6 tracking-tight">
            Kembali berkreasi untuk wujudkan ide besarmu.
          </h1>
          <p className="text-gray-600 leading-relaxed font-medium">
            Masuk ke dashboard untuk memantau status pesanan, mengunggah desain baru, dan melihat riwayat transaksimu bersama PT Cetak Lagi.
          </p>
        </div>
      </div>

      {/* PANEL KANAN: Form Login Full */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-10 lg:p-20 bg-white relative z-10">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Selamat Datang</h2>
          <p className="text-gray-500 mb-10 text-sm">Masukkan email dan password untuk melanjutkan.</p>

          {/* Notifikasi Error jika login gagal */}
          {error && (
            <div className="bg-red-50 text-[#D94841] p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2E3C8B] outline-none text-black font-medium transition-all bg-gray-50/50 focus:bg-white"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <Link href="#" className="text-xs font-bold text-[#2E3C8B] hover:text-[#D94841] transition-colors">
                  Lupa password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#2E3C8B] outline-none text-black font-medium transition-all bg-gray-50/50 focus:bg-white tracking-widest"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/10 flex justify-center items-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#D94841] font-bold hover:underline underline-offset-4">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}