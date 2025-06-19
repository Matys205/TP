require("dotenv").config();
const mysql = require("mysql2/promise");

// Opcional: advertir si falta alguna variable de entorno importante
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.warn("⚠️  Faltan variables de entorno para la conexión a la base de datos. Se usarán valores por defecto.");
}

// Configuración de conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "entradas",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Solo usa SSL si lo necesitas (por ejemplo, en producción)
  ...(process.env.DB_SSL === "true" && {
    ssl: { rejectUnauthorized: false },
  }),
});

// Probar la conexión al iniciar el servidor
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a la base de datos MySQL exitosa");
    connection.release();
  } catch (err) {
    console.error(`❌ Error al conectar a MySQL: ${err.code} - ${err.message}`);
    process.exit(1); // Detiene la app si no hay conexión
  }
})();

module.exports = pool;