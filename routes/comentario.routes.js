const express = require('express');
const router = express.Router();
const {
  obtenerComentarios,
  crearComentario,
  publicarComentario,
  obtenerComentariosPendientes,
  aprobarComentario,
  rechazarComentario
} = require('../controllers/comentario.controlador');

router.get('/', obtenerComentarios);
router.post('/', crearComentario);
router.patch('/:id/publicar', publicarComentario);
router.get('/pendientes', obtenerComentariosPendientes);
router.patch('/:id/aprobar', aprobarComentario);
router.delete('/:id/rechazar', rechazarComentario);

module.exports = router;
