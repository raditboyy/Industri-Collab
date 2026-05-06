import streamlit as st
import time

# ==============================================================================
# 0. HEADER & KONFIGURASI HALAMAN
# ==============================================================================
st.set_page_config(page_title="Cain - Cetak Lagi", page_icon="🤖")

# ==============================================================================
# 1. CEK INSTALASI SDK TERBARU (Mencegah Error Putus)
# ==============================================================================
try:
    from google import genai
    from google.genai import types
except ImportError:
    st.error("❌ Library 'google-genai' belum terpasang sempurna!")
    st.info("""
    **Cara Perbaiki:**
    1. Klik Terminal di VS Code, tekan **Ctrl + C** untuk mematikan aplikasi.
    2. Ketik perintah ini: `pip install -U --user google-genai streamlit`
    3. Setelah berhasil (tidak ada teks merah), jalankan lagi: `streamlit run app.py`
    """)
    st.stop()

# ==============================================================================
# 2. KONFIGURASI API & PERSONA
# ==============================================================================
API_KEY = "AIzaSyCk-wcQ6BriqYcGE_l4V7ss3S7upCyfMfk"
LINK_WA = "https://wa.me/6281234567890" # Ganti nomor WA di sini

katalog_perusahaan = """
KATALOG LAYANAN "CETAK LAGI":
1. Print A4 Hitam Putih - Rp 500 / lembar
2. Print A4 Warna - Rp 1.500 / lembar
3. Print A3+ Warna - Rp 5.000 / lembar
4. Jilid Biasa (Lakban) - Rp 5.000 / buku
5. Jilid Spiral Kawat - Rp 15.000 / buku
6. Jilid Hardcover - Rp 35.000 / buku
"""

instruksi_sistem = f"""
Kamu adalah "Cain", asisten virtual yang ramah dari percetakan "Cetak Lagi". 
Katalog: {katalog_perusahaan}
Aturan: Gunakan bahasa Indonesia santai, ramah, dan fokus ke percetakan.
"""

# ==============================================================================
# 3. INISIALISASI SESSION STATE & AUTO-DETECT MODEL
# ==============================================================================
if "client" not in st.session_state:
    st.session_state.client = genai.Client(api_key=API_KEY)

# 🚀 FITUR BARU: Auto-Detect Model yang Tersedia
if "model_name" not in st.session_state:
    try:
        # Ambil daftar semua model dari akun Google kamu
        available_models = [m.name for m in st.session_state.client.models.list()]
        
        # Prioritaskan flash-8b (paling aman & ringan) atau flash biasa
        if any("gemini-1.5-flash-8b" in m for m in available_models):
            st.session_state.model_name = "gemini-1.5-flash-8b"
        elif any("gemini-1.5-flash" in m for m in available_models):
            st.session_state.model_name = "gemini-1.5-flash"
        else:
            # Comot model 'flash' apa saja yang ketemu
            flash_models = [m for m in available_models if "flash" in m]
            st.session_state.model_name = flash_models[0].replace("models/", "") if flash_models else "gemini-1.5-flash-8b"
    except Exception:
        # Jika gagal deteksi, gunakan fallback ini
        st.session_state.model_name = "gemini-1.5-flash-8b"

if "messages" not in st.session_state:
    st.session_state.messages = []

if "chat_session" not in st.session_state:
    try:
        st.session_state.chat_session = st.session_state.client.chats.create(
            model=st.session_state.model_name, # Menggunakan model hasil deteksi
            config=types.GenerateContentConfig(
                system_instruction=instruksi_sistem,
                temperature=0.7,
            )
        )
    except Exception as e:
        st.error(f"Gagal memulai sesi AI: {e}")

# ==============================================================================
# 4. TAMPILAN INTERFACE
# ==============================================================================
st.title("🤖 Chat with Cain")
st.caption(f"Admin Percetakan Cetak Lagi (Powered by {st.session_state.get('model_name', 'Gemini')})")

# Tampilkan history chat
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Area Input Chat
if prompt := st.chat_input("Tanya Cain di sini..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        try:
            response = st.session_state.chat_session.send_message(prompt)
            
            # Cek jika respons kosong (biasanya karena safety filter)
            if not response.text:
                error_msg = "Maaf kak, Cain tidak bisa menjawab pesan ini karena kebijakan keamanan sistem (Safety Filter). Tanya soal cetak aja yuk! 😊"
                st.warning(error_msg)
                st.session_state.messages.append({"role": "assistant", "content": error_msg})
            else:
                st.markdown(response.text)
                st.session_state.messages.append({"role": "assistant", "content": response.text})
                
        except Exception as e:
            err_str = str(e).lower()
            
            # CEK ERROR KUOTA (429)
            if "429" in err_str or "quota" in err_str:
                msg = f"🙏 **MAAF KAK, CAIN LAGI OVERLOAD!** \n\nCain punya batas chat per hari kak. Langsung ke WhatsApp Admin aja yuk: [Klik di Sini]({LINK_WA})"
                st.warning(msg)
                st.session_state.messages.append({"role": "assistant", "content": msg})
            
            # CEK ERROR KONEKSI/LAINNYA
            else:
                st.error(f"⚠️ **Error Terdeteksi:** {e}")
                st.info("Coba klik 'Hapus Riwayat' di sidebar kiri lalu chat kembali.")

# ==============================================================================
# 5. SIDEBAR INFO
# ==============================================================================
with st.sidebar:
    st.header("Status Chatbot")
    st.success("API Connected")
    st.write(f"Model Aktif: `{st.session_state.get('model_name', 'Unknown')}`")
    st.divider()
    st.write("💡 **Tips:** Jika Cain macet, coba hapus riwayat chat di bawah.")
    if st.button("🗑️ Hapus Riwayat Chat"):
        # Reset total session state
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()