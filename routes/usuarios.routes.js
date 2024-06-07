const express = require("express");
const {
  createUser,
  loginUser,
  deleteLogic,
  getAllUser,
  updateUser,
  deletePhysically,
} = require("../controllers/usuarios.controlador");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth("admin"), getAllUser);

router.post(
  "/register",
  [
    check("nombreUsuario", "Campo nombre usuario vacio").notEmpty(),
    check(
      "nombreUsuario",
      "Nombre de usuario no debe ser menor a 5 caracteres ni mayor a 30"
    ).isLength({ min: 5, max: 30 }),
    check("contrasenia", "Campo contraseña vacio").notEmpty(),
    check(
      "contrasenia",
      "Contraseña debe tener como minimo 8 caracteres"
    ).isLength({ min: 5, max: 30 }),
  ],
  createUser
);
router.post(
  "/login",
  [
    check("nombreUsuario", "Campo nombre usuario vacio").notEmpty(),
    check(
      "nombreUsuario",
      "Nombre de usuario no debe ser menor a 5 caracteres ni mayor a 30"
    ).isLength({ min: 5, max: 30 }),
    check("contrasenia", "Campo contraseña vacio").notEmpty(),
    check(
      "contrasenia",
      "Contraseña debe tener como minimo 8 caracteres"
    ).isLength({ min: 5, max: 30 }),
  ],
  loginUser
);

router.put("/:idUser", auth("admin"), updateUser);

router.delete("/:idUser", auth("admin"), deleteLogic);
router.delete("/users/:idUser", auth("admin"), deletePhysically);

module.exports = router;
