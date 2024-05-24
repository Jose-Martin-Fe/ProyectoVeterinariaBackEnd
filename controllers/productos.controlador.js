const ProducModel = require("../models/productsSchema");

const getProductos = async (req, res) => {
  try {
    const to = req.query.to || 0;
    const limit = req.query.limit || 10;
    const categoria = req.query.categoria;

    const query = categoria ? { categoria } : {};

    const [products, count] = await Promise.all([
      ProducModel.find(query)
        .skip(to * limit)
        .limit(limit),
      ProducModel.countDocuments(query),
    ]);

    res.status(200).json({ products, count });
  } catch (error) {
    res.status(500).json({ msg: "Error: Productos no encontrados", error });
  }
};

const getOneProductos = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProductos, getOneProductos };
