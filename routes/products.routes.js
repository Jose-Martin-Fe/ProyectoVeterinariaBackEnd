const express = require("express");
const {
  getProductos,
  getOneProducto,
  getProductosAdmin,
  updateProd,
  addImageProduct,
  deleteProd,
  createProd,
  searchProduct,
} = require("../controllers/productos.controlador");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("search", searchProduct);
router.get("/", getProductos);
router.get("/admin", getProductosAdmin);
router.get(
  "/:id",
  [check("id", "Formato ID incorrecto").isMongoId()],
  getOneProducto
);

router.post("/", auth("admin"), createProd);
router.post(
  "/addImage/:idProd",
  multer.single("image"),
  auth("admin"),
  addImageProduct
);

router.put("/:id", multer.single("image"), auth("admin"), updateProd);

router.delete("/:id", auth("admin"), deleteProd);

module.exports = router;
