const autosService = require("../services/autosService");

async function getAll(req, res) {
  const companyId = req.user && req.user.companyId;
  const autos = await autosService.getAll(companyId);
  return res.json(autos);
}

async function getByPatente(req, res) {
  const { patente } = req.params;
  const companyId = req.user && req.user.companyId;
  const auto = await autosService.getByPatente(patente, companyId);
  if (!auto) return res.status(404).json({ error: "Auto no encontrado" });
  return res.json(auto);
}

async function getById(req, res) {
  const { id } = req.params;
  const companyId = req.user && req.user.companyId;
  const auto = await autosService.getById(id, companyId);
  if (!auto) return res.status(404).json({ error: "Auto no encontrado" });
  return res.json(auto);
}

async function getByDueno(req, res) {
  const dueño = decodeURIComponent(req.params.dueno);
  const companyId = req.user && req.user.companyId;
  const encontrados = await autosService.getByDueno(dueño, companyId);
  return res.json(encontrados);
}

async function getMaintenanceNeeded(req, res) {
  const companyId = req.user && req.user.companyId;
  const list = await autosService.getMaintenanceNeeded(companyId);
  return res.json(list);
}

async function create(req, res) {
  try {
    console.log("que llega al req.body: ", req.body);
    const companyId = req.user && req.user.companyId;
    if (!companyId) return res.status(401).json({ error: "No autorizado: companyId faltante" });
    const nuevo = await autosService.createAuto(req.body, companyId);
    return res.status(201).json({ mensaje: "Auto registrado exitosamente", auto: nuevo });
  } catch (err) {
    console.log("error al crear el auto: ", err);
    
    return res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const companyId = req.user && req.user.companyId;
  const actualizado = await autosService.updateAuto(id, req.body, companyId);
  if (!actualizado) return res.status(404).json({ error: "Auto no encontrado" });
  return res.json({ mensaje: "Auto actualizado exitosamente", auto: actualizado });
}

async function updateMantenimiento(req, res) {
  const { id } = req.params;
  const { kmActuales, reparacion } = req.body;
  const companyId = req.user && req.user.companyId;
  const actualizado = await autosService.updateMantenimiento(id, { kmActuales, reparacion }, companyId);
  if (!actualizado) return res.status(404).json({ error: "Auto no encontrado" });
  return res.json({ mensaje: "Kilómetros y mantenimiento actualizados", auto: actualizado });
}

async function remove(req, res) {
  const { id } = req.params;
  const companyId = req.user && req.user.companyId;
  const ok = await autosService.deleteAuto(id, companyId);
  if (!ok) return res.status(404).json({ error: "Auto no encontrado" });
  return res.json({ mensaje: `Auto con ID ${id} eliminado correctamente` });
}

module.exports = {
  getAll,
  getByPatente,
  getById,
  getByDueno,
  getMaintenanceNeeded,
  create,
  update,
  updateMantenimiento,
  remove,
};
