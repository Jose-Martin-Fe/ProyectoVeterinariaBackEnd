const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },

  descripcion: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

  categoria: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    default: 1,
  },
});

const ProducModel = mongoose.model("productos", productSchema);
module.exports = ProducModel;
