const express = require("express");
const router = express.Router();
const {
  obtenerComentarios,
  crearComentario,
  publicarComentario,
  obtenerComentariosPendientes,
  aprobarComentario,
  rechazarComentario,
} = require("../controllers/comentario.controlador");
const auth = require("../middleware/auth");

router.get("/", obtenerComentarios);
router.post("/", auth("user"), crearComentario);

router.get("/pendientes", auth("admin"), obtenerComentariosPendientes);
router.patch("/:id/publicar", auth("admin"), publicarComentario);
router.patch("/:id/aprobar", auth("admin"), aprobarComentario);
router.delete("/:id/rechazar", auth("admin"), rechazarComentario);

module.exports = router;
