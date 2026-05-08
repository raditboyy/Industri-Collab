import streamlit as st
import requests
import uuid

# --- 1. CONFIG HALAMAN ---
st.set_page_config(page_title="Cain AI Chatbot", page_icon="🤖", layout="centered")

# --- 2. CUSTOM CSS SUPER ESTETIK ---
st.markdown("""
    <style>
    /* Background Utama: Navy ke Cyan Gelap (Futuristik) */
    .stApp {
        background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #082f49 100%) !important;
        background-attachment: fixed !important;
        color: white;
    }

    /* Menyembunyikan Header & Footer Bawaan Streamlit */
    header[data-testid="stHeader"] { background: transparent !important; }
    footer { display: none !important; }

    /* --- STYLING HEADER KACA (GLASSMORPHISM) --- */
    .glass-header {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 30px rgba(56, 189, 248, 0.15); /* Cahaya biru halus di belakang */
        padding: 25px;
        border-radius: 25px;
        text-align: center;
        margin-bottom: 40px;
        position: relative;
        overflow: hidden;
    }
    
    .glass-header h1 {
        margin: 0; 
        color: #ffffff; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 800;
        letter-spacing: 1px;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); /* Efek teks nyala putih */
    }
    
    .glass-header p {
        margin: 5px 0 0 0; 
        color: #38bdf8; /* Biru terang */
        font-size: 14px;
        font-weight: 500;
    }

    /* --- STYLING KOTAK INPUT BAWAH --- */
    /* Menghilangkan background kotak abu-abu jelek di area bawah */
    [data-testid="stBottomBlock"] {
        background: transparent !important;
    }
    
    /* Styling kotak ngetiknya */
    [data-testid="stChatInput"] {
        background: rgba(255, 255, 255, 0.05) !important;
        backdrop-filter: blur(15px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 30px !important;
        color: white !important;
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.1) !important;
    }
    
    /* Warna teks saat user ngetik */
    [data-testid="stChatInput"] textarea {
        color: white !important;
    }
    
    /* Tombol Send / Panah Kanan */
    [data-testid="stChatInputSubmitButton"] {
        color: #38bdf8 !important; 
    }

    /* --- STYLING BALON CHAT --- */
    /* Balon User (Warna Navy Gelap dengan pinggiran nyala biru) */
    [data-testid="stChatMessage"]:nth-child(even) {
        background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%) !important;
        border-radius: 20px 20px 0px 20px !important;
        border: 1px solid rgba(56, 189, 248, 0.3) !important;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3) !important;
        margin-bottom: 20px;
    }
    
    /* Balon Cain (Putih Bersih dengan Cahaya Putih) */
    [data-testid="stChatMessage"]:nth-child(odd) {
        background: rgba(255, 255, 255, 0.95) !important;
        color: #0f172a !important; /* Tulisan Navy gelap biar terbaca */
        border-radius: 20px 20px 20px 0px !important;
        border: 1px solid rgba(255, 255, 255, 1) !important;
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.2) !important;
        margin-bottom: 20px;
    }
    </style>
    """, unsafe_allow_html=True)

# --- 3. TAMPILAN HEADER (Pakai style HTML tadi) ---
st.markdown("""
    <div class="glass-header">
        <h1>🤖 Cain AI</h1>
        <p>Asisten Percetakan Jogja Spesialis Biru</p>
    </div>
    """, unsafe_allow_html=True)

# --- 4. LOGIKA SESSION & MEMORI ---
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Halo kak! Cain di sini. Ada yang bisa Cain bantu cetak hari ini? ✨"}
    ]

# --- 5. MENAMPILKAN RIWAYAT CHAT ---
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# --- 6. INPUT USER & KONEKSI KE FASTAPI ---
if prompt := st.chat_input("Tanya harga, bahan, atau pengiriman..."):
    # Tampilkan pesan user ke layar
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    # Nembak ke FastAPI Backend (Otak Cain)
    try:
        url = "http://127.0.0.1:8000/chat"
        payload = {
            "session_id": st.session_state.session_id,
            "message": prompt
        }
        
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            jawaban = response.json()["answer"]
            # Tampilkan balasan Cain ke layar
            st.session_state.messages.append({"role": "assistant", "content": jawaban})
            with st.chat_message("assistant"):
                st.write(jawaban)
        else:
            st.error("Waduh, koneksi ke otak Cain terputus (Error).")

    except Exception as e:
        st.error("Cain pingsan! Pastikan server FastAPI (uvicorn main:app --reload) sudah jalan di terminal satunya ya kak.")