"use client";
import { useState } from "react";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State baru khusus buat Chatbot

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-end gap-4">
        
        {/* Menu Platform */}
        <div 
          className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${
            isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-50 pointer-events-none"
          }`}
        >
          {/* Tombol Shopee */}
          <a href="https://shopee.co.id/cetaklagi?entryPoint=ShopBySearch&searchKeyword=cetak%20lagi%20pekalongan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 text-[#EE4D2D]">Shopee</span>
            <div className="w-12 h-12 bg-[#EE4D2D] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          </a>

          {/* Tombol Instagram */}
          <a href="https://instagram.com/cetaklagi.pkl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 text-[#E1306C]">Instagram</span>
            <div className="w-12 h-12 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
          </a>

          {/* Tombol WhatsApp */}
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 text-[#25D366]">WhatsApp</span>
            <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9c0 1.63.44 3.16 1.2 4.46L3 21l4.75-1.22c1.28.74 2.76 1.17 4.25 1.17h.02Z" />
              </svg>
            </div>
          </a>

          {/* Tombol Chatbot AI (Telah diubah buat manggil pop-up) */}
          <button 
            onClick={() => { 
              setIsChatOpen(true); 
              setIsOpen(false); // Tutup menu buletannya
            }} 
            className="flex items-center gap-3 group"
          >
            <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 text-[#2E3C8B]">Tanya AI</span>
            <div className="w-12 h-12 bg-[#2E3C8B] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h.008v.008H8.25V10.5Zm5.25 0h.008v.008H13.5V10.5Zm3.75 0h.008v.008H17.25V10.5ZM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Tombol Utama (Buka/Tutup Menu) */}
        <button 
          onClick={() => {
            if (isChatOpen) setIsChatOpen(false); // Kalau chat lagi buka, tutup dulu
            setIsOpen(!isOpen);
          }}
          className={`w-14 h-14 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 ${
            isOpen ? 'rotate-[135deg] bg-gray-800' : isChatOpen ? 'bg-gray-400' : 'bg-[#D94841]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

      </div>

      {/* POP-UP CHATBOT STREAMLIT MELAYANG */}
      <div 
        className={`fixed bottom-24 right-6 z-[100] w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${
          isChatOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header Chat */}
        <div className="bg-[#2E3C8B] px-5 py-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-bold text-white text-sm">Cetaklagi AI Assistant</h3>
              <p className="text-blue-200 text-[10px] uppercase tracking-wider font-bold">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Chat (Iframe Streamlit) */}
        <div className="flex-1 w-full bg-[#FAFAFA] relative">
          {/* Ganti src ini dengan link hosting Streamlit lu! */}
          <iframe 
            src="https://caincetaklagi.streamlit.app/?embed=true" 
            className="w-full h-full border-none absolute inset-0"
            title="AI Chatbot"
          />
        </div>
      </div>
    </>
  );
}