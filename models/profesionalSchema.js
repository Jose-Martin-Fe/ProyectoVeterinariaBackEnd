const { Schema, model } = require("mongoose");

const horarioSchema = new Schema({
  dia: {
    type: String,
    enum: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    required: true,
  },
  inicio: {
    type: String,
    required: true,
  },
  fin: {
    type: String,
    required: true,
  },
});

const profesionalSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  especialidad: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  descripcion: {
    type: String,
    required: true,
  },
  comentarios: [{ type: String }],
  horario: [horarioSchema],
});

const ProfesionalModel = model("profesionales", profesionalSchema);

module.exports = ProfesionalModel;
