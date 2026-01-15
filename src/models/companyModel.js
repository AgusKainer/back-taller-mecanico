const { sequelize, Sequelize } = require("../db");
const { DataTypes } = Sequelize;

const Company = sequelize.models.Company || sequelize.define(
  "Company",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { tableName: "companies", timestamps: true }
);

async function findByName(nombre) {
  const c = await Company.findOne({ where: { nombre } });
  return c ? c.toJSON() : null;
}

async function createCompany(nombre) {
  const c = await Company.create({ nombre });
  return c.toJSON();
}

module.exports = { Company, findByName, createCompany };
