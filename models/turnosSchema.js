const mongoose = require("mongoose");
const { Schema } = mongoose;

const turnoSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  detalleCita: {
    type: String,
    required: true,
    default: "Pendiente",
  },
  veterinario: {
    type: String,
    required: true,
    default: "No asignado",
  },
  mascota: {
    type: String,
    required: true,
    default: "No especificado",
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hora: {
    type: String,
    required: true,
    default: "00:00",
  },
});

const Turno = mongoose.model("Turno", turnoSchema);
module.exports = Turno;
