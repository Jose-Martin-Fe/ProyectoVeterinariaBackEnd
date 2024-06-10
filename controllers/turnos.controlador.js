const Turno = require("../models/turnosSchema");
const eliminarTurnosPasados = require("../middleware/jobs");

const esHoraValida = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);
  if (horas < 9 || horas >= 17) return false;
  if (minutos % 20 !== 0) return false;
  return true;
};

// Obtener todos los turnos
const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un turno
const crearTurno = async (req, res) => {
  const { detalleCita, veterinario, mascota, fecha, hora } = req.body;
  const idUser = req.idUser; // Obtener el ID del usuario del middleware

  const diaSemana = new Date(fecha).getDay();

  if (diaSemana < 1 || diaSemana > 5) {
    return res
      .status(400)
      .json({ message: "Los veterinarios solo trabajan de lunes a viernes." });
  }

  if (!esHoraValida(hora)) {
    return res.status(400).json({
      message:
        "Los turnos solo pueden ser cada 20 minutos entre las 9:00 y las 17:00.",
    });
  }

  try {
    // Verificar si ya existe una reserva en la misma fecha y hora con el mismo veterinario
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

    // Buscar o crear el turno del usuario
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
  } catch (err) {
    console.error("Error al crear el turno:", err);
    res.status(500).json({ msg: "Error al crear el turno" });
  }
};

// Actualizar un turno
const actualizarTurno = async (req, res) => {
  const id = req.params.id;
  const { detalleCita, veterinario, mascota, fecha, hora } = req.body;

  if (!esHoraValida(hora)) {
    return res.status(400).json({
      message:
        "Los turnos solo pueden ser cada 20 minutos entre las 9:00 y las 17:00.",
    });
  }

  try {
    // Verificar si ya existe una reserva en la misma fecha y hora con el mismo veterinario
    const turnoExistente = await Turno.findOne({
      "reservas.fecha": fecha,
      "reservas.hora": hora,
      "reservas.veterinario": veterinario,
      _id: { $ne: id }, // Excluir el turno que se está actualizando
    });

    if (turnoExistente) {
      return res.status(400).json({
        message: "Ya existe un turno reservado para esta fecha y hora.",
      });
    }

    const turnoActualizado = await Turno.findByIdAndUpdate(
      id,
      {
        detalleCita,
        veterinario,
        mascota,
        fecha,
        hora,
      },
      { new: true }
    );

    if (!turnoActualizado) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.json(turnoActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar un turno
const borrarTurno = async (req, res) => {
  const id = req.params.id;

  try {
    const turnoEliminado = await Turno.findByIdAndDelete(id);

    if (!turnoEliminado) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.json({ message: "Turno eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  borrarTurno,
};
