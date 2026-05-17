<?php
// CORS headers for local multi-port cross-origin support
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1:8827';
$user = 'root';
$pass = 'paryatan2026';
$db = 'ekva_db';

try {
    // 1. Establish connection to MySQL server without database first to ensure it exists
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create the database if it is not present
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // 2. Connect to the actual application database
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // 3. Create tables if they do not exist
    
    // Table for allocated compost orders
    $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
        `id` VARCHAR(50) PRIMARY KEY,
        `product_name` VARCHAR(255) NOT NULL,
        `variant` VARCHAR(255) NOT NULL,
        `quantity` INT NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(100) NOT NULL,
        `address` TEXT NOT NULL,
        `date` VARCHAR(100) NOT NULL,
        `bed` INT NOT NULL,
        `status` VARCHAR(100) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Table for plant leaf scans / diagnoses
    // Stored leaf photo as LONGTEXT to fit base64 data URIs perfectly
    $pdo->exec("CREATE TABLE IF NOT EXISTS `diagnoses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `verdict` VARCHAR(100) NOT NULL,
        `cf` INT NOT NULL,
        `ex` TEXT NOT NULL,
        `tip` TEXT NOT NULL,
        `leaf_health` INT NOT NULL,
        `hydration_score` INT NOT NULL,
        `disease_risk` INT NOT NULL,
        `vata` INT NOT NULL,
        `pitta` INT NOT NULL,
        `kapha` INT NOT NULL,
        `temp` FLOAT NOT NULL,
        `humidity` FLOAT NOT NULL,
        `atmos` VARCHAR(100) NOT NULL,
        `photo` LONGTEXT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Table for contact form / inquiry messages
    $pdo->exec("CREATE TABLE IF NOT EXISTS `messages` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `message` TEXT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Table for plant care automatic reminders
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reminders` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `plant_name` VARCHAR(255) NOT NULL,
        `task_type` VARCHAR(100) NOT NULL,
        `frequency` VARCHAR(50) NOT NULL,
        `reminder_time` VARCHAR(50) NOT NULL,
        `is_enabled` INT DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

} catch (PDOException $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection or initialization failed: " . $e->getMessage()
    ]);
    exit;
}
