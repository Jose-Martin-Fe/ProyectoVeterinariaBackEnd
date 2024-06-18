const { Schema, model, Types } = require("mongoose");

const misDatosMascota = new Schema({
  nombreMascota: {
    type: String,
  },
  especie: {
    type: String,
  },
  raza: {
    type: String,
  },
});

const misDatosSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
  },
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

  mascota: [misDatosMascota],
});

const MisDatosModel = model("MisDatos", misDatosSchema);
module.exports = MisDatosModel;
