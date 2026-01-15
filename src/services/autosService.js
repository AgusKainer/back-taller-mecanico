const autoModel = require("../models/autoModel");

async function getAll(companyId) {
  return await autoModel.findAll(companyId);
}

async function getByPatente(patente, companyId) {
  return await autoModel.findByPatente(patente, companyId);
}

async function getById(id, companyId) {
  return await autoModel.findById(id, companyId);
}

async function getByDueno(dueno, companyId) {
  return await autoModel.findByDueno(dueno, companyId);
}

async function getMaintenanceNeeded(companyId) {
  return await autoModel.findMaintenanceNeeded(companyId);
}

async function createAuto(data, companyId) {
  console.log("que llega al servides: ", data);
  return await autoModel.createAuto({ ...data, companyId });
}

async function updateAuto(id, cambios, companyId) {
  return await autoModel.updateById(id, cambios, companyId);
}

async function updateMantenimiento(id, datos, companyId) {
  return await autoModel.updateMaintenance(id, datos, companyId);
}

async function deleteAuto(id, companyId) {
  return await autoModel.deleteById(id, companyId);
}

module.exports = {
  getAll,
  getByPatente,
  getById,
  getByDueno,
  getMaintenanceNeeded,
  createAuto,
  updateAuto,
  updateMantenimiento,
  deleteAuto,
};
