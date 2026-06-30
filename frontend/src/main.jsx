import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inisialisasi animasi scroll
AOS.init({
  duration: 800, // Durasi animasi (ms)
  once: true,    // Animasi hanya terjadi sekali saat scroll ke bawah
  easing: 'ease-out-cubic',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)