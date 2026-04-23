export default function Logo() {
  return (
    <div className="flex flex-col select-none pt-1">
      {/* Baris Teks Utama */}
      <div className="flex items-baseline">
        <span className="font-black text-3xl tracking-tighter text-[#2E3C8B]">
          Cetak
        </span>
        <span className="font-black text-3xl tracking-tighter text-[#D94841]">
          lagi
        </span>
      </div>
      
      {/* Tagline di bawah kanan */}
      <span className="text-[9px] font-bold tracking-tight text-[#2E3C8B] text-right mt-[1px] mr-0.5">
        Make a good moment!
      </span>
    </div>
  );
}