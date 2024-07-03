const { Schema, model, Types } = require("mongoose");

const misDatosSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
    required: true,
  },
  datosPersonales: {
    nombre: {
      type: String,
    },
    apellido: {
      type: String,
    },
    mail: {
      type: String,
    },
    telefono: {
      type: String,
    },
  },
});

const MisDatosModel = model("MisDatos", misDatosSchema);
module.exports = MisDatosModel;
