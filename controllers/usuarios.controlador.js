const userModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeUser } = require("../middleware/messages");
const CarritoModel = require("../models/carritoSchema");
const FavoritoModel = require("../models/favoritosSchema");

const getAllUser = async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.status(200).json({ msg: "Usuarios encontrados", getUsers });
  } catch (error) {
    console.log(error);
  }
};

const getAllUserDeletedTrue = async (req, res) => {
  try {
    const getUsers = await userModel.find({ deleted: true });
    res.status(200).json({ msg: "Usuarios encontrados", getUsers });
  } catch (error) {
    console.log(error);
  }
};

const getAllUserDeletedFalse = async (req, res) => {
  try {
    const getUsersDelFalse = await userModel.find({ deleted: false });
    res.status(200).json({ msg: "Usuarios encontrados", getUsersDelFalse });
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
    // Verifica si el mail ya existe
    const emailExist = await userModel.findOne({
      emailUsuario: req.body.emailUsuario,
    });
    if (emailExist) {
      return res
        .status(400)
        .json({ msg: "El correo electrónico ya está en uso" });
    }
    // Verifica si el usuario ya existe
    const userExist = await userModel.findOne({
      nombreUsuario: req.body.nombreUsuario,
    });

    if (userExist) {
      return res.status(400).json({ msg: "Usuario no disponible" });
    }

    // Crea nuevos documentos para el usuario, carrito y favoritos
    const newUser = new userModel(req.body);
    const newCart = new CarritoModel({ idUser: newUser._id });
    const newFavs = new FavoritoModel({ idUser: newUser._id });

    // Encripta la contraseña
    const salt = bcrypt.genSaltSync(10);
    newUser.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);

    // ASIGNA EL ID DEL CARRITO Y FAVORITO AL USUARIO
    newUser.idCart = newCart._id;
    newUser.idFav = newFavs._id;

    // Envía un correo de bienvenida (maneja el caso en que falle)
    const resultMessage = await welcomeUser(req.body.emailUsuario);
    if (resultMessage !== 200) {
      return res
        .status(500)
        .json({ msg: "Error al enviar correo de bienvenida" });
    }

    // Guarda los documentos en la base de datos
    await newCart.save();
    await newFavs.save();
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
    const userDel = await userModel.findById({ _id: req.params.idUser });

    if (userDel.deleted) {
      return res.status(400).json({ msg: "El usuario ya fue eliminado" });
    }

    userDel.deleted = true;
    await userDel.save();

    res.status(200).json({ msg: "Usuario eliminado logicamente" });
  } catch (error) {
    console.log(error);
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
  getAllUserDeletedTrue,
  getAllUserDeletedFalse,
  createUser,
  loginUser,
  deleteLogic,
  updateUser,
};
