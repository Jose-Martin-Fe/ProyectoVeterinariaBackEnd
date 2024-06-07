require("dotenv").config();
require("../DB/config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

class Servidor {
  constructor() {
    this.app = express();

    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }


  routes() {
    this.app.use("/api/productos", require("../routes/products.routes"));
    this.app.use("/api/users", require("../routes/usuarios.routes"));
    this.app.use("/api/contact", require("../routes/contact.routes"));
    this.app.use("/api/planes", require("../routes/contactplans.routes"));
    this.app.use("/api/carritos", require("../routes/carrito.routes"));
    this.app.use("/api/favoritos", require("../routes/favorito.routes"));
    this.app.use("/api/turnos", require("../routes/turnos.routes"));
  }

  listen() {
    this.app.listen(3001, () => {
      console.log("Servidor levantado en el puerto: ", 3001);
    });
  }
}

module.exports = Servidor;
