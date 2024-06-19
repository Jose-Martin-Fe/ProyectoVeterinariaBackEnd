const { Schema, model, Types } = require("mongoose");

const misDatosSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    default: "Nombre",
  },
  apellido: {
    type: String,
    required: true,
    default: "Apellido",
  },
  mail: {
    type: String,
    required: true,
    default: "maildefault@gmail.com",
  },
  telefono: {
    type: String,
    required: true,
    default: "1234567890",
  },
});

const MisDatosModel = model("MisDatos", misDatosSchema);
module.exports = MisDatosModel;
