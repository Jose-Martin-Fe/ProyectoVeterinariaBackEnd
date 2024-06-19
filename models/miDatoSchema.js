const { Schema, model, Types } = require("mongoose");

const misDatosSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
});

const MisDatosModel = model("MisDatos", misDatosSchema);
module.exports = MisDatosModel;
