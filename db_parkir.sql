-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 10:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_parkir`
--

-- --------------------------------------------------------

--
-- Table structure for table `tabeluser`
--

CREATE TABLE `tabeluser` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `role` enum('admin','petugas') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tablekendaraan`
--

CREATE TABLE `tablekendaraan` (
  `Id_kendaraan` int(11) NOT NULL,
  `plat_nomor` varchar(25) NOT NULL,
  `jenis_kendaraan` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tableparkir`
--

CREATE TABLE `tableparkir` (
  `id_parkir` int(11) NOT NULL,
  `id_kendaraan` int(11) DEFAULT NULL,
  `id_tarif` int(11) DEFAULT NULL,
  `waktu_masuk` datetime DEFAULT NULL,
  `waktu_keluar` datetime DEFAULT NULL,
  `durasi_jam` int(11) DEFAULT NULL,
  `total_biaya` decimal(10,2) DEFAULT NULL,
  `status` enum('parkir','selesai') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tablepembayaran`
--

CREATE TABLE `tablepembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `id_parkir` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `jumlah_bayar` decimal(10,2) DEFAULT NULL,
  `metode_pembayaran` enum('tunai','qris','e-wallet') DEFAULT NULL,
  `waktu_bayar` date DEFAULT NULL,
  `kembalian` decimal(10,2) DEFAULT NULL,
  `status_pembayaran` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tabletarif`
--

CREATE TABLE `tabletarif` (
  `id_tarif` int(11) NOT NULL,
  `jenis_kendaraan` enum('motor','mobil') DEFAULT NULL,
  `tarif_perjam` decimal(10,2) DEFAULT NULL,
  `tarif_maksimal` decimal(10,2) DEFAULT NULL,
  `berlaku_sejak` date DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tabeluser`
--
ALTER TABLE `tabeluser`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `tablekendaraan`
--
ALTER TABLE `tablekendaraan`
  ADD PRIMARY KEY (`Id_kendaraan`),
  ADD UNIQUE KEY `plat_nomor` (`plat_nomor`);

--
-- Indexes for table `tableparkir`
--
ALTER TABLE `tableparkir`
  ADD PRIMARY KEY (`id_parkir`),
  ADD KEY `id_kendaraan` (`id_kendaraan`),
  ADD KEY `id_tarif` (`id_tarif`);

--
-- Indexes for table `tablepembayaran`
--
ALTER TABLE `tablepembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `id_parkir` (`id_parkir`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tabletarif`
--
ALTER TABLE `tabletarif`
  ADD PRIMARY KEY (`id_tarif`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tabeluser`
--
ALTER TABLE `tabeluser`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tablekendaraan`
--
ALTER TABLE `tablekendaraan`
  MODIFY `Id_kendaraan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tableparkir`
--
ALTER TABLE `tableparkir`
  MODIFY `id_parkir` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tablepembayaran`
--
ALTER TABLE `tablepembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tabletarif`
--
ALTER TABLE `tabletarif`
  MODIFY `id_tarif` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tableparkir`
--
ALTER TABLE `tableparkir`
  ADD CONSTRAINT `tableparkir_ibfk_1` FOREIGN KEY (`id_kendaraan`) REFERENCES `tablekendaraan` (`Id_kendaraan`),
  ADD CONSTRAINT `tableparkir_ibfk_2` FOREIGN KEY (`id_tarif`) REFERENCES `tabletarif` (`id_tarif`);

--
-- Constraints for table `tablepembayaran`
--
ALTER TABLE `tablepembayaran`
  ADD CONSTRAINT `tablepembayaran_ibfk_1` FOREIGN KEY (`id_parkir`) REFERENCES `tableparkir` (`id_parkir`),
  ADD CONSTRAINT `tablepembayaran_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `tabeluser` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
