const userModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeUser } = require("../middleware/messages");
const CarritoModel = require("../models/carritoSchema");
const FavoritoModel = require("../models/favoritosSchema");
const Turno = require("../models/turnosSchema");
const MisDatosModel = require("../models/miDatoSchema");

const getAllUser = async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.status(200).json({ msg: "Usuarios encontrados", getUsers });
  } catch (error) {
        res.status(500).json({ msg: "Error al obtener todos los usuarios" });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  try {
    console.log("Iniciando creación de usuario...");

    const emailExist = await userModel.findOne({
      emailUsuario: req.body.emailUsuario,
    });
    if (emailExist) {
      return res
        .status(400)
        .json({ msg: "El correo electrónico ya está en uso" });
    }

    const userExist = await userModel.findOne({
      nombreUsuario: req.body.nombreUsuario,
    });
    if (userExist) {
      return res.status(400).json({ msg: "Usuario no disponible" });
    }


    const newUser = new userModel(req.body);
    const newCart = new CarritoModel({ idUser: newUser._id });
    const newFavs = new FavoritoModel({ idUser: newUser._id });
    const newTurno = new Turno({ idUser: newUser._id });
    const newMisDatos = new MisDatosModel({ idUser: newUser._id });

    const salt = bcrypt.genSaltSync(10);
    newUser.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);

    newUser.idCart = newCart._id;
    newUser.idFav = newFavs._id;
    newUser.idReservas = newTurno._id;
    newUser.idMisDatos = newMisDatos._id;

    console.log("Hashes y referencias de ID asignadas...");

    const resultMessage = await welcomeUser(req.body.emailUsuario);
    if (resultMessage !== 200) {
      return res
        .status(500)
        .json({ msg: "Error al enviar correo de bienvenida" });
    }

    await newCart.save();
    await newFavs.save();
    await newTurno.save();
    await newUser.save();
    await newMisDatos.save();

    res.status(201).json({ msg: "Usuario Registrado", newUser });
  } catch (error) {
    res.status(400).json({ msg: "Error al crear el usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    const userExist = await userModel.findOne({
      nombreUsuario: req.body.nombreUsuario,
    });

    if (!userExist) {
      return res
        .status(400)
        .json({ msg: "Usuario y/o contraseña no coinciden. USER" });
    } else if (userExist.deleted) {
      return res
        .status(403)
        .json({ msg: "Usuario bloqueado. Debe comunicarse con el admin" });
    }

    const verifyPass = await bcrypt.compare(
      req.body.contrasenia,
      userExist.contrasenia
    );

    if (!verifyPass) {
      return res
        .status(400)
        .json({ msg: "Usuario y/o contraseña no coinciden. PASS" });
    }

    const payload = {
      user: {
        id: userExist._id,
        role: userExist.role,
        nombreUsuario: userExist.nombreUsuario,
        idCart: userExist.idCart,
        idFav: userExist.idFav,
        idReservas: userExist.idReservas,
        idMisDatos: userExist.idMisDatos,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    return res.status(200).json({
      msg: "Usuario logueado",
      token,
      role: userExist.role,
      id: userExist._id,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error al crear el usuario", error });
  }
};

const deleteLogic = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.idUser);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    user.deleted = !user.deleted;
    await user.save();

    res.status(200).json({
      msg: user.deleted ? "Usuario deshabilitado" : "Usuario habilitado",
      user,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el estado del usuario" });
  }
};

const deletePhysically = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.idUser);
    if (!deletedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.status(200).json({ msg: "Usuario eliminado físicamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const { nombreUsuario, emailUsuario, role } = req.body;

    const existingUsername = await userModel.findOne({ nombreUsuario });
    if (existingUsername && existingUsername._id.toString() !== idUser) {
      return res
        .status(400)
        .json({ msg: "El nombre de usuario ya está en uso por otro usuario" });
    }

    const existingEmail = await userModel.findOne({ emailUsuario });
    if (existingEmail && existingEmail._id.toString() !== idUser) {
      return res
        .status(400)
        .json({ msg: "El correo electrónico ya está en uso por otro usuario" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      idUser,
      { nombreUsuario, emailUsuario, role },
      { new: true }
    );

    res.status(200).json({ msg: "Usuario actualizado", updatedUser });
  } catch (error) {
    res.status(400).json({ msg: "Error al actualizar el usuario" });
  }
};

module.exports = {
  getAllUser,
  createUser,
  loginUser,
  deleteLogic,
  deletePhysically,
  updateUser,
};
