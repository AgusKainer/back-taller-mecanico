const { Sequelize } = require("sequelize");

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, { dialect: "postgres", logging: false })
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
