const ProfesionalModel = require("../models/profesionalSchema");

// Crear un nuevo profesional
const crearProfesional = async (req, res) => {
  const { nombre, especialidad, foto, descripcion, horario } = req.body;

  if (!nombre || !especialidad || !descripcion || !foto || !horario) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const nuevoProfesional = new ProfesionalModel({
      nombre,
      especialidad,
      foto,
      descripcion,
      horario,
    });
    const profesionalGuardado = await nuevoProfesional.save();
    res.status(201).json({
      msg: "Profesional registrado correctamente",
      profesionalGuardado,
    });
  } catch (err) {
    console.error("Error al crear el profesional:", err);
    res.status(500).json({ message: "Error al crear el profesional" });
  }
};

// Obtener todos los profesionales
const obtenerProfesionales = async (req, res) => {
  try {
    const profesionales = await ProfesionalModel.find();
    res.status(200).json(profesionales);
  } catch (err) {
    console.error("Error al obtener los profesionales:", err);
    res.status(500).json({ message: "Error al obtener los profesionales" });
  }
};

module.exports = {
  crearProfesional,
  obtenerProfesionales,
};
