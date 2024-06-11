const CronJob = require("cron").CronJob;
const Turno = require("../models/turnosSchema");

const job = new CronJob("0 */5 9-17 * * 1-5", async () => {
  try {
    // Obtener la hora actual
    const fechaActual = new Date();

    // Obtener la hora actual menos 25 minutos (20 minutos de duración + 5 minutos de tolerancia)
    const fechaLimite = new Date(fechaActual.getTime() - 25 * 60000);

    // Eliminar turnos pasados con tolerancia de 5 minutos
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
      `Turnos pasados eliminados correctamente hasta la fecha: ${fechaLimite}, documentos modificados: ${result.nModified}`
    );
  } catch (error) {
    console.error("Error al eliminar los turnos pasados:", error);
  }
});

job.start(); // Iniciar el cronJob

module.exports = job;
