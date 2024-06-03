const express = require("express");
const {
  getCarrito,
  agregarProducto,
  eliminarProducto,
  actualizarCantidad,
} = require("../controllers/carrito.controlador");
const auth = require("../middleware/auth");

const route = express.Router();

route.get("/", auth("user"), getCarrito); // Asegúrate de usar el middleware de autenticación
route.post("/:id", auth("user"), agregarProducto); // Asegúrate de usar el middleware de autenticación
route.delete("/:id", auth("user"), eliminarProducto);
route.put("/:id", auth("user"), actualizarCantidad);

module.exports = route;
