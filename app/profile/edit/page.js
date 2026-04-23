"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setFullName(session.user.user_metadata?.full_name || "");
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (!error) {
      alert("Profil berhasil diperbarui!");
      router.push("/profile");
    } else {
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-[#2E3C8B] mb-2">Edit Profil</h1>
          <p className="text-gray-400 text-sm mb-8">Perbarui informasi nama lengkap Anda.</p>

          <form onSubmit={updateProfile} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2E3C8B] outline-none text-sm transition-all"
                placeholder="Masukkan nama Anda..."
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-[#2E3C8B] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/10 hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}