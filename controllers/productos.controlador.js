const ProducModel = require("../models/productsSchema");

const getProductos = async (req, res) => {
  try {
    const getAllProductos = await ProducModel.find();
    console.log(getAllProductos);
    res.status(200).json({ msg: "Productos encontrados", getAllProductos });
  } catch (error) {
    console.log(error);
  }
};

const getOneProductos = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProductos, getOneProductos };
