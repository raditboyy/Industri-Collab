from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from thefuzz import process, fuzz
import re
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ItemPesan(BaseModel):
    session_id: str 
    message: str

class DataUpdate(BaseModel):
    kategori: str
    kunci: str
    isi_baru: str

ingatan_cain = {}

def baca_database():
    with open("Backend_cain/database_cain.json", "r") as file:
        return json.load(file)

# ==========================================
# 1. FILTER KATA SAMPAH (ANTI-HALU SYSTEM)
# ==========================================
def bersihkan_teks(teks):
    teks = teks.lower()
    # Hapus tanda baca
    teks = re.sub(r'[^\w\s]', ' ', teks)
    
    # Daftar kata yang sering bikin bot salah paham (dihapus sebelum mikir)
    # \b artinya batas kata, supaya dia nggak ngehapus huruf di dalam kata lain
    kata_sampah = [
        r'\baku\b', r'\bsaya\b', r'\bkamu\b', r'\bkasih\b', r'\bminta\b', 
        r'\btolong\b', r'\bdong\b', r'\bkak\b', r'\bmin\b', r'\bmas\b', 
        r'\bbisa\b', r'\bmau\b', r'\bpengen\b', r'\bbuat\b', r'\buntuk\b', 
        r'\baja\b', r'\bdeh\b', r'\bsih\b', r'\bnya\b', r'\bga\b', r'\bgak\b', 
        r'\bada\b', r'\bcoba\b', r'\blihat\b', r'\bliat\b', r'\bini\b', r'\bitu\b'
    ]
    
    for sampah in kata_sampah:
        teks = re.sub(sampah, '', teks)
        
    # Hapus spasi berlebih
    return " ".join(teks.split())

# ==========================================
# 2. MESIN PENCARI DENGAN KKM TINGGI (90)
# ==========================================
def deteksi_kategori(teks_bersih, dictionary_kategori):
    if not teks_bersih:
        return None
        
    skor_tertinggi = 0
    kategori_terpilih = None

    for kategori, daftar_keyword in dictionary_kategori.items():
        # Membandingkan teks bersih dengan database
        match, score = process.extractOne(teks_bersih, daftar_keyword, scorer=fuzz.token_set_ratio)
        
        # KKM KITA NAIKKAN JADI 90. Kalau nggak benar-benar mirip, tolak!
        if score > skor_tertinggi and score >= 90:
            skor_tertinggi = score
            kategori_terpilih = kategori

    return kategori_terpilih

# ==========================================
# 3. OTAK UTAMA CAIN
# ==========================================
def proses_jawaban(session_id, teks_user):
    teks_asli = teks_user.lower()
    teks_bersih = bersihkan_teks(teks_user) # Teks yang udah disaring bersih
    
    db = baca_database()
    pengetahuan = db["pengetahuan"]
    list_bahan = db["list_bahan"]
    jawaban_faq = db["jawaban_faq"]

    # Cek kata kunci reset
    if session_id not in ingatan_cain or any(kata in teks_asli for kata in ["batal", "reset", "ulang"]):
        ingatan_cain[session_id] = {"topik": None, "ukuran": None, "bahan": None, "jumlah": None, "desain": None, "error_count": 0}
        if any(kata in teks_asli for kata in ["batal", "reset", "ulang"]):
            return "Oke kak, pesanan sebelumnya udah Cain hapus. Kita mulai dari awal ya, mau cetak apa nih?"
            
    memori = ingatan_cain[session_id]
    data_baru_masuk = False

    # --- SENSOR UKURAN, JUMLAH, BAHAN (Tetap pakai teks asli) ---
    if re.search(r'\d+\s*x\s*\d+', teks_asli) or "cm" in teks_asli or "meter" in teks_asli:
        memori["ukuran"] = teks_asli
        data_baru_masuk = True
    elif any(ukuran in teks_asli for ukuran in ["a3", "a4", "a5", "a6"]):
        memori["ukuran"] = teks_asli
        data_baru_masuk = True

    if re.search(r'\d+\s*(lembar|pcs|buah|box|buku|rim)', teks_asli):
        memori["jumlah"] = teks_asli
        data_baru_masuk = True
    elif re.search(r'^\d+$', teks_asli): 
        memori["jumlah"] = teks_asli
        data_baru_masuk = True

    for kategori, bahan_bahan in list_bahan.items():
        for bahan in bahan_bahan:
            if bahan in teks_asli:
                memori["bahan"] = bahan
                data_baru_masuk = True
                if not memori["topik"]:
                    if kategori == "banner": memori["topik"] = "produk_banner"
                    elif kategori == "stiker": memori["topik"] = "produk_stiker"

    if data_baru_masuk:
        memori["error_count"] = 0

    # --- DETEKSI INTENT (Pakai TEKS BERSIH agar akurat) ---
    kategori_terpilih = deteksi_kategori(teks_bersih, pengetahuan)

    if kategori_terpilih:
        memori["error_count"] = 0 

        if "produk_" in kategori_terpilih and memori["topik"] != kategori_terpilih:
            memori["topik"] = kategori_terpilih
            memori["ukuran"] = None
            memori["bahan"] = None
            memori["jumlah"] = None

        if kategori_terpilih in jawaban_faq:
            return jawaban_faq[kategori_terpilih]
            
        elif kategori_terpilih == "harga_umum":
            if not memori["topik"]: return "Harganya bervariasi kak! Biar Cain bantu hitungin, kakak mau cetak produk apa nih?"
            else: return "Untuk produk ini harganya menyesuaikan spesifikasi kak. Yuk kita lengkapin dulu data ukuran dan bahannya."

    # --- ORPHAN INPUT CATCHER ---
    if not memori["topik"]:
        if memori["ukuran"] and not memori["jumlah"]: return f"Ukurannya {memori['ukuran']} udah Cain catat nih. Tapi ini untuk cetak apa ya kak?"
        if memori["jumlah"]: return f"Sip, untuk jumlah {memori['jumlah']} udah dicatat. Rencana mau cetak produk apa nih kak?"

    # --- FLOW MENAGIH KEKURANGAN DATA ---
    if memori["topik"]:
        topik = memori["topik"]
        
        if not data_baru_masuk and not kategori_terpilih:
            memori["error_count"] += 1
            if memori["error_count"] >= 2:
                return "Maaf kak, Cain kayaknya kurang paham detailnya hehe 😅. Biar lebih jelas, kakak bisa langsung chat Admin Manusia kita di WA ya!"

        if topik == "produk_banner":
            if not memori["ukuran"]: return "Bisa banget kak cetak banner! Ukurannya mau dibikin berapa x berapa meter?"
            if not memori["bahan"]: return f"Ukurannya {memori['ukuran']} ya. Untuk bahan mau pakai Flexi Standard atau Korchin (lebih tebal)?"
            if not memori["jumlah"]: return f"Sip pakai bahan {memori['bahan']}. Mau cetak berapa pcs nih kak?"
        
        elif topik == "produk_stiker":
            if not memori["ukuran"]: return "Cetak stiker siap laksanakan! Mau dicetak ukuran berapa cm kak per stikernya?"
            if not memori["bahan"]: return f"Ukurannya {memori['ukuran']} ya. Mau pakai bahan Bontax (kertas) atau Vinyl (plastik anti air)?"
            if not memori["jumlah"]: return f"Oke bahan {memori['bahan']} mantap. Kita hitungnya per lembar A3+ kak, butuh berapa lembar nih?"

        if memori["jumlah"] and memori["bahan"] and memori["ukuran"]:
            return f"Pesanan udah komplit! (Produk: {topik.split('_')[1].upper()}, Ukuran: {memori['ukuran']}, Bahan: {memori['bahan']}, Jumlah: {memori['jumlah']}). Kirim rekap pesanan ini ke Admin WA buat konfirmasi harga ya."

    # --- FALLBACK TERAKHIR ---
    return "Wah, Cain bingung nih kak 😅. Cain cuma paham urusan percetakan aja. Kakak lagi butuh cetak apa nih untuk area Jogja dan sekitarnya?"

@app.post("/chat")
async def chat_dengan_cain(request: ItemPesan):
    jawaban = proses_jawaban(request.session_id, request.message)
    return {"answer": jawaban}

@app.post("/update-database")
def update_db(request: DataUpdate):
    db = baca_database()
    if request.kategori in db and request.kunci in db[request.kategori]:
        db[request.kategori][request.kunci] = request.isi_baru
        with open("Backend_cain/database_cain.json", "w") as file:
            json.dump(db, file, indent=4) 
        return {"status": "sukses", "pesan": "Data berhasil diupdate."}
    return {"status": "gagal", "pesan": "Kategori tidak ditemukan."}