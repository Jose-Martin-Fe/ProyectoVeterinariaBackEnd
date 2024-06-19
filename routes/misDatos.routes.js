const express = require("express");
const {
  agregarOModificarDatosPersonales,
  obtenerDatosPersonales,
  agregarOModificarMascota,
  eliminarMascota,
} = require("../controllers/misDatos.controlador");
const route = express.Router();

route.get("/:idUser", obtenerDatosPersonales);
route.put("/:idUser", agregarOModificarDatosPersonales);
route.post("/mascota", agregarOModificarMascota);
route.delete("/mascota/:id", eliminarMascota);

module.exports = route;
