const express = require("express");
const {
  agregarOModificarDatosPersonales,
  obtenerDatosPersonales,
  agregarOModificarMascota,
  eliminarMascota,
  obtenerTodosLosUsuarios,
  modificarDatosPersonalesYMascota,
} = require("../controllers/misDatos.controlador");
const auth = require("../middleware/auth");
const route = express.Router();

route.get("/:idUser", obtenerDatosPersonales);
route.put("/:idUser/modificar", modificarDatosPersonalesYMascota);
route.put("/:idUser", agregarOModificarDatosPersonales);
route.post("/mascota", agregarOModificarMascota);
route.delete("/mascota/:id", eliminarMascota);
route.get("/", auth("admin"), obtenerTodosLosUsuarios);

module.exports = route;
