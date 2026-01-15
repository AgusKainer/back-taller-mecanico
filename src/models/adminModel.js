const { sequelize, Sequelize } = require("../db");
const { DataTypes } = Sequelize;

const Admin = sequelize.models.Admin || sequelize.define(
  "Admin",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo: { type: DataTypes.STRING, unique: true, allowNull: false },
    contraseña: { type: DataTypes.STRING, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "admins", timestamps: true }
);

const companyModel = require("./companyModel");

async function createAdmin({ correo, contraseñaHash, tallerName }) {
  if (!tallerName) throw new Error("Falta el nombre de la empresa (taller)");
  // buscar o crear company
  let company = await companyModel.findByName(tallerName);
  if (!company) company = await companyModel.createCompany(tallerName);
  const admin = await Admin.create({ correo, contraseña: contraseñaHash, companyId: company.id });
  return admin.toJSON();
}

async function findByCorreo(correo) {
  const admin = await Admin.findOne({ where: { correo } });
  return admin ? admin.toJSON() : null;
}

async function findById(id) {
  const admin = await Admin.findByPk(id);
  return admin ? admin.toJSON() : null;
}

module.exports = { createAdmin, findByCorreo, findById };
