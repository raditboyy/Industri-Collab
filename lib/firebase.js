import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase baru lu (Cetakin Database)
const firebaseConfig = {
  apiKey: "AIzaSyAQRUtYJJbb1yvzzI1j54Z1aaGzXF57yyU",
  authDomain: "cetakin---database.firebaseapp.com",
  projectId: "cetakin---database",
  storageBucket: "cetakin---database.firebasestorage.app",
  messagingSenderId: "640540663107",
  appId: "1:640540663107:web:77dc6f618840ea366b63f6",
  measurementId: "G-QK9SW6XM64"
};

// Inisialisasi Firebase (Cegah error double init di Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export variabel supaya bisa dipake di file Login & Register
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };