const express = require('express');
const {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  borrarTurno,
} = require('../controllers/turnos.controlador');
const router = express.Router();

router.get('/', obtenerTurnos);

router.post('/', crearTurno);

router.put('/:id', actualizarTurno)

router.delete('/:id', borrarTurno);

module.exports = router;