"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Pake motion biar makin smooth
import Chatbotnew from './chatbotnew'; 

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowButton(true), 1000); 
  }, []);

  return (
    <>
      <Chatbotnew isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className={`fixed bottom-6 right-6 z-[90] flex flex-col items-end transition-all duration-1000 ${
        showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        
        {/* ISI MENU (Mekar ke atas) */}
        <div className={`flex flex-col items-end gap-3 mb-4 transition-all duration-500 origin-bottom ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}>
          
          {/* A. TANYA AI */}
          <button 
            onClick={() => { setIsChatOpen(true); setIsOpen(false); }}
            className="flex items-center flex-row-reverse gap-3 group outline-none"
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14.25h.008v.008H8.25v-.008Zm7.5 0h.008v.008h-.008v-.008Zm-3.75 3h.008v.008h-.008v-.008ZM12 22.5c-5.385 0-9.75-4.365-9.75-9.75v-4.5h19.5v4.5c0 5.385-4.365 9.75-9.75 9.75Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a3 3 0 0 1 3 3v2.25h-6V5.25a3 3 0 0 1 3-3Z" />
              </svg>
            </div>
            <span className="bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              Tanya AI
            </span>
          </button>

          {/* B. SHOPEE */}
          <a href="https://shopee.co.id/tokolu" target="_blank" rel="noreferrer" className="flex items-center flex-row-reverse gap-3 group">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm hover:bg-slate-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            </div>
            <span className="bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Shopee</span>
          </a>

          {/* C. WHATSAPP */}
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center flex-row-reverse gap-3 group">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm hover:bg-slate-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            </div>
            <span className="bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">WhatsApp</span>
          </a>
        </div>

        {/* 4. SAKLAR UTAMA (TOGGLE) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 ${
            isOpen ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 border border-slate-100'
          }`}
        >
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </div>
        </button>

      </div>
    </>
  );
}