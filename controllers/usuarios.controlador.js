const userModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeUser } = require("../middleware/messages");
const CarritoModel = require("../models/carritoSchema");
const FavoritoModel = require("../models/favoritosSchema");
/* const MisDatosModel = require("../models/misDatosSchema"); */
const Turno = require("../models/turnosSchema");

const getAllUser = async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.status(200).json({ msg: "Usuarios encontrados", getUsers });
  } catch (error) {
    console.log(error);
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

    console.log("Validaciones de correo y usuario pasadas...");

    const newUser = new userModel(req.body);
    const newCart = new CarritoModel({ idUser: newUser._id });
    const newFavs = new FavoritoModel({ idUser: newUser._id });
    const newTurno = new Turno({ idUser: newUser._id });

    const salt = bcrypt.genSaltSync(10);
    newUser.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);

    newUser.idCart = newCart._id;
    newUser.idFav = newFavs._id;
    newUser.idReservas = newTurno._id;

    console.log("Hashes y referencias de ID asignadas...");

    const resultMessage = await welcomeUser(req.body.emailUsuario);
    if (resultMessage !== 200) {
      return res
        .status(500)
        .json({ msg: "Error al enviar correo de bienvenida" });
    }

    console.log("Correo de bienvenida enviado...");

    await newCart.save();
    await newFavs.save();
    await newTurno.save();
    await newUser.save();

    res.status(201).json({ msg: "Usuario Registrado", newUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
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
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    return res
      .status(200)
      .json({ msg: "Usuario logueado", token, role: userExist.role });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
};

const updateUser = async (req, res) => {
  try {
    const update = await userModel.findByIdAndUpdate(
      { _id: req.params.idUser },
      req.body,
      { new: true }
    );

    res.status(200).json({ msg: "Usuario actualizado", update });
  } catch (error) {
    console.log(error);
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
