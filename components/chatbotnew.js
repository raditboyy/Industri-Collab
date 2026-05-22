"use client";
import { useState, useRef, useEffect } from 'react';

export default function Chatbotnew({ isOpen, onClose }) {
  // 1. STATE UNTUK PESAN & INPUT
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo kak! Cain di sini. Ada yang bisa Cain bantu cetak hari ini? ✨' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Bikin ID unik untuk user (biar Cain ingat konteks chat)
  const [sessionId] = useState(() => "user_" + Math.random().toString(36).substr(2, 9));
  
  // Referensi untuk auto-scroll ke bawah
  const messagesEndRef = useRef(null);

  // Auto-scroll setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fungsi Kirim Pesan
  const kirimPesan = async () => {
    if (!inputValue.trim()) return;

    const pesanUser = inputValue.trim();
    
    // Munculin pesan user di layar
    setMessages((prev) => [...prev, { sender: 'user', text: pesanUser }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Tembak data ke Python (FastAPI) lu
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: pesanUser })
      });

      if (response.ok) {
        const data = await response.json();
        // Munculin balasan Cain
        setMessages((prev) => [...prev, { sender: 'bot', text: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Waduh, server Cain lagi error nih kak.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Koneksi gagal! Pastikan uvicorn Python udah nyala.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tekan tombol Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      kirimPesan();
    }
  };

  return (
    // CONTAINER CHAT MELAYANG (Desain sesuai CSS asli lu)
    <div className={`fixed bottom-24 right-6 w-full max-w-[400px] h-[75vh] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-[100] transition-all duration-300 origin-bottom-right font-sans ${
      isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'
    }`}>
      
      {/* HEADER KACA (Terang) */}
      <div className="bg-white/85 p-5 text-center border-b border-white/50 shadow-[0_4px_15px_rgba(0,0,0,0.1)] relative z-10">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors font-black text-lg"
        >
          ✕
        </button>
        <h1 className="m-0 text-[#0f172a] text-2xl font-extrabold tracking-tight">🤖 Cain Chatbot</h1>
        <p className="m-0 mt-1 text-[#0284c7] text-[13px] font-semibold">Asisten Cetak Lagi</p>
      </div>

      {/* AREA OBROLAN */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`px-[18px] py-[14px] max-w-[80%] text-[14px] leading-relaxed shadow-[0_5px_15px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-2 ${
              msg.sender === 'bot' 
                ? 'self-start bg-white/95 text-[#0f172a] rounded-[20px_20px_20px_0] border border-white' 
                : 'self-end bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] text-white rounded-[20px_20px_0_20px] border border-white/20'
            }`}
          >
            {/* Pakai dangerouslySetInnerHTML biar kalau Cain kirim text tebal (<b>) atau link (<a>) bisa kebaca */}
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
        
        {/* Indikator Cain sedang mengetik */}
        {isLoading && (
          <div className="self-start bg-white/95 text-[#0f172a] px-[18px] py-[14px] rounded-[20px_20px_20px_0] shadow-md border border-white text-sm animate-pulse flex gap-1">
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        )}
        
        {/* Invisible div buat target auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* AREA INPUT BAWAH */}
      <div className="p-5 bg-transparent flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanya harga, bahan, dll..." 
          className="flex-1 px-5 py-[15px] bg-white/5 border border-white/20 rounded-[30px] text-white text-sm outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-[#38bdf8] focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] focus:bg-white/10"
        />
        <button 
          onClick={kirimPesan}
          disabled={isLoading}
          className="bg-gradient-to-br from-[#38bdf8] to-[#0284c7] border-none w-[50px] h-[50px] rounded-full text-white flex justify-center items-center shadow-[0_5px_15px_rgba(2,132,199,0.4)] transition-all hover:scale-105 hover:shadow-[0_8px_20px_rgba(2,132,199,0.6)] active:scale-95 disabled:opacity-50"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-5 h-5 ml-[-2px] rotate-45">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>

      {/* CATATAN KECIL DI BAWAH (FOOTER NOTE) */}
      <div className="text-right text-[11px] text-white/50 px-6 pb-4 mt-[-5px] font-medium">
        Cain error atau salah jawab? <a href="https://wa.me/6282314941408" target="_blank" rel="noreferrer" className="text-[#38bdf8] no-underline transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">Hubungi Admin WA</a>
      </div>

    </div>
  );
}