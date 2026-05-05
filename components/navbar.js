"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/logo';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  
  // STATE BARU UNTUK DETEKSI SCROLL
  const [isScrolled, setIsScrolled] = useState(false);

  const ADMIN_EMAIL = "admin@cetaklagi.com";

  // Fungsi untuk hitung jumlah total QTY item di keranjang (SUDAH DIPERBAIKI)
  const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Hitung total qty dari semua produk, bukan cuma jumlah macam barang
    const totalQty = cart.reduce((total, item) => total + (item.qty || 1), 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    // FUNGSI DETEKSI SCROLL
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    checkSession();
    updateCartBadge(); // Panggil saat pertama load

    // 1. Dengerin perubahan storage dari tab/halaman lain
    window.addEventListener('storage', updateCartBadge);
    
    // 2. Dengerin sinyal custom dari Pop-Up Produk (Dua-duanya dipasang biar aman)
    window.addEventListener('cartUpdated', updateCartBadge);
    window.addEventListener('cart-updated', updateCartBadge);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('storage', updateCartBadge);
      window.removeEventListener('cartUpdated', updateCartBadge);
      window.removeEventListener('cart-updated', updateCartBadge);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menus = [
    { name: 'Home', path: '/' },
    { name: 'Product', path: '/product' },
    { name: 'Features', path: '/features' },
    { name: 'Tentang Kami', path: '/about' },
  ];

  // LOGIKA WARNA BERDASARKAN SCROLL
  const isHome = pathname === '/';
  const navBgClass = isHome && !isScrolled ? "bg-transparent py-4" : "bg-white border-b border-gray-200 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)]";
  const textColorClass = isHome && !isScrolled ? "text-white hover:text-blue-200" : "text-gray-500 hover:text-black";
  const activeTextColorClass = isHome && !isScrolled ? "text-white font-bold" : "text-black font-bold";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
          <Logo /> 
        </Link>

        {/* Menu Tengah */}
        <div className="hidden lg:flex items-center gap-8">
          {menus.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link 
                key={menu.name} 
                href={menu.path} 
                className={`text-sm tracking-wide transition-colors duration-200 font-medium ${
                  isActive ? activeTextColorClass : textColorClass
                }`}
              >
                {menu.name}
              </Link>
            )
          })}

          {!isLoading && user && user.email === ADMIN_EMAIL && (
            <Link 
              href="/admin" 
              className={`text-sm font-bold px-4 py-1.5 rounded-full border-2 transition-all ${
                pathname === "/admin" 
                ? "bg-[#D94841] text-white border-[#D94841]" 
                : isHome && !isScrolled 
                  ? "text-white border-white hover:bg-white hover:text-[#2536F4]" 
                  : "text-[#D94841] border-[#D94841] hover:bg-[#D94841] hover:text-white"
              }`}
            >
              Dashboard Admin
            </Link>
          )}
        </div>

        {/* Menu Kanan */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Ikon Keranjang */}
          <Link href="/cart" className={`relative transition-colors p-1 ${textColorClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            
            {/* Animasi Bouncing Badge Keranjang */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-black text-white bg-[#D94841] rounded-full px-1 border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          <div className={`w-px h-5 hidden md:block ${isHome && !isScrolled ? 'bg-white/30' : 'bg-gray-200'}`}></div>

          {!isLoading && (
            user ? (
              <Link href="/profile" className="flex items-center gap-3 group">
                <div className={`w-9 h-9 border rounded-full flex items-center justify-center overflow-hidden transition-all ${
                  isHome && !isScrolled ? 'bg-white/10 border-white/30 group-hover:border-white' : 'bg-gray-100 border-gray-200 group-hover:border-black'
                }`}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center font-bold text-xs ${
                      isHome && !isScrolled ? 'bg-white text-[#2536F4]' : 'bg-[#2E3C8B] text-white'
                    }`}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className={`text-sm font-bold max-w-[100px] truncate ${isHome && !isScrolled ? 'text-white' : 'text-black'}`}>
                  {user.user_metadata?.full_name?.split(" ")[0] || "Member"}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className={`text-sm font-semibold transition-colors ${textColorClass}`}>Log in</Link>
                <Link href="/register" className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  isHome && !isScrolled 
                  ? "bg-white text-[#2536F4] hover:bg-gray-100" 
                  : "bg-[#2536F4] hover:bg-[#1C28B5] text-white"
                }`}>Sign up</Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}