import { useState } from "react";
import "./faq.css";

export default function Faq() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      question: "Apakah ParkInk dapat digunakan di semua area parkir?",
      answer:
        "Ya. ParkInk dapat digunakan untuk area parkir kampus, perkantoran, rumah sakit, pusat perbelanjaan, hingga area parkir umum lainnya.",
    },
    {
      question: "Bagaimana proses check-in kendaraan?",
      answer:
        "Petugas cukup memasukkan nomor polisi kendaraan, kemudian sistem akan mencatat waktu masuk secara otomatis.",
    },
    {
      question: "Apakah tarif parkir dihitung otomatis?",
      answer:
        "Ya. Tarif dihitung secara otomatis berdasarkan durasi kendaraan berada di area parkir sesuai aturan yang telah ditentukan.",
    },
    {
      question: "Apakah tersedia pembayaran non-tunai?",
      answer:
        "Ya. Sistem mendukung pembayaran tunai maupun non-tunai sesuai metode pembayaran yang tersedia.",
    },
    {
      question: "Apakah data kendaraan aman?",
      answer:
        "Semua data tersimpan dengan aman di database dan hanya dapat diakses oleh pengguna yang memiliki hak akses.",
    },
    {
      question: "Apakah tersedia laporan parkir?",
      answer:
        "Tersedia laporan harian, mingguan, hingga bulanan yang dapat diunduh oleh administrator.",
    },
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="container">

        <div className="faq-header">
          <span className="faq-badge">FAQ</span>

          <h2>Pertanyaan yang Sering Diajukan</h2>

          <p>
            Temukan jawaban dari pertanyaan yang paling sering ditanyakan
            mengenai layanan ParkInk.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              className={`faq-card ${
                active === index ? "active" : ""
              }`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setActive(active === index ? null : index)
                }
              >
                <span>{item.question}</span>

                <span className="faq-icon">
                  {active === index ? "−" : "+"}
                </span>
              </button>

              {active === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}