const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  publicado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);