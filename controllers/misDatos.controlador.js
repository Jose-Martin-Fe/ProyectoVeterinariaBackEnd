const MisDatosModel = require("../models/miDatoSchema");
const MascotaModel = require("../models/miMascotaSchema");

const obtenerDatosPersonales = async (req, res) => {
  const { idUser } = req.params;
  try {
    const datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      return res
        .status(404)
        .json({ message: "Datos personales no encontrados" });
    }

    const mascotas = await MascotaModel.find({ ownerId: datosPersonales._id });
    res.status(200).json({ ...datosPersonales.toObject(), mascotas });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los datos personales", error });
  }
};

const agregarOModificarDatosPersonales = async (req, res) => {
  if (!req.body.misDatos) {
    return res.status(400).json({
      message:
        "Datos personales no proporcionados en el cuerpo de la solicitud",
    });
  }
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

const agregarOModificarMascota = async (req, res) => {
  const { idUser, mascota } = req.body;
  try {
    const datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      return res
        .status(404)
        .json({ message: "Datos personales no encontrados" });
    }

    if (mascota._id) {
      let mascotaExistente = await MascotaModel.findById(mascota._id);
      if (mascotaExistente) {
        Object.assign(mascotaExistente, mascota);
        await mascotaExistente.save();
        return res.status(200).json(mascotaExistente);
      }
    }

    const nuevaMascota = new MascotaModel({
      ...mascota,
      ownerId: datosPersonales._id,
    });
    await nuevaMascota.save();
    return res.status(201).json(nuevaMascota);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar o modificar la mascota", error });
  }
};

const eliminarMascota = async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await MascotaModel.findById(id);
    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    await MascotaModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la mascota", error });
  }
};

const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await MisDatosModel.find();
    const usuariosConMascotas = await Promise.all(
      usuarios.map(async (usuario) => {
        const mascotas = await MascotaModel.find({ ownerId: usuario._id });
        return { ...usuario.toObject(), mascotas };
      })
    );
    res.status(200).json(usuariosConMascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

const modificarDatosPersonalesYMascota = async (req, res) => {
  const { misDatos, mascota } = req.body;

  try {
    // Modificar datos personales
    let datosPersonales = await MisDatosModel.findOne({ idUser });
    if (!datosPersonales) {
      datosPersonales = new MisDatosModel({
        idUser,
        nombre: misDatos.nombre,
        apellido: misDatos.apellido,
        mail: misDatos.mail,
        telefono: misDatos.telefono,
      });
    } else {
      datosPersonales.nombre = misDatos.nombre;
      datosPersonales.apellido = misDatos.apellido;
      datosPersonales.mail = misDatos.mail;
      datosPersonales.telefono = misDatos.telefono;
    }
    await datosPersonales.save();

    // Modificar mascota
    if (mascota._id) {
      let mascotaExistente = await MascotaModel.findById(mascota._id);
      if (mascotaExistente) {
        Object.assign(mascotaExistente, mascota);
        await mascotaExistente.save();
        return res.status(200).json({
          datosPersonales,
          mascota: mascotaExistente,
        });
      }
    }

    const nuevaMascota = new MascotaModel({
      ...mascota,
      ownerId: datosPersonales._id,
    });
    await nuevaMascota.save();

    res.status(201).json({
      datosPersonales,
      mascota: nuevaMascota,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al modificar datos", error });
    console.log(error);
  }
};

module.exports = {
  obtenerDatosPersonales,
  agregarOModificarDatosPersonales,
  agregarOModificarMascota,
  eliminarMascota,
  obtenerTodosLosUsuarios,
  modificarDatosPersonalesYMascota,
};
