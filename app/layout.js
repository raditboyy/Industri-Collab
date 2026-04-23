"use client"; // Tambahkan ini di paling atas kalau belum ada
import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar"; 
import ProtectedRoute from "@/components/ProtectedRoute"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Tentukan halaman mana saja yang GAK MAU pakai Navbar utama
  const noNavbarRoutes = ["/company-profile"];
  const isNoNavbar = noNavbarRoutes.includes(pathname);

  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-white`}>
        {/* Navbar cuma muncul kalau BUKAN halaman company-profile */}
        {!isNoNavbar && <Navbar />} 
        
        <ProtectedRoute>
          <main>
            {children}
          </main>
        </ProtectedRoute>
      </body>
    </html>
  );
}