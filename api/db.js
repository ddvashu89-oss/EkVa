import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const hostString = process.env.DB_HOST || "127.0.0.1:8827";
const [host, portPart] = hostString.split(":");
const port = portPart ? parseInt(portPart, 10) : 3306;

const dbConfig = {
  host,
  port,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "paryatan2026",
  database: process.env.DB_NAME || "ekva_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4"
};

let pool = null;

// Reusable connection initialization with auto database & tables setup
export async function getPool() {
  if (pool) return pool;

  try {
    // 1. First establish connection to raw MySQL server without a database name to create it if missing
    const tempConn = await mysql.createConnection({
      host,
      port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempConn.end();

    // 2. Create the main database pool
    pool = mysql.createPool(dbConfig);

    // 3. Auto-initialize tables
    const initConn = await pool.getConnection();
    try {
      // Table for compost orders
      await initConn.query(`
        CREATE TABLE IF NOT EXISTS \`orders\` (
          \`id\` VARCHAR(50) PRIMARY KEY,
          \`product_name\` VARCHAR(255) NOT NULL,
          \`variant\` VARCHAR(255) NOT NULL,
          \`quantity\` INT NOT NULL,
          \`name\` VARCHAR(255) NOT NULL,
          \`phone\` VARCHAR(100) NOT NULL,
          \`address\` TEXT NOT NULL,
          \`date\` VARCHAR(100) NOT NULL,
          \`bed\` INT NOT NULL,
          \`status\` VARCHAR(100) NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Table for leaf diagnostics
      await initConn.query(`
        CREATE TABLE IF NOT EXISTS \`diagnoses\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`verdict\` VARCHAR(100) NOT NULL,
          \`cf\` INT NOT NULL,
          \`ex\` TEXT NOT NULL,
          \`tip\` TEXT NOT NULL,
          \`leaf_health\` INT NOT NULL,
          \`hydration_score\` INT NOT NULL,
          \`disease_risk\` INT NOT NULL,
          \`vata\` INT NOT NULL,
          \`pitta\` INT NOT NULL,
          \`kapha\` INT NOT NULL,
          \`temp\` FLOAT NOT NULL,
          \`humidity\` FLOAT NOT NULL,
          \`atmos\` VARCHAR(100) NOT NULL,
          \`photo\` LONGTEXT NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Table for contact form messages
      await initConn.query(`
        CREATE TABLE IF NOT EXISTS \`messages\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`name\` VARCHAR(255) NOT NULL,
          \`email\` VARCHAR(255) NOT NULL,
          \`message\` TEXT NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Table for plant care alarms
      await initConn.query(`
        CREATE TABLE IF NOT EXISTS \`reminders\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`plant_name\` VARCHAR(255) NOT NULL,
          \`task_type\` VARCHAR(100) NOT NULL,
          \`frequency\` VARCHAR(50) NOT NULL,
          \`reminder_time\` VARCHAR(50) NOT NULL,
          \`is_enabled\` INT DEFAULT 1,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } finally {
      initConn.release();
    }

    return pool;
  } catch (err) {
    console.error("MySQL Database Connection or Setup failed: ", err);
    throw err;
  }
}

// Global Promise-based Query Helper
export async function query(sql, params = []) {
  const activePool = await getPool();
  const [rows] = await activePool.execute(sql, params);
  return rows;
}

// Authentication Guard Helper for Administrator consoles
export function verifyAdminAuth(req, res) {
  const expectedPassword = process.env.VITE_ADMIN_PASSWORD || "ekva@admin2026";
  const authHeader = req.headers.authorization || "";
  let token = "";
  
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }
  
  if (!token && req.query && req.query.admin_token) {
    token = req.query.admin_token;
  }
  
  if (token === expectedPassword) {
    return true;
  }
  
  res.status(401).json({ 
    status: "error", 
    message: "Unauthorized access. Administrative credentials verification failed." 
  });
  return false;
}
