-- =============================================================
-- SQL Database Setup Script for Ekva Web Application
-- =============================================================
-- This script initializes the MySQL database 'ekva_db' and the
-- tables required for the Unified Admin Dashboard.
-- You can import this script directly inside phpMyAdmin or run
-- it in your MySQL command shell.
-- =============================================================

-- 1. Create the Database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `ekva_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ekva_db`;

-- =============================================================
-- 2. Table Structure for Table `orders`
-- =============================================================
-- Stores compost allocations traced back to active bio-beds.
-- =============================================================
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) NOT NULL COMMENT 'Unique order identifier, e.g., EKV-123456',
    `product_name` VARCHAR(255) NOT NULL COMMENT 'Allocated vermicompost series product',
    `variant` VARCHAR(255) NOT NULL COMMENT 'Product weight pouch or bulk bag details',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Number of compost bags ordered',
    `name` VARCHAR(255) NOT NULL COMMENT 'Recipient full name',
    `phone` VARCHAR(100) NOT NULL COMMENT 'Recipient mobile contact number',
    `address` TEXT NOT NULL COMMENT 'Complete postal shipping address',
    `date` VARCHAR(100) NOT NULL COMMENT 'Purchase allocation timestamp date string',
    `bed` INT NOT NULL COMMENT 'Allocated organic vermicompost bio-bed ID number',
    `status` VARCHAR(100) NOT NULL DEFAULT '🌿 Bio-Bed Sourced' COMMENT 'Current harvest and dispatch stage',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Records insertion timestamp',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- 3. Table Structure for Table `diagnoses`
-- =============================================================
-- Logs historical plant doctor cellular scans and Ayurvedic elements.
-- =============================================================
CREATE TABLE IF NOT EXISTS `diagnoses` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `verdict` VARCHAR(100) NOT NULL COMMENT 'Identified wellness state (healthy/vata/pitta)',
    `cf` INT NOT NULL COMMENT 'Cellular scanning matching confidence percentage',
    `ex` TEXT NOT NULL COMMENT 'Synthesized diagnosis breakdown explanation',
    `tip` TEXT NOT NULL COMMENT 'Tailored Ayurvedic healing and compost remedy prescription',
    `leaf_health` INT NOT NULL COMMENT 'Chlorophyll saturation index percentage',
    `hydration_score` INT NOT NULL COMMENT 'Tissue fluid hydration percentage',
    `disease_risk` INT NOT NULL COMMENT 'Cellular oxidative stress or decay spotting index',
    `vata` INT NOT NULL COMMENT 'Vata (Air/Dryness) dosha element balance ratio',
    `pitta` INT NOT NULL COMMENT 'Pitta (Fire/Heat) dosha element balance ratio',
    `kapha` INT NOT NULL COMMENT 'Kapha (Water/Fluidity) dosha element balance ratio',
    `temp` FLOAT NOT NULL COMMENT 'Local atmospheric temperature reading at scan time',
    `humidity` FLOAT NOT NULL COMMENT 'Local atmospheric humidity percentage at scan time',
    `atmos` VARCHAR(100) NOT NULL COMMENT 'Local sky status condition reading',
    `photo` LONGTEXT NOT NULL COMMENT 'Base64-encoded botanical leaf specimen visual URI data',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Records scan log timestamp',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Database structures established. Ready for live API sync.
-- =============================================================

-- =============================================================
-- 4. Table Structure for Table `messages`
-- =============================================================
-- Stores contact submissions and garden inquiries from the website.
-- =============================================================
CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL COMMENT 'Sender full name',
    `email` VARCHAR(255) NOT NULL COMMENT 'Sender contact email address',
    `message` TEXT NOT NULL COMMENT 'Full inquiry or message content',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Inquiry submission timestamp',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- 5. Table Structure for Table `reminders`
-- =============================================================
-- Stores persistent scheduled plant care tasks and alarms.
-- =============================================================
CREATE TABLE IF NOT EXISTS `reminders` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `plant_name` VARCHAR(255) NOT NULL COMMENT 'Custom user name of the plant specimen',
    `task_type` VARCHAR(100) NOT NULL COMMENT 'Activity type: water, fertilize, mist, aerate',
    `frequency` VARCHAR(50) NOT NULL COMMENT 'Activity interval: daily, weekly, custom',
    `reminder_time` VARCHAR(50) NOT NULL COMMENT 'Trigger time in HH:MM format',
    `is_enabled` INT DEFAULT 1 COMMENT 'Active toggle state',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Reminder schedule timestamp',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


