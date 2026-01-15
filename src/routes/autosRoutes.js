const express = require("express");
const router = express.Router();
const autosController = require("../controllers/autosController");

router.get("/", autosController.getAll);
router.get("/patente/:patente", autosController.getByPatente);
router.get("/id/:id", autosController.getById);
router.get("/dueno/:dueno", autosController.getByDueno);
router.get("/mantenimiento/necesario/todos", autosController.getMaintenanceNeeded);
router.post("/", autosController.create);
router.put("/:id", autosController.update);
router.put("/:id/mantenimiento", autosController.updateMantenimiento);
router.delete("/:id", autosController.remove);

module.exports = router;
