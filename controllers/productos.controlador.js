const { validationResult } = require("express-validator");
const ProducModel = require("../models/productsSchema");
const cloudinary = require("../middleware/cloudinary");

const getProductos = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const categoria = req.query.categoria;
    const termino = req.query.termino;

    let query = {};

    if (categoria && categoria !== "Todas las categorias") {
      query.categoria = categoria;
    }

    if (termino) {
      const regex = new RegExp(termino, "i");
      query.titulo = regex;
    }

    const skip = (page - 1) * limit;

    const [products, count] = await Promise.all([
      ProducModel.find(query).skip(skip).limit(Number(limit)),
      ProducModel.countDocuments(query),
    ]);

    res.status(200).json({ products, count });
  } catch (error) {
    res.status(500).json({ msg: "Error: Productos no encontrados", error });
  }
};

const getProductosAdmin = async (req, res) => {
  try {
    const products = await ProducModel.find();
    res.status(200).json({ products });
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
    res.status(500).json({ msg: "Error al buscar el producto", error });
  }
};

const createProd = async (req, res) => {
  try {
    const { titulo, precio, descripcion, categoria } = req.body;
    const newProduct = new ProducModel({
      titulo,
      precio,
      descripcion,
      categoria,
    });
    await newProduct.save();
    res.status(201).json({ msg: "Producto creado correctamente", newProduct });
  } catch (error) {
    res.status(500).json({ msg: "Error: No se creó el producto", error });
  }
};

const updateProd = async (req, res) => {
  try {
    const updateProd = {
      titulo: req.body.titulo,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
    };

    const updateProduct = await ProducModel.findByIdAndUpdate(
      { _id: req.params.id },
      updateProd,
      { new: true }
    );

    res.status(200).json({ msg: "Producto Actualizado", updateProduct });
  } catch (error) {
    res.status(500).json({ msg: "ERROR: NO se creo tu producto", error });
  }
};

const addImageProduct = async (req, res) => {
  try {
    const product = await ProducModel.findOne({ _id: req.params.idProd });
    const imagen = await cloudinary.uploader.upload(req.file.path);

    product.image = imagen.secure_url;

    product.save();
    res.status(200).json({ msg: "Imagen cargada", product });
  } catch (error) {
    res.status(500).json({ msg: "Error: No se cargo la imagen", error });
  }
};

const deleteProd = async (req, res) => {
  try {
    const productExist = await ProducModel.findOne({ _id: req.params.id });

    if (!productExist) {
      return res.status(404).json({ msg: "ID incorrecto" });
    }

    await ProducModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "Producto borrado con exito" });
  } catch (error) {
    res.status(500).json({ msg: "Error: No se creo tu producto", error });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { termino } = req.query;
    if (!termino) {
      return res
        .status(400)
        .json({ msg: "El término de búsqueda es requerido" });
    }
    const regex = new RegExp(termino, "i");
    const products = await ProducModel.find({ titulo: regex });

    res.status(200).json({
      products,
      msg: products.length
        ? "Productos encontrados"
        : "No se encontraron productos que coincidan con el término de búsqueda",
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar productos", error });
  }
};

module.exports = {
  getProductos,
  getOneProducto,
  getProductosAdmin,
  createProd,
  updateProd,
  addImageProduct,
  deleteProd,
  searchProduct,
};
