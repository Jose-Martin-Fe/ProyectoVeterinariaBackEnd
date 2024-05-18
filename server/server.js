const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("../DB/config");
class Servidor {
  constructor() {
    this.app = express();
    /* debemos ejecutar dentro del constructor */
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  /* creamos un middleware para llamar las rutas */
  routes() {
    /* this.app.use("/api/productos", require("../routes/products.routes")); */
  }

  listen() {
    this.app.listen(3001, () => {
      console.log("Servidor levantado en el puerto: ", 3001);
    });
  }
}

module.exports = Servidor;
