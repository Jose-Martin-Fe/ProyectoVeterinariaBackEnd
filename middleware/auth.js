const jwt = require("jsonwebtoken");

module.exports = (role) => async (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ msg: "Token incorrecto" });
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);

    if (role === verifyToken.user.role) {
      req.idCart = verifyToken.user.idCart;
      req.idFav = verifyToken.user.idFav;
      req.idUser = verifyToken.user.id;
      req.idReservas = verifyToken.user.idReservas;
      req.idMisDatos = verifyToken.user.idMisDatos;
      next();
    } else {
      return res
        .status(401)
        .json({ msg: "No estas autorizado para este endpoint" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el token", error });
  }
};
