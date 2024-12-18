const mysql = require('mysql2/promise');
require('dotenv').config({ path: './main.env' });

const config = {
  host: process.env.MYSQL_SERVICE_HOST || process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.MYSQL_SERVICE_PORT || process.env.DB_PORT,
};
const db = mysql.createPool(config);

// Kiểm tra kết nối
(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    console.log(`Kết nối đến MySQL thành công: ${connection.config.database}`);
    connection.release();
  } catch (error) {
    console.error(`Kết nối đến MySQL thất bại: ${error.message}`);
  }
})();

module.exports = db;
