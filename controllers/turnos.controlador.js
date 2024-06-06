const Turno = require('../models/turnosSchema');


const esHoraValida = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  if (horas < 9 || horas >= 17) return false; 
  if (minutos % 20 !== 0) return false; 
  return true;
};

const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const crearTurno = async (req, res) => {
  const { detalleCita, veterinario, mascota, fecha, hora } = req.body;

  const diaSemana = new Date(fecha).getDay();

  if (diaSemana < 1 || diaSemana > 5) {
    return res.status(400).json({ message: 'Los veterinarios solo trabajan de lunes a viernes.' });
  }

  if (!esHoraValida(hora)) {
    return res.status(400).json({ message: 'Los turnos solo pueden ser cada 20 minutos entre las 9:00 y las 17:00.' });
  }

  try {
    const turnoExistente = await Turno.findOne({ veterinario, fecha, hora });

    if (turnoExistente) {
      return res.status(400).json({ message: 'El veterinario ya tiene un turno a esa hora.' });
    }

    const turnosEnFechaHora = await Turno.find({ fecha, hora });
    if (turnosEnFechaHora.length > 0) {
      return res.status(400).json({ message: 'La hora seleccionada ya está ocupada.' });
    }

    const turno = new Turno({
      detalleCita,
      veterinario,
      mascota,
      fecha,
      hora
    });

    const nuevoTurno = await turno.save();
    res.status(201).json(nuevoTurno);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const actualizarTurno = async (req, res) => {
  const id = req.params.id;
  const { detalleCita, veterinario, mascota, fecha, hora } = req.body;

  if (!esHoraValida(hora)) {
    return res.status(400).json({ message: 'Los turnos solo pueden ser cada 20 minutos entre las 9:00 y las 17:00.' });
  }

  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(id, {
      detalleCita,
      veterinario,
      mascota,
      fecha,
      hora
    }, { new: true });

    if (!turnoActualizado) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json(turnoActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const borrarTurno = async (req, res) => {
  const id = req.params.id;

  try {
    const turnoEliminado = await Turno.findByIdAndDelete(id);

    if (!turnoEliminado) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  borrarTurno
};