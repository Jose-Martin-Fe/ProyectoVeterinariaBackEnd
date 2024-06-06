const express = require("express");
const router = express.Router();
const {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  borrarTurno,
} = require("../controllers/turnos.controlador");

router.get("/", obtenerTurnos);
router.post("/", crearTurno);
router.put("/:idTurno", actualizarTurno); // Cambiado a :idTurno
router.delete("/:idTurno", borrarTurno); // Cambiado a :idTurno

module.exports = router;
