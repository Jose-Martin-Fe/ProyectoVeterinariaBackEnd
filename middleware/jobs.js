const CronJob = require("cron").CronJob;
const Turno = require("../models/turnosSchema");

const job = new CronJob("0 * * * * *", async () => {
  try {
    // Obtener la hora actual menos 20 minutos
    const fechaLimite = new Date();
    fechaLimite.setMinutes(fechaLimite.getMinutes() - 20);

    // Eliminar turnos pasados
    await Turno.updateMany(
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
});

job.start(); // Iniciar el cronJob

module.exports = job;
