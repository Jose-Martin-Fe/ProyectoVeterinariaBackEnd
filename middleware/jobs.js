const CronJob = require("cron").CronJob;
const moment = require("moment-timezone");
const Turno = require("../models/turnosSchema");

const job = new CronJob(
  "0 0 9 * * 1-5",
  async () => {
    try {
      const fechaLimite = moment().subtract(5, "minutes").toDate();

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
    } catch (error) {
      console.error("Error al eliminar los turnos pasados:", error);
    }
  },
  null,
  true,
  "America/Argentina/Buenos_Aires"
);

job.start();

module.exports = job;
