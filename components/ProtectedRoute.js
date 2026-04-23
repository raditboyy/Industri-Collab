"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Fungsi untuk ngecek satpam
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const publicRoutes = ['/', '/login', '/register', '/about', '/features'];
      const isPublic = publicRoutes.includes(pathname);

      if (!session && !isPublic) {
        // Kalau ga ada sesi dan bukan halaman publik, tendang!
        router.replace('/login');
      } else {
        // Kalau aman, lepas loading
        setLoading(false);
      }
    };

    checkUser();

    // Satpam tambahan: Pantau kalau user tiba-tiba logout
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const publicRoutes = ['/', '/login', '/register', '/about', '/features'];
      if (event === 'SIGNED_OUT' && !publicRoutes.includes(pathname)) {
        router.replace('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Selama pengecekan (loading), jangan tampilin apa-apa dulu atau tampilin logo
  if (loading) {
    const publicRoutes = ['/', '/login', '/register', '/about', '/features'];
    if (publicRoutes.includes(pathname)) return children; // Halaman publik jangan di-loading
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
           <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center animate-bounce">
              <span className="text-white font-bold">C</span>
           </div>
        </div>
      </div>
    );
  }

  return children;
}