const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  detalleCita: { type: String, required: true },
  veterinario: { type: String, required: true },
  mascota: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true }
});

const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno;