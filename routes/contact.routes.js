const express = require('express');
const transporter = require('../middleware/nodemailer'); // Asegúrate de que la ruta es correcta

const router = express.Router();

router.post('/send', async (req, res) => {
  const { nombre, apellido, email, mensaje } = req.body;

  const output = `
    <p>Hola ${nombre} ${apellido},</p>
    <p>Gracias por contactarte, en breve nos pondremos en contacto contigo.</p>
    <p><strong>Mensaje:</strong> ${mensaje}</p>
  `;

  let mailOptions = {
    from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
    to: email,
    subject: "Gracias por contactarnos",
    text: `Hola ${nombre}, gracias por contactarte, en breve nos contactaremos contigo.`,
    html: output
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Mensaje enviado: %s", info.messageId);
    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error al enviar el correo: %s", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

module.exports = router;