
// routes/turnos.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  borrarTurno,
} = require("../controllers/turnos.controlador");


router.get("/", auth("user"), obtenerTurnos); // Asegúrate de ajustar el rol según sea necesario
router.post("/", auth("user"), crearTurno);
router.put("/:idTurno", auth("user"), actualizarTurno);
router.delete("/:idTurno", auth("user"), borrarTurno);

module.exports = router;
