const express = require("express");
const router = express.Router();
const {
  crearProfesional,
  obtenerProfesionales,
} = require("../controllers/profesional.controlador");

router.post("/profesional", crearProfesional);
router.get("/profesionales", obtenerProfesionales);

module.exports = router;
