CREATE TABLE `category` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `CreateAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Id`, `Name`, `Description`, `Status`, `CreateAt`) VALUES
(1, 'Computer', 'Desc Computer', 1, '2024-05-27 14:54:34'),
(2, 'Phone', 'Desc Phone', 1, '2024-05-27 14:55:37'),
(3, 'Monitor', 'Desc Monitor', 0, '2024-05-27 14:56:15'),
(4, 'Tes101', 'Desc Tes101', 0, '2024-05-27 14:58:06'),
(5, 'Tes102', 'Desc Tes102', 1, '2024-05-27 14:58:06'),
(6, 'Test106', 'Desc Tes103', 0, '2024-05-27 14:58:06'),
(8, 'Mobile APP', 'Des Mobile APP', 1, '2024-06-03 15:05:31'),
(9, 'Test106', 'Des 107', 1, '2024-06-03 15:10:36'),
(12, 'Test108', 'Des 108', 1, '2024-06-03 15:29:38');
