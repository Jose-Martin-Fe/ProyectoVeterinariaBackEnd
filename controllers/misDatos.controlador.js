const MisDatosModel = require("../models/miDatoSchema");
const MascotaModel = require("../models/miMascotaSchema");
const userModel = require("../models/userSchema");

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
  const { idUser } = req.params;
  const { datosPersonales } = req.body;

  try {
    const misDatos = await MisDatosModel.findOneAndUpdate(
      { idUser },
      { datosPersonales },
      { new: true, upsert: true }
    );
    res.json(misDatos);
  } catch (error) {
    console.error("Error al guardar o modificar los datos personales:", error);
    res
      .status(500)
      .json({ msg: "Error al guardar o modificar los datos personales." });
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

const obtenerTodosLosUsuariosAdmin = async (req, res) => {
  try {
    const usuarios = await userModel.find({ role: "user" });
    const usuariosConMascotas = await Promise.all(
      usuarios.map(async (usuario) => {
        const datosPersonales = await MisDatosModel.findOne({
          idUser: usuario._id,
        });
        if (!datosPersonales) {
          return null;
        }
        const mascotas = await MascotaModel.find({
          ownerId: datosPersonales._id,
        });
        return { ...datosPersonales.toObject(), mascotas };
      })
    );
    const usuariosFiltrados = usuariosConMascotas.filter(
      (usuario) => usuario !== null
    );
    res.status(200).json(usuariosFiltrados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

module.exports = {
  obtenerTodosLosUsuariosAdmin,
};

const modificarDatosPersonalesYMascotaAdmin = async (req, res) => {
  const { idUser } = req.params;
  const { datosPersonales, mascota } = req.body;

  try {
    const misDatos = await MisDatosModel.findOneAndUpdate(
      { idUser },
      { datosPersonales },
      { new: true, upsert: true }
    );

    if (!misDatos) {
      return res
        .status(404)
        .json({ message: "Datos personales no encontrados" });
    }

    if (mascota) {
      if (mascota._id) {
        let mascotaExistente = await MascotaModel.findById(mascota._id);
        if (mascotaExistente) {
          Object.assign(mascotaExistente, mascota);
          await mascotaExistente.save();
          return res.status(200).json({ misDatos, mascota: mascotaExistente });
        }
      }

      const nuevaMascota = new MascotaModel({
        ...mascota,
        ownerId: misDatos._id,
      });
      await nuevaMascota.save();
      return res.status(201).json({ misDatos, mascota: nuevaMascota });
    }

    res.json(misDatos);
  } catch (error) {
    console.error(
      "Error al guardar o modificar los datos personales o mascota:",
      error
    );
    res.status(500).json({
      msg: "Error al guardar o modificar los datos personales o mascota.",
    });
  }
};

module.exports = {
  obtenerDatosPersonales,
  agregarOModificarDatosPersonales,
  agregarOModificarMascota,
  eliminarMascota,
  obtenerTodosLosUsuariosAdmin,
  modificarDatosPersonalesYMascotaAdmin,
};
