import React from 'react';

// Tambahin prop 'type' (default-nya 'success')
export default function CustomAlert({ isOpen, message, onClose, type = 'success' }) {
  if (!isOpen) return null;

  // Bikin logic ganti warna dan ikon tergantung tipe alert-nya
  const isError = type === 'error';
  const isWarning = type === 'warning';

  // Tentukan warna latar ikon
  const iconBgColor = isError ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-[#2E3C8B]';
  
  // Tentukan teks tombol
  const buttonText = isError ? 'TUTUP' : isWarning ? 'LOGIN ULANG' : 'OKE MANTAP';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Kotak Putih dengan gradient bawah ala screenshot lu */}
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden border border-gray-100">
        
        {/* Efek gradient biru di bagian bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2E3C8B]/20 to-transparent -z-10 pointer-events-none"></div>

        {/* IKON DINAMIS */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md ${iconBgColor}`}>
          {isError ? (
            // Ikon Silang (Error)
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : isWarning ? (
            // Ikon Tanda Seru (Warning/Sesi Habis)
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            // Ikon Centang (Success - default)
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Teks Pesan */}
        <h3 className="text-xl font-black text-[#2E3C8B] mb-8 leading-tight px-2">
          {message}
        </h3>

        {/* Tombol Aksi */}
        <button
          onClick={onClose}
          className="w-full bg-[#2E3C8B] hover:bg-[#1E2B6B] text-white font-black py-4 px-6 rounded-2xl transition-all uppercase tracking-wide shadow-lg active:scale-95"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}