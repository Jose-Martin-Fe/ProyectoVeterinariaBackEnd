const { Schema, model, Types } = require("mongoose");

const mascotaSchema = new Schema({
  nombreMascota: {
    type: String,
    required: true,
    default: "Nombre",
  },
  especie: {
    type: String,
    required: true,
    default: "Especie",
  },
  raza: {
    type: String,
    required: true,
    default: "Raza",
  },
  ownerId: {
    type: Types.ObjectId,
    ref: "MisDatos",
    required: true,
  },
});

const MascotaModel = model("mascota", mascotaSchema);
module.exports = MascotaModel;
