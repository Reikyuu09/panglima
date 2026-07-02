import './pricing.css';
import { FaMotorcycle, FaCarSide, FaTruck } from "react-icons/fa";

export default function Pricing() {
  const tarif = [
    {
      icon: <FaMotorcycle />,
      title: "Roda 2",
      first: "Rp 3.000",
      max: "Rp 20.000",
    },
    {
      icon: <FaCarSide />,
      title: "Roda 4",
      first: "Rp 5.000",
      max: "Rp 35.000",
    },
    {
      icon:<FaTruck />,
      title: "Kendaraan Besar",
      first: "Rp 10.000",
      max: "Rp 50.000",
    },
  ];

  return (
    <section id="harga" className="pricing-section">
      <div className="pricing-container">

        <div className="pricing-header">
          <span className="pricing-badge">Tarif Parkir</span>

          <h2>Tarif Kendaraan</h2>

          <p>
            Tarif parkir dihitung berdasarkan lama kendaraan berada
            di area parkir.
          </p>
        </div>

        <div className="tarif-grid">
          {tarif.map((item, index) => (
            <div className="tarif-card" key={index}>

              <div className="tarif-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <div className="tarif-item">
                <span>Jam Pertama</span>
                <strong>{item.first}</strong>
              </div>

              <div className="tarif-item">
                <span>Maksimal / Hari</span>
                <strong>{item.max}</strong>
              </div>

            </div>
          ))}
        </div>

        <div className="pricing-note">
          <strong>Catatan</strong>

          <p>
            Tarif di atas merupakan simulasi tarif parkir.
            Pembayaran dapat dilakukan secara tunai maupun non-tunai.
          </p>
        </div>

      </div>
    </section>
  );
}