"use client";
import { useState, useEffect } from 'react';
// Pastikan nama file import-nya sesuai, lu bilang kemaren kecil semua kan?
import Chatbotnew from './chatbotnew'; 

export default function FloatingMenu() {
  // 1. STATE (Otak buat nyimpen data buka-tutup)
  const [isOpen, setIsOpen] = useState(false); // Buat buka/tutup menu bulat-bulat
  const [showButton, setShowButton] = useState(false); // Buat animasi awal pas web di-load
  
  // INI DIA YANG BIKIN ERROR TADI (Sekarang udah diadain!)
  const [isChatOpen, setIsChatOpen] = useState(false); // Buat nampilin jendela Chatbot

  // Animasi muncul pas web pertama kali di-load
  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 1000); 
  }, []);

  return (
    <>
      {/* 2. RENDER CHATBOT (Disembunyiin kalau isChatOpen masih false) */}
      <Chatbotnew isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* 3. CONTAINER FLOATING MENU (Kanan Bawah) */}
      <div className={`fixed bottom-6 right-6 z-[90] flex flex-col items-end transition-all duration-700 ${
        showButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        
        {/* ISI MENU (Mekar ke atas) */}
        <div className={`flex flex-col items-end gap-4 mb-4 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'
        }`}>
          
          {/* A. TOMBOL BUKA CHATBOT (Udah pakai button dan onClick) */}
          <button 
            onClick={() => {
              setIsChatOpen(true); // Buka chatbot
              setIsOpen(false);    // Tutup menu floating
            }}
            className="flex items-center flex-row-reverse gap-3 group cursor-pointer border-none bg-transparent outline-none"
          >
            <div className="relative w-12 h-12 bg-slate-900 border border-cyan-500 rounded-lg flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:-translate-y-1 transition-all z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14.25h.008v.008H8.25v-.008Zm7.5 0h.008v.008h-.008v-.008Zm-3.75 3h.008v.008h-.008v-.008ZM12 22.5c-5.385 0-9.75-4.365-9.75-9.75v-4.5h19.5v4.5c0 5.385-4.365 9.75-9.75 9.75Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a3 3 0 0 1 3 3v2.25h-6V5.25a3 3 0 0 1 3-3Z" />
              </svg>
            </div>
            <span className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/50 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.2)] text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Tanya_AI
            </span>
          </button>

          {/* B. TOMBOL SHOPEE */}
          <a href="https://shopee.co.id/tokolu" target="_blank" rel="noreferrer" className="flex items-center flex-row-reverse gap-3 group">
            <div className="relative w-12 h-12 bg-slate-900 border border-[#EE4D2D] rounded-lg flex items-center justify-center text-[#EE4D2D] shadow-[0_0_10px_rgba(238,77,45,0.3)] hover:shadow-[0_0_20px_rgba(238,77,45,0.6)] hover:-translate-y-1 transition-all z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            </div>
            <span className="bg-slate-900/80 backdrop-blur-md border border-[#EE4D2D]/50 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(238,77,45,0.2)] text-[10px] font-mono font-bold text-[#EE4D2D] uppercase tracking-widest opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Shopee_Link</span>
          </a>

          {/* C. TOMBOL WA */}
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center flex-row-reverse gap-3 group">
            <div className="relative w-12 h-12 bg-slate-900 border border-[#25D366] rounded-lg flex items-center justify-center text-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.3)] hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            </div>
            <span className="bg-slate-900/80 backdrop-blur-md border border-[#25D366]/50 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(37,211,102,0.2)] text-[10px] font-mono font-bold text-[#25D366] uppercase tracking-widest opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Hubungi_WA</span>
          </a>

        </div>

        {/* 4. SAKLAR UTAMA (TOGGLE) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)] z-20 group"
        >
          {!isOpen && <div className="absolute inset-0 rounded-xl border border-cyan-400 animate-ping opacity-30"></div>}
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-red-500 border-red-500' : 'rotate-0'}`}>
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>
            )}
          </div>
        </button>

      </div>
    </>
  );
}