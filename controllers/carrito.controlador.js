const CarritoModel = require("../models/carritoSchema");
const ProductModel = require("../models/productsSchema");

const getCarrito = async (req, res) => {
  try {
    console.log("ID del carrito:", req.user.idCart);
    const cart = await CarritoModel.findOne({ _id: req.user.idCart });
    if (!cart) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }
    res.status(200).json({ msg: "Carrito", cart });
  } catch (error) {
    console.error("Error obteniendo el carrito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const agregarProducto = async (req, res) => {
  try {
    console.log("ID del producto a agregar:", req.params.id);
    const productExist = await ProductModel.findById(req.params.id);
    if (!productExist) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    console.log("ID del carrito del usuario:", req.idCart);
    const cartUser = await CarritoModel.findById(req.idCart);
    if (!cartUser) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    const productExistCart = cartUser.products.some(
      (product) =>
        product && product._id && product._id.toString() === req.params.id
    );
    if (productExistCart) {
      return res.status(422).json({ msg: "Producto ya cargado en el carrito" });
    }

    cartUser.products.push({
      _id: productExist._id,
      titulo: productExist.titulo,
      // puedes agregar otras propiedades necesarias aquí
    });
    await cartUser.save();

    res.status(200).json({ msg: "Producto cargado con éxito", cartUser });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

module.exports = {
  getCarrito,
  agregarProducto,
};
