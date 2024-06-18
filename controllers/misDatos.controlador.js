const MisDatosModel = require("../models/miDatoSchema");

// Obtener datos personales y de mascotas
const obtenerDatosPersonales = async (req, res) => {
  const { idUser } = req.params;
  try {
    const datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      return res
        .status(404)
        .json({ message: "Datos personales no encontrados" });
    }
    res.status(200).json(datosPersonales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los datos personales", error });
  }
};

// Agregar o modificar datos personales
const agregarOModificarDatosPersonales = async (req, res) => {
  const { idUser, nombre, apellido, mail, telefono } = req.body.misDatos;
  try {
    let datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      datosPersonales = new MisDatosModel({
        idUser,
        nombre,
        apellido,
        mail,
        telefono,
      });
    } else {
      datosPersonales.nombre = nombre;
      datosPersonales.apellido = apellido;
      datosPersonales.mail = mail;
      datosPersonales.telefono = telefono;
    }
    await datosPersonales.save();
    res.status(201).json(datosPersonales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al guardar los datos personales", error });
  }
};

// Agregar mascota
const agregarMascota = async (req, res) => {
  const { idUser, mascota } = req.body;
  try {
    const datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      return res
        .status(404)
        .json({ message: "Datos personales no encontrados" });
    }
    datosPersonales.mascota.push(mascota);
    await datosPersonales.save();
    res.status(201).json(datosPersonales);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la mascota", error });
  }
};

module.exports = {
  obtenerDatosPersonales,
  agregarOModificarDatosPersonales,
  agregarMascota,
};
