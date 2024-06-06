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
router.put("/:idTurno", actualizarTurno); 
router.delete("/:idTurno", borrarTurno); 

module.exports = router;
