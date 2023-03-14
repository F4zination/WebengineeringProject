-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 14. Mrz 2023 um 19:12
-- Server-Version: 10.10.2-MariaDB
-- PHP-Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `webengineering`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `accounts`
--

CREATE TABLE `accounts` (
  `Id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `accounts`
--

INSERT INTO `accounts` (`Id`, `username`, `password`, `email`) VALUES
(1, 'test', 'test', 'tetet@asgegd'),
(2, 'Hans', 'Hans', 'Hans@Hans'),
(3, 'Peter', 'Peter', 'aggd@asdfas'),
(4, 'Hallo', 'Hallo', 'agh@ahgah');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bienenstoecke`
--

CREATE TABLE `bienenstoecke` (
  `StockId` int(255) NOT NULL,
  `Namen` varchar(255) NOT NULL,
  `Koenigin` varchar(255) NOT NULL,
  `Volkssaerke` int(255) NOT NULL,
  `Futter` int(255) NOT NULL COMMENT 'wie viel Futter noch da ist',
  `HonigEntnommen` int(255) NOT NULL,
  `Wabensitz` int(11) NOT NULL COMMENT 'Anzahl Bienen auf Waben',
  `FKaccountID` int(11) NOT NULL,
  `ErstellDatum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `bienenstoecke`
--

INSERT INTO `bienenstoecke` (`StockId`, `Namen`, `Koenigin`, `Volkssaerke`, `Futter`, `HonigEntnommen`, `Wabensitz`, `FKaccountID`, `ErstellDatum`) VALUES
(42, 'Hallo', 'asgdasg', 44, 4554, 4545, 45, 1, '2023-03-14');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`Id`);

--
-- Indizes für die Tabelle `bienenstoecke`
--
ALTER TABLE `bienenstoecke`
  ADD PRIMARY KEY (`StockId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `accounts`
--
ALTER TABLE `accounts`
  MODIFY `Id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `bienenstoecke`
--
ALTER TABLE `bienenstoecke`
  MODIFY `StockId` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
