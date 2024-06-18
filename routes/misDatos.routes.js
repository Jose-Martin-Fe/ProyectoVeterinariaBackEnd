const express = require("express");
const {
  agregarOModificarDatosPersonales,
  obtenerDatosPersonales,
  agregarMascota,
} = require("../controllers/misDatos.controlador");
const route = express.Router();

route.get("/:idUser", obtenerDatosPersonales);
route.put("/:idUser", agregarOModificarDatosPersonales);
route.post("/mascota", agregarMascota);

module.exports = route;
