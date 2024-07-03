const ProfesionalModel = require("../models/profesionalSchema");
const cloudinary = require("../middleware/cloudinary");

const crearProfesional = async (req, res) => {
  const { nombre, especialidad, descripcion, horario } = req.body;

  if (!nombre || !especialidad || !descripcion || !horario) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const nuevoProfesional = new ProfesionalModel({
      nombre,
      especialidad,
      descripcion,
      horario,
    });
    const profesionalGuardado = await nuevoProfesional.save();
    res.status(201).json({
      msg: "Profesional creado correctamente",
      profesionalGuardado,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el profesional" });
  }
};


const obtenerProfesionales = async (req, res) => {
  try {
    const profesionales = await ProfesionalModel.find();
    res.status(200).json(profesionales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los profesionales" });
  }
};

const actualizarProfesional = async (req, res) => {
  try {
    const actualizarProfesional = {
      nombre: req.body.nombre,
      especialidad: req.body.especialidad,
      descripcion: req.body.descripcion,
      horario: req.body.horario,
    };

    const actualizarProf = await ProfesionalModel.findByIdAndUpdate(
      { _id: req.params.id },
      actualizarProfesional,
      { new: true }
    );

    res.status(200).json({ msg: "Profesional Actualizado", actualizarProf });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "ERROR: NO se actualizo el profesional", error });
  }
};

const agregarImagenProfesional = async (req, res) => {
  try {
    const profesional = await ProfesionalModel.findOne({
      _id: req.params.idProf,
    });
    const imagen = await cloudinary.uploader.upload(req.file.path);

    profesional.image = imagen.secure_url;

    profesional.save();
    res.status(200).json({ msg: "Imagen cargada", profesional });
  } catch (error) {
    res.status(500).json({ msg: "Error: No se cargo la imagen", error });
  }
};

const borrarProfesional = async (req, res) => {
  try {
    const profesionalExiste = await ProfesionalModel.findOne({
      _id: req.params.id,
    });

    if (!profesionalExiste) {
      return res.status(404).json({ msg: "ID incorrecto" });
    }

    await ProfesionalModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "Profesional borrado con exito" });
  } catch (error) {
    res.status(500).json({ msg: "Error: No se creo el profesional", error });
  }
};

module.exports = {
  crearProfesional,
  obtenerProfesionales,
  actualizarProfesional,
  agregarImagenProfesional,
  borrarProfesional,
};
