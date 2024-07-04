const { Schema, model, Types } = require("mongoose");

const turnoSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
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
      },
      hora: {
        type: String,
        required: true,
        default: "00:00",
      },
    },
  ],
});

const Turno = model("Turnos", turnoSchema);
module.exports = Turno;
