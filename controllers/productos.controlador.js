const { validationResult } = require("express-validator");
const ProducModel = require("../models/productsSchema");

const getProductos = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const categoria = req.query.categoria;

    const query = categoria ? { categoria } : {};

    const skip = (page - 1) * limit;

    const [products, count] = await Promise.all([
      ProducModel.find(query).skip(skip).limit(limit),
      ProducModel.countDocuments(query),
    ]);

    res.status(200).json({ products, count });
  } catch (error) {
    res.status(500).json({ msg: "Error: Productos no encontrados", error });
  }
};

const getOneProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ msg: errors.array() });
    }

    const product = await ProducModel.findById(req.params.id);

    if (!product) {
      return res
        .status(400)
        .json({ msg: "El producto no existe en la base de datos" });
    }
    res.status(200).json({ msg: "Producto encontrado", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al buscar el producto", error });
  }
};

module.exports = { getProductos, getOneProducto };
