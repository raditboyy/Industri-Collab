"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Daftar rute lu
  const routes = ["/", "/product", "/features", "/about"];
  const currentIndex = routes.indexOf(pathname);

  // --- LOGIKA SATPAM ---
  // Kalau lagi di Home (/) atau rute gak terdaftar, LANGSUNG HILANG TOTAL
  if (pathname === "/" || currentIndex === -1) return null;

  // Logic navigasi (untuk halaman selain Home)
  const prevRoute = currentIndex > 0 ? routes[currentIndex - 1] : null;
  const nextRoute = currentIndex < routes.length - 1 ? routes[currentIndex + 1] : null;

  return (
    <div className="fixed top-28 inset-x-0 px-8 z-[999] pointer-events-none flex justify-between items-center">
      
      {/* AREA KIRI (BACK) */}
      <div className="flex-1 flex justify-start">
        <AnimatePresence mode="wait">
          {prevRoute && (
            <motion.button
              key={`prev-${prevRoute}`}
              initial={{ x: -40, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -40, opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(prevRoute)}
              className="pointer-events-auto w-16 h-16 flex items-center justify-center bg-white/40 backdrop-blur-md border-[6px] border-white/60 text-[#2E3C8B] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* AREA KANAN (NEXT) */}
      <div className="flex-1 flex justify-end">
        <AnimatePresence mode="wait">
          {nextRoute && (
            <motion.button
              key={`next-${nextRoute}`}
              initial={{ x: 40, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(nextRoute)}
              className="pointer-events-auto w-16 h-16 flex items-center justify-center bg-white/40 backdrop-blur-md border-[6px] border-white/60 text-[#2E3C8B] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}