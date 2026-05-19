"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomAlert({ isOpen, message, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          />

          {/* Pop-up Box */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="pointer-events-auto relative max-w-sm w-full bg-white/60 backdrop-blur-xl border-[6px] border-white/80 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center"
          >
            {/* Icon Sukses (Opsional) */}
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-[#2E3C8B] text-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-[#2E3C8B] font-black text-xl leading-tight mb-6">
              {message}
            </h3>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#2E3C8B] text-white font-bold rounded-2xl hover:bg-[#1C28B5] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              OKE MANTAP
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}