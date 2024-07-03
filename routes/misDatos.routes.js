const express = require("express");
const {
  agregarOModificarDatosPersonales,
  obtenerDatosPersonales,
  agregarOModificarMascota,
  eliminarMascota,
  obtenerTodosLosUsuariosAdmin,
  modificarDatosPersonalesYMascotaAdmin,
} = require("../controllers/misDatos.controlador");
const auth = require("../middleware/auth");
const route = express.Router();

route.put(
  "/:idUser/modificar",
  auth("admin"),
  modificarDatosPersonalesYMascotaAdmin
);
route.get("/:idUser", auth("user"), obtenerDatosPersonales);
route.put("/:idUser", auth("user"), agregarOModificarDatosPersonales);
route.post("/mascota", auth("user"), agregarOModificarMascota);
route.delete("/mascota/:id", auth("user"), eliminarMascota);
route.get("/", auth("admin"), obtenerTodosLosUsuariosAdmin);

module.exports = route;
