const express = require("express");
const {
  getProductos,
  getOneProducto,
} = require("../controllers/productos.controlador");
const { check } = require("express-validator");
const router = express.Router();

router.get("/", getProductos);
router.get(
  "/:id",
  [check("id", "Formato ID incorrecto").isMongoId()],
  getOneProducto
);
router.delete("/");
router.post("/");

module.exports = router;
