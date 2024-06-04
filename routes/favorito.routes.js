const express = require("express");
const {
  getFavorito,
  agregarProductoFavs,
  eliminarProducto,
} = require("../controllers/favorito.controlador");
const auth = require("../middleware/auth");

const route = express.Router();

route.get("/", auth("user"), getFavorito);
route.post("/:id", auth("user"), agregarProductoFavs);
route.delete("/:id", auth("user"), eliminarProducto);

module.exports = route;
