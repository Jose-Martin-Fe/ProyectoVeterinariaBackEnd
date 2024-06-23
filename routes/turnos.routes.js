const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  crearTurno,
  obtenerTurnos,
  obtenerHorariosDisponibles,
  eliminarReserva,
  adminObtenerTurnos,
  adminEliminarReserva,
} = require("../controllers/turnos.controlador");

router.post("/", auth("user"), crearTurno);
router.get("/", auth("user"), obtenerTurnos);
router.get("/AdminTurnos", auth("admin"), adminObtenerTurnos);
router.post("/disponibles", auth("user"), obtenerHorariosDisponibles);
router.delete("/:id", auth("user"), eliminarReserva);
router.delete("/AdminTurnos/:id", auth("admin"), adminEliminarReserva);

module.exports = router;
