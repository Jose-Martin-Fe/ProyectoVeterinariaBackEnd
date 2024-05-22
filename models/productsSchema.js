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
    required: true,
  },

  categoria: {
    type: String,
    required: true,
  },
});

const ProducModel = mongoose.model("productos", productSchema);
module.exports = ProducModel;
