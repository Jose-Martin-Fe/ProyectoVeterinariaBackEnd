const FavoritoModel = require("../models/favoritosSchema");
const ProductModel = require("../models/productsSchema");

const getFavorito = async (req, res) => {
  try {
    
    const favorito = await FavoritoModel.findOne({ _id: req.idFav });
    if (!favorito) {
      return res.status(404).json({ msg: "Favorito no encontrado" });
    }
    res.status(200).json({ msg: "Favorito", favorito });
  } catch (error) {
    console.error("Error obteniendo el favorito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const agregarProductoFavs = async (req, res) => {
  try {
    
    const productExist = await ProductModel.findById(req.params.id);
    if (!productExist) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    const favsUser = await FavoritoModel.findById(req.idFav);
    if (!favsUser) {
      return res.status(404).json({ msg: "Favorito no encontrado" });
    }

    const productExistFavs = favsUser.products.some(
      (product) =>
        product && product._id && product._id.toString() === req.params.id
    );
    if (productExistFavs) {
      return res
        .status(422)
        .json({ msg: "Producto ya cargado en el favorito" });
    }

    const newProduct = {
      _id: productExist._id,
      titulo: productExist.titulo,
      precio: productExist.precio,
      descripcion: productExist.descripcion,
      image: productExist.image,
      categoria: productExist.categoria,
    };

    favsUser.products.push(newProduct);
    await favsUser.save();

    res.status(200).json({ msg: "Producto cargado con éxito", favsUser });
  } catch (error) {
    console.error("Error al agregar el producto al favorito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const FavUser = await FavoritoModel.findById(req.idFav);
    if (!FavUser) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    const productIndex = FavUser.products.findIndex(
      (product) => product._id.toString() === req.params.id
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    FavUser.products.splice(productIndex, 1);
    await FavUser.save();

    res.status(200).json({ msg: "Producto eliminado del favorito", FavUser });
  } catch (error) {
    console.error("Error al eliminar el producto del favorito:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

module.exports = { getFavorito, agregarProductoFavs, eliminarProducto };
