const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  crearTurno,
  obtenerTurnos,
  obtenerHorariosDisponibles,
} = require("../controllers/turnos.controlador");

router.post("/", auth("user"), crearTurno);
router.get("/", auth("user"), obtenerTurnos);
router.post("/disponibles", auth("user"), obtenerHorariosDisponibles);

module.exports = router;
