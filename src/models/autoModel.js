const { sequelize, Sequelize } = require("../db");
const { DataTypes, Op } = Sequelize;

const Auto =
  sequelize.models.Auto ||
  sequelize.define(
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
      estado: {
        type: DataTypes.ENUM("activo", "inactivo", "reparacion"),
        defaultValue: "activo",
      },
    },
    { tableName: "autos", timestamps: true },
  );

async function createAuto({
  patente,
  dueño,
  correo,
  marca,
  modelo,
  año,
  kmActuales,
  proximoMantenimiento,
  companyId,
}) {
  const normalizedPatente = String(patente || "")
    .trim()
    .toUpperCase();
  console.log(
    "que llega para crear: ",
    normalizedPatente,
    dueño,
    marca,
    modelo,
    año,
    kmActuales,
    proximoMantenimiento,
  );
  if (!companyId) throw new Error("companyId requerido");
  const auto = await Auto.create({
    patente: normalizedPatente,
    dueño,
    correo,
    marca,
    modelo,
    año,
    kmActuales,
    proximoMantenimiento,
    companyId,
  });
  return auto.toJSON();
}

async function findAll(companyId, options = {}) {
  const where = companyId ? { companyId } : {};
  const hasPagination =
    Number.isFinite(Number(options.page)) ||
    Number.isFinite(Number(options.limit));

  if (!hasPagination) {
    const list = await Auto.findAll({ where, order: [["createdAt", "DESC"]] });
    return list.map((a) => a.toJSON());
  }

  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const offset = (page - 1) * limit;
  const { count, rows } = await Auto.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const totalPages = Math.max(1, Math.ceil(count / limit));

  return {
    items: rows.map((a) => a.toJSON()),
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };
}

async function findByPatente(patente, companyId) {
  const normalizedPatente = String(patente || "")
    .trim()
    .toUpperCase();
  const where = companyId
    ? { patente: { [Op.iLike]: normalizedPatente }, companyId }
    : { patente: { [Op.iLike]: normalizedPatente } };
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
  return list
    .map((a) => a.toJSON())
    .filter(
      (a) =>
        typeof a.kmActuales === "number" &&
        typeof a.proximoMantenimiento === "number" &&
        a.kmActuales >= a.proximoMantenimiento,
    );
}

async function updateById(id, cambios, companyId) {
  const where = { id: Number(id) };
  if (companyId) where.companyId = companyId;
  const auto = await Auto.findOne({ where });
  if (!auto) return null;
  if (cambios.patente) {
    cambios.patente = String(cambios.patente).trim().toUpperCase();
  }
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
    const kmTag = Number.isFinite(kmActuales) ? ` (${kmActuales} km)` : "";
    const nuevaEntrada = `[${timestamp}]${kmTag} ${reparacion}`;
    cambios.descripcionUltimaReparacion = auto.descripcionUltimaReparacion
      ? `${auto.descripcionUltimaReparacion}\n\n${nuevaEntrada}`
      : nuevaEntrada;
  }
  cambios.fechaUltimaReparacion = new Date();

  let updatedAuto = await auto.update(cambios);
  const currentKm = Number.isFinite(updatedAuto.kmActuales)
    ? updatedAuto.kmActuales
    : null;
  const currentNext = updatedAuto.proximoMantenimiento;

  if (currentKm !== null && (!currentNext || currentKm >= currentNext)) {
    updatedAuto = await updatedAuto.update({
      proximoMantenimiento: currentKm + 5000,
    });
  }

  return updatedAuto.toJSON();
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
