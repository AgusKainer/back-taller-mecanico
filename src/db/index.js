const { Sequelize } = require("sequelize");

// Render te da dos variables: DATABASE_URL (externa) y DATABASE_INTERNAL_URL (interna)
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_INTERNAL_URL = process.env.DATABASE_INTERNAL_URL;

// Si está en Render (production), usa la interna.
// Si estás en local, usa la externa o los valores por defecto.
const sequelize = DATABASE_INTERNAL_URL
  ? new Sequelize(DATABASE_INTERNAL_URL, { dialect: "postgres", logging: false }) // 👈 producción en Render
  : DATABASE_URL
  ? new Sequelize(DATABASE_URL, { dialect: "postgres", logging: false }) // 👈 conexión externa (local)
  : new Sequelize(
      process.env.DB_NAME || "taller-mecanico",
      process.env.DB_USER || "postgres",
      process.env.DB_PASS || "root",
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        dialect: "postgres",
        logging: false,
      }
    );

module.exports = { sequelize, Sequelize };