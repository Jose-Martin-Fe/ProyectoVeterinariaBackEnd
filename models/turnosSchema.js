
const { Schema, model, Types } = require("mongoose");

const turnoSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
    required: true,
  },
  reservas: [
    {
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
    },
  ],
});

module.exports = Turno;
