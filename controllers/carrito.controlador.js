const CarritoModel = require("../models/carritoSchema");
const ProductModel = require("../models/productsSchema");

const getCarrito = async (req, res) => {
  try {
    const cart = await CarritoModel.findOne({ _id: req.idCart });
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


   
    const { cantidad } = req.body;



    const newProduct = {
      _id: productExist._id,
      titulo: productExist.titulo,
      precio: productExist.precio,
      descripcion: productExist.descripcion,
      image: productExist.image,
      categoria: productExist.categoria,
      cantidad: cantidad, 
    };


    cartUser.products.push(newProduct);
    await cartUser.save();

    res.status(200).json({ msg: "Producto cargado con éxito", cartUser });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const actualizarCantidad = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const cartUser = await CarritoModel.findById(req.idCart);
    if (!cartUser) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    const productIndex = cartUser.products.findIndex(
      (product) => product._id.toString() === req.params.id
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    cartUser.products[productIndex].cantidad = cantidad;
    await cartUser.save();

    res
      .status(200)
      .json({ msg: "Cantidad actualizada exitosamente", cartUser });
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const cartUser = await CarritoModel.findById(req.idCart);
    if (!cartUser) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    const productIndex = cartUser.products.findIndex(
      (product) => product._id.toString() === req.params.id
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    cartUser.products.splice(productIndex, 1);
    await cartUser.save();

    res.status(200).json({ msg: "Producto eliminado del carrito", cartUser });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

module.exports = {
  getCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
};
