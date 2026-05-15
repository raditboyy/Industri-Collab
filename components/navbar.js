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
  const [isScrolled, setIsScrolled] = useState(false);

  const ADMIN_EMAIL = "admin@cetaklagi.com"; 
  
  // WARNA TEMA BALIK KE BIRU TUA CETAKLAGI
  const themeColor = "#2E3C8B"; 
  const badgeColor = "#D94841"; // Merah untuk notif keranjang

  const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    checkSession();
    updateCartBadge(); 

    window.addEventListener('storage', updateCartBadge);
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

  return (
    // NAVBAR KAPSUL MELAYANG
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out w-[95%] max-w-5xl ${
      isScrolled ? "top-4" : "top-6"
    }`}>
      <div className={`flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-300 ${
        isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border border-gray-200" 
        : "bg-white/80 backdrop-blur-sm shadow-md border border-white/30"
      }`}>
        
        {/* LOGO */}
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
          <span className="font-black text-xl tracking-tight" style={{ color: themeColor }}>
            Cetak Lagi
          </span>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden lg:flex items-center gap-6">
          {menus.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link 
                key={menu.name} 
                href={menu.path} 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive ? "font-bold" : "text-gray-500 hover:text-gray-900"
                }`}
                style={{ color: isActive ? themeColor : undefined }}
              >
                {menu.name}
              </Link>
            )
          })}

          {/* DASHBOARD ADMIN (Di sebelah Tentang Kami) */}
          {!isLoading && user && user.email === ADMIN_EMAIL && (
            <Link 
              href="/admin" 
              className="text-xs font-black text-white px-5 py-2 rounded-full transition-transform hover:scale-105 shadow-md shadow-blue-900/20" 
              style={{ backgroundColor: themeColor }}
            >
              DASHBOARD ADMIN
            </Link>
          )}
        </div>

        {/* KANAN */}
        <div className="flex items-center gap-4">
          
          <Link href="/cart" className="relative p-1 text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-black text-white rounded-full px-1 border-2 border-white animate-bounce" style={{ backgroundColor: badgeColor }}>
                {cartCount}
              </span>
            )}
          </Link>

          <div className="w-px h-5 bg-gray-300 hidden md:block"></div>

          {!isLoading && (
            user ? (
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white overflow-hidden" style={{ backgroundColor: themeColor }}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    user.email.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black">Login</Link>
                <Link href="/register" className="text-sm font-bold text-white px-5 py-2 rounded-full transition-transform hover:scale-105 shadow-md shadow-blue-900/20" style={{ backgroundColor: themeColor }}>
                  Daftar
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}