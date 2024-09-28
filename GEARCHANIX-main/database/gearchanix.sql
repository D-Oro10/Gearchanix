-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 18, 2024 at 08:37 AM
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
-- Database: `gearchanix`
--

-- --------------------------------------------------------

--
-- Table structure for table `client_reservation`
--

CREATE TABLE `client_reservation` (
  `reservation_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `name` varchar(100) NOT NULL,
  `vehicle_type` enum('Bus','Car','Motor','Mini Bus','Van') NOT NULL,
  `date` date NOT NULL,
  `reservation_date` date NOT NULL,
  `location` varchar(100) NOT NULL,
  `duration` int(5) NOT NULL,
  `time_departure` time(6) NOT NULL,
  `purpose` text NOT NULL,
  `no_passengers` int(5) NOT NULL,
  `office_dept` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_no` int(15) NOT NULL,
  `passenger_manifest` blob DEFAULT NULL,
  `service_type` enum('Internal Service','External Service','Others') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ems`
--

CREATE TABLE `ems` (
  `ems_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `acquisition_date` date NOT NULL,
  `ems_date` date NOT NULL,
  `workorder_ID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_request`
--

CREATE TABLE `maintenance_request` (
  `queue_num` int(5) NOT NULL,
  `reminder_ID` int(5) NOT NULL,
  `vehicle_name` varchar(100) NOT NULL,
  `driver` varchar(50) NOT NULL,
  `nature_of_repair` text NOT NULL,
  `start_date` date NOT NULL,
  `target_date` date DEFAULT NULL,
  `receiver` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `noted_by` varchar(100) NOT NULL,
  `approval_chief` enum('Approved','Rejected','Pending') NOT NULL DEFAULT 'Pending',
  `approval_office` enum('Approved','Rejected','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pdi_form`
--

CREATE TABLE `pdi_form` (
  `pdi_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `pdi_date` date NOT NULL,
  `battery` tinyint(1) NOT NULL,
  `lights` tinyint(1) NOT NULL,
  `oil_level` tinyint(1) NOT NULL,
  `water_level` tinyint(1) NOT NULL,
  `brakes` tinyint(1) NOT NULL,
  `air_pressure` tinyint(1) NOT NULL,
  `gas` tinyint(1) NOT NULL,
  `electronic` tinyint(1) NOT NULL,
  `tools` tinyint(1) NOT NULL,
  `self` tinyint(1) NOT NULL,
  `driver` varchar(50) NOT NULL,
  `mechanic` varchar(50) NOT NULL,
  `remarks` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pms`
--

CREATE TABLE `pms` (
  `pms_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `queue_num` int(5) NOT NULL,
  `acquisition_date` date NOT NULL,
  `pms_date` date NOT NULL,
  `workorder_ID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_ID` int(5) NOT NULL,
  `user_ID` int(5) NOT NULL,
  `user_role` enum('CHIEF-TMPS','DISPATCHER','ADMIN CLERK','MECHANIC','SET ROLE') NOT NULL DEFAULT 'SET ROLE',
  `role_status` enum('Approve','Reject','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Triggers `roles`
--
DELIMITER $$
CREATE TRIGGER `update_user_role` AFTER UPDATE ON `roles` FOR EACH ROW BEGIN
  UPDATE users
  SET user_role = NEW.user_role
  WHERE user_role = OLD.user_role;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `service_reminder`
--

CREATE TABLE `service_reminder` (
  `reminder_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `task_ID` int(5) NOT NULL,
  `vehicle_name` varchar(100) NOT NULL,
  `service_task` varchar(100) NOT NULL,
  `status` enum('Pending','Completed') NOT NULL,
  `next_due` date NOT NULL,
  `est_time` int(10) NOT NULL,
  `last_completed` date NOT NULL,
  `si_2000` varchar(100) DEFAULT NULL,
  `si_4000` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_tasks`
--

CREATE TABLE `service_tasks` (
  `task_ID` int(5) NOT NULL,
  `vehicleparts_ID` int(5) NOT NULL,
  `task_name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `frequency` int(10) NOT NULL,
  `MTBF` int(10) NOT NULL,
  `parts_involved` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip_ticket`
--

CREATE TABLE `trip_ticket` (
  `trip_ticketID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `trip_ticket_date` date NOT NULL,
  `gas_tank` float NOT NULL,
  `purchased_gas` float DEFAULT NULL,
  `total` float NOT NULL,
  `start_odometer` int(10) NOT NULL,
  `end_odometer` int(10) NOT NULL,
  `KM_used` int(10) NOT NULL,
  `RFID_Easy` float NOT NULL,
  `RFID_Auto` float NOT NULL,
  `oil_used` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` int(5) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `contact_num` varchar(15) DEFAULT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_role` enum('CHIEF-TMPS','DISPATCHER','ADMIN CLERK','MECHANIC','SET ROLE') NOT NULL DEFAULT 'SET ROLE',
  `username` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_idpic` blob DEFAULT NULL,
  `user_profile` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_ID` int(5) NOT NULL,
  `vehicle_name` varchar(100) NOT NULL,
  `vehicle_model` varchar(50) NOT NULL,
  `vehicle_year` int(4) NOT NULL,
  `vehicle_vin` varchar(25) DEFAULT NULL,
  `vehicle_type` enum('Bus','Car','Motor','Mini Bus','Van') NOT NULL,
  `plate_num` varchar(10) NOT NULL,
  `lifefspan` int(10) NOT NULL,
  `current_meter` int(10) NOT NULL,
  `pms_date` date DEFAULT NULL,
  `ems_date` date DEFAULT NULL,
  `vehicle_remarks` text DEFAULT NULL,
  `vehicle_status` enum('Available','Scheduled','Under Maintenance','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_parts`
--

CREATE TABLE `vehicle_parts` (
  `vehicleparts_ID` int(5) NOT NULL,
  `vehicle_ID` int(5) NOT NULL,
  `part_name` varchar(50) NOT NULL,
  `part_mtbf` int(6) NOT NULL,
  `part_ornum` varchar(5) NOT NULL,
  `part_date_procurred` date NOT NULL,
  `part_date_inspected` date NOT NULL,
  `part_date_accomplished` date NOT NULL,
  `part_remarks` varchar(100) DEFAULT NULL,
  `part_num_of_days` int(5) NOT NULL,
  `part_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_order`
--

CREATE TABLE `work_order` (
  `workorder_ID` int(5) NOT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `replaced_parts` varchar(100) NOT NULL,
  `activity` varchar(100) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client_reservation`
--
ALTER TABLE `client_reservation`
  ADD PRIMARY KEY (`reservation_ID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`);

--
-- Indexes for table `ems`
--
ALTER TABLE `ems`
  ADD PRIMARY KEY (`ems_ID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`),
  ADD KEY `workorder_ID` (`workorder_ID`);

--
-- Indexes for table `maintenance_request`
--
ALTER TABLE `maintenance_request`
  ADD PRIMARY KEY (`queue_num`),
  ADD KEY `reminder_ID` (`reminder_ID`);

--
-- Indexes for table `pdi_form`
--
ALTER TABLE `pdi_form`
  ADD PRIMARY KEY (`pdi_ID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`);

--
-- Indexes for table `pms`
--
ALTER TABLE `pms`
  ADD PRIMARY KEY (`pms_ID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`),
  ADD KEY `queue_num` (`queue_num`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_ID`),
  ADD KEY `user_ID` (`user_ID`);

--
-- Indexes for table `service_reminder`
--
ALTER TABLE `service_reminder`
  ADD PRIMARY KEY (`reminder_ID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`),
  ADD KEY `task_ID` (`task_ID`);

--
-- Indexes for table `service_tasks`
--
ALTER TABLE `service_tasks`
  ADD PRIMARY KEY (`task_ID`),
  ADD KEY `vehicleparts_ID` (`vehicleparts_ID`);

--
-- Indexes for table `trip_ticket`
--
ALTER TABLE `trip_ticket`
  ADD PRIMARY KEY (`trip_ticketID`),
  ADD KEY `vehicle_ID` (`vehicle_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `contact_num` (`contact_num`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_ID`),
  ADD UNIQUE KEY `plate_num` (`plate_num`),
  ADD UNIQUE KEY `vehicle_vin` (`vehicle_vin`);

--
-- Indexes for table `vehicle_parts`
--
ALTER TABLE `vehicle_parts`
  ADD PRIMARY KEY (`vehicleparts_ID`),
  ADD KEY `vehicle_parts_ibfk_1` (`vehicle_ID`);

--
-- Indexes for table `work_order`
--
ALTER TABLE `work_order`
  ADD PRIMARY KEY (`workorder_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client_reservation`
--
ALTER TABLE `client_reservation`
  MODIFY `reservation_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ems`
--
ALTER TABLE `ems`
  MODIFY `ems_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintenance_request`
--
ALTER TABLE `maintenance_request`
  MODIFY `queue_num` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pdi_form`
--
ALTER TABLE `pdi_form`
  MODIFY `pdi_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pms`
--
ALTER TABLE `pms`
  MODIFY `pms_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `service_reminder`
--
ALTER TABLE `service_reminder`
  MODIFY `reminder_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_tasks`
--
ALTER TABLE `service_tasks`
  MODIFY `task_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trip_ticket`
--
ALTER TABLE `trip_ticket`
  MODIFY `trip_ticketID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_parts`
--
ALTER TABLE `vehicle_parts`
  MODIFY `vehicleparts_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_order`
--
ALTER TABLE `work_order`
  MODIFY `workorder_ID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_reservation`
--
ALTER TABLE `client_reservation`
  ADD CONSTRAINT `client_reservation_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`);

--
-- Constraints for table `ems`
--
ALTER TABLE `ems`
  ADD CONSTRAINT `ems_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`),
  ADD CONSTRAINT `ems_ibfk_2` FOREIGN KEY (`workorder_ID`) REFERENCES `work_order` (`workorder_ID`);

--
-- Constraints for table `maintenance_request`
--
ALTER TABLE `maintenance_request`
  ADD CONSTRAINT `maintenance_request_ibfk_1` FOREIGN KEY (`reminder_ID`) REFERENCES `service_reminder` (`reminder_ID`);

--
-- Constraints for table `pdi_form`
--
ALTER TABLE `pdi_form`
  ADD CONSTRAINT `pdi_form_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`);

--
-- Constraints for table `pms`
--
ALTER TABLE `pms`
  ADD CONSTRAINT `pms_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`),
  ADD CONSTRAINT `pms_ibfk_2` FOREIGN KEY (`queue_num`) REFERENCES `maintenance_request` (`queue_num`);

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_reminder`
--
ALTER TABLE `service_reminder`
  ADD CONSTRAINT `service_reminder_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`),
  ADD CONSTRAINT `service_reminder_ibfk_2` FOREIGN KEY (`task_ID`) REFERENCES `service_tasks` (`task_ID`);

--
-- Constraints for table `service_tasks`
--
ALTER TABLE `service_tasks`
  ADD CONSTRAINT `service_tasks_ibfk_1` FOREIGN KEY (`vehicleparts_ID`) REFERENCES `vehicle_parts` (`vehicleparts_ID`);

--
-- Constraints for table `trip_ticket`
--
ALTER TABLE `trip_ticket`
  ADD CONSTRAINT `trip_ticket_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`);

--
-- Constraints for table `vehicle_parts`
--
ALTER TABLE `vehicle_parts`
  ADD CONSTRAINT `vehicle_parts_ibfk_1` FOREIGN KEY (`vehicle_ID`) REFERENCES `vehicles` (`vehicle_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
