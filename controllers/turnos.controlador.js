const Turno = require("../models/turnosSchema");
const ProfesionalModel = require("../models/profesionalSchema");
const moment = require("moment-timezone");
const MisDatosModel = require("../models/miDatoSchema");

const esHoraValida = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);
  if (horas < 9 || horas >= 17) return false;
  if (minutos % 30 !== 0) return false;
  return true;
};

const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find({ idUser: req.idUser });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const crearTurno = async (req, res) => {
  const { detalleCita, veterinario, mascota, fecha, hora } = req.body;
  const idUser = req.idUser;

  const fechaArgentina = moment.tz(
    `${fecha} ${hora}`,
    "YYYY-MM-DD HH:mm",
    "America/Argentina/Buenos_Aires"
  );
  const diaSemana = fechaArgentina.day();

  if (diaSemana < 1 || diaSemana > 5) {
    return res
      .status(400)
      .json({ message: "Los veterinarios solo trabajan de lunes a viernes." });
  }

  if (!esHoraValida(hora)) {
    return res.status(400).json({
      message:
        "Los turnos solo pueden ser cada 30 minutos entre las 9:00 y las 17:00.",
    });
  }

  try {
    const turnoExistente = await Turno.findOne({
      "reservas.fecha": fecha,
      "reservas.hora": hora,
      "reservas.veterinario": veterinario,
    });

    if (turnoExistente) {
      return res.status(400).json({
        message: "Ya existe un turno reservado para esta fecha y hora.",
      });
    }

    const veterinarioExistente = await ProfesionalModel.findOne({
      nombre: veterinario,
    });

    if (!veterinarioExistente) {
      return res.status(400).json({
        message: "El veterinario especificado no existe.",
      });
    }

    const turnoInicio = fechaArgentina.clone().subtract(15, "minutes");

    if (moment().tz("America/Argentina/Buenos_Aires").isAfter(turnoInicio)) {
      return res.status(400).json({
        message:
          "El turno seleccionado no está disponible. Por favor, elija otro.",
      });
    }

    let turnoUsuario = await Turno.findOne({ idUser });
    if (!turnoUsuario) {
      turnoUsuario = new Turno({ idUser, reservas: [] });
    }

    turnoUsuario.reservas.push({
      detalleCita,
      veterinario,
      mascota,
      fecha,
      hora,
    });

    await turnoUsuario.save();

    res.status(201).json(turnoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el turno", error });
  }
};

const obtenerHorariosDisponibles = async (req, res) => {
  const { fecha, veterinario } = req.body;

  try {
    const turnos = await Turno.find({
      "reservas.fecha": fecha,
      "reservas.veterinario": veterinario,
    });

    const horariosOcupados = turnos.flatMap((turno) =>
      turno.reservas.map((reserva) => reserva.hora)
    );

    const horariosDisponibles = [];
    const now = moment().tz("America/Argentina/Buenos_Aires");
    const today = now.format("YYYY-MM-DD");

    for (let h = 9; h < 17; h++) {
      ["00", "30"].forEach((m) => {
        const hora = `${String(h).padStart(2, "0")}:${m}`;
        const fechaHora = moment.tz(
          `${fecha} ${hora}`,
          "YYYY-MM-DD HH:mm",
          "America/Argentina/Buenos_Aires"
        );

        if (fecha === today && fechaHora.isBefore(now)) {
          // Saltar horarios pasados para la fecha de hoy
          return;
        }

        if (!horariosOcupados.includes(hora)) {
          horariosDisponibles.push(hora);
        }
      });
    }

    res.json(horariosDisponibles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const turnoUsuario = await Turno.findOne({ "reservas._id": req.params.id });
    if (!turnoUsuario) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    const reservaIndex = turnoUsuario.reservas.findIndex(
      (reserva) => reserva._id.toString() === req.params.id
    );
    if (reservaIndex === -1) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    turnoUsuario.reservas.splice(reservaIndex, 1);
    await turnoUsuario.save();

    res
      .status(200)
      .json({ msg: "Reserva eliminada correctamente", turnoUsuario });
  } catch (error) {
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

const adminObtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find({});

    const turnosConDatosPersonales = await Promise.all(
      turnos.map(async (turno) => {
        const datosPersonales = await MisDatosModel.findOne({
          idUser: turno.idUser._id,
        });
        return {
          ...turno.toObject(),
          datosPersonales: datosPersonales ? datosPersonales.toObject() : null,
        };
      })
    );

    res.json(turnosConDatosPersonales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminEliminarReserva = async (req, res) => {
  try {
    const turnoUsuario = await Turno.findOne({ "reservas._id": req.params.id });
    if (!turnoUsuario) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    const reservaIndex = turnoUsuario.reservas.findIndex(
      (reserva) => reserva._id.toString() === req.params.id
    );
    if (reservaIndex === -1) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    turnoUsuario.reservas.splice(reservaIndex, 1);
    await turnoUsuario.save();

    res
      .status(200)
      .json({ msg: "Reserva eliminada correctamente", turnoUsuario });
  } catch (error) {
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

module.exports = {
  obtenerTurnos,
  crearTurno,
  obtenerHorariosDisponibles,
  eliminarReserva,
  adminObtenerTurnos,
  adminEliminarReserva,
};
