const Comentario = require('../models/comentarioSchema');

const obtenerComentarios = async (req, res) => {
  try {
    
    const { page = 1, limit = 9 } = req.query;
    
    const comentarios = await Comentario.find({ publicado: true })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Comentario.countDocuments({ publicado: true });

    res.json({
      comentarios,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const crearComentario = async (req, res) => {
  try {
    const { usuario, rating, comentario } = req.body;
    const nuevoComentario = new Comentario({
      usuario,
      rating,
      comentario,
      fecha: new Date(),
      publicado: false
    });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el comentario', error });
  }
};

const publicarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    comentario.publicado = true;
    await comentario.save();
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', error });
  }
};

const obtenerComentariosPendientes = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ publicado: false });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const aprobarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    comentario.publicado = true;
    await comentario.save();
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', error });
  }
};

const rechazarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByIdAndDelete(req.params.id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.json({ message: 'Comentario rechazado y eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario', error });
  }
};

module.exports = {
  obtenerComentarios,
  crearComentario,
  publicarComentario,
  obtenerComentariosPendientes,
  aprobarComentario,
  rechazarComentario
};
