const { sequelize, Sequelize } = require("../db");
const { DataTypes } = Sequelize;

const Auto = sequelize.models.Auto || sequelize.define(
  "Auto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patente: { type: DataTypes.STRING, unique: true, allowNull: false },
    dueño: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    modelo: { type: DataTypes.STRING },
    año: { type: DataTypes.INTEGER },
    kmActuales: { type: DataTypes.INTEGER, defaultValue: 0 },
    proximoMantenimiento: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    descripcionUltimaReparacion: { type: DataTypes.TEXT },
    fechaUltimaReparacion: { type: DataTypes.DATE },
    estado: { type: DataTypes.ENUM("activo", "inactivo", "reparacion"), defaultValue: "activo" },
  },
  { tableName: "autos", timestamps: true }
);

async function createAuto({ patente, dueño, correo, marca, modelo, año, kmActuales, proximoMantenimiento, companyId }) {
  console.log("que llega para crear: ", patente, dueño, marca, modelo, año, kmActuales, proximoMantenimiento);
  if (!companyId) throw new Error("companyId requerido");
  const auto = await Auto.create({ patente, dueño, correo, marca, modelo, año, kmActuales, proximoMantenimiento, companyId });
  return auto.toJSON();
}

async function findAll(companyId) {
  const where = companyId ? { companyId } : {};
  const list = await Auto.findAll({ where });
  return list.map((a) => a.toJSON()); 
} 

async function findByPatente(patente, companyId) {
  const where = companyId ? { patente, companyId } : { patente };
  const a = await Auto.findOne({ where });
  return a ? a.toJSON() : null;
}

async function findById(id, companyId) {
  const where = { id: Number(id) };
  if (companyId) where.companyId = companyId;
  const a = await Auto.findOne({ where });
  return a ? a.toJSON() : null;
}

async function findByDueno(dueno, companyId) {
  const where = companyId ? { dueño: dueno, companyId } : { dueño: dueno };
  const list = await Auto.findAll({ where });
  return list.map((a) => a.toJSON());
}

async function findMaintenanceNeeded(companyId) {
  const where = companyId ? { companyId } : {};
  const list = await Auto.findAll({ where });
  return list.map((a) => a.toJSON()).filter((a) => typeof a.kmActuales === "number" && typeof a.proximoMantenimiento === "number" && a.kmActuales >= a.proximoMantenimiento);
}

async function updateById(id, cambios, companyId) {
  const where = { id: Number(id) };
  if (companyId) where.companyId = companyId;
  const auto = await Auto.findOne({ where });
  if (!auto) return null;
  await auto.update(cambios);
  return auto.toJSON();
}

async function updateMaintenance(id, { kmActuales, reparacion }, companyId) {
  const where = { id: Number(id) };
  if (companyId) where.companyId = companyId;
  const auto = await Auto.findOne({ where });
  if (!auto) return null;
  const cambios = {};
  if (kmActuales !== undefined) cambios.kmActuales = kmActuales;
  if (reparacion !== undefined) {
    const timestamp = new Date().toISOString();
    const nuevaEntrada = `[${timestamp}] ${reparacion}`;
    cambios.descripcionUltimaReparacion = auto.descripcionUltimaReparacion
      ? `${auto.descripcionUltimaReparacion}\n\n${nuevaEntrada}`
      : nuevaEntrada;
  }
  cambios.fechaUltimaReparacion = new Date();
  await auto.update(cambios);
  if (auto.kmActuales && !auto.proximoMantenimiento) {
    await auto.update({ proximoMantenimiento: auto.kmActuales + 5000 });
  }
  if (auto.kmActuales && auto.proximoMantenimiento && auto.kmActuales >= auto.proximoMantenimiento) {
    await auto.update({ proximoMantenimiento: auto.kmActuales + 5000 });
  }
  return auto.toJSON();
}

async function deleteById(id, companyId) {
  const where = { id: Number(id) };
  if (companyId) where.companyId = companyId;
  const auto = await Auto.findOne({ where });
  if (!auto) return false;
  await auto.destroy();
  return true;
}

module.exports = {
  createAuto,
  findAll,
  findByPatente,
  findById,
  findByDueno,
  findMaintenanceNeeded,
  updateById,
  updateMaintenance,
  deleteById,
};
