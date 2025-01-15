const mysql = require('mysql2');
const dotenv = require('dotenv');

// 加载 .env 配置
dotenv.config();

// 创建连接池以提高性能
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 导出连接池
module.exports = db;
