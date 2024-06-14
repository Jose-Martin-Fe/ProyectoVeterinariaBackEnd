const CronJob = require("cron").CronJob;
const moment = require("moment-timezone");
const Turno = require("../models/turnosSchema");

const job = new CronJob(
  "0 0 9 * * 1-5", // Ejecutar de lunes a viernes a las 09:00 hs
  async () => {
    try {
      const fechaLimite = moment().subtract(5, "minutes").toDate();

      console.log("CronJob ejecutado a:", moment().toLocaleString());
      console.log(
        "Fecha límite para eliminar turnos:",
        moment(fechaLimite).toLocaleString()
      );

      const result = await Turno.updateMany(
        {
          "reservas.fecha": { $lt: fechaLimite },
        },
        {
          $pull: {
            reservas: { fecha: { $lt: fechaLimite } },
          },
        }
      );

      console.log(
        `Turnos pasados eliminados correctamente. Cantidad de documentos modificados: ${result.nModified}`
      );
    } catch (error) {
      console.error("Error al eliminar los turnos pasados:", error);
    }
  },
  null,
  true,
  "America/Argentina/Buenos_Aires"
);

job.start(); // Iniciar el cronJob

module.exports = job;
