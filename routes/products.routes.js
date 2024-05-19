const express = require("express");
const { getProductos } = require("../controllers/productos.controlador");
const router = express.Router();

router.get("/", getProductos);
router.get("/");
router.delete("/");
router.post("/");

module.exports = router;
