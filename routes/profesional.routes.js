const express = require("express");
const router = express.Router();
const {
  crearProfesional,
  obtenerProfesionales,
  borrarProfesional,
  actualizarProfesional,
  agregarImagenProfesional,
} = require("../controllers/profesional.controlador");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

router.get("/", obtenerProfesionales);

router.post("/", auth("admin"), crearProfesional);
router.post(
  "/addImage/:idProf",
  multer.single("image"),
  auth("admin"),
  agregarImagenProfesional
);

router.put("/:id", auth("admin"), actualizarProfesional);

router.delete("/:id", auth("admin"), borrarProfesional);

module.exports = router;
