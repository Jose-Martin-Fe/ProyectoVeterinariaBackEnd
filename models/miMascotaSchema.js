const { Schema, model, Types } = require("mongoose");

const mascotaSchema = new Schema({
  nombreMascota: {
    type: String,
    required: true,
  },
  especie: {
    type: String,
    required: true,
  },
  raza: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Types.ObjectId,
    ref: "MisDatos",
    required: true,
  },
});

const MascotaModel = model("mascota", mascotaSchema);
module.exports = MascotaModel;
