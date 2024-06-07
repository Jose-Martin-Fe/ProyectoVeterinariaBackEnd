const express = require('express');
const router = express.Router();
const transporter = require('../middleware/nodemailer');

router.post('/send', async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  const output = `
    <p>Hola ${nombre},</p>
    <p>Gracias por tu consulta sobre el plan "${asunto}". Nos pondremos en contacto contigo pronto.</p>
    <p><strong>Mensaje:</strong> ${mensaje}</p>
  `;

  let mailOptions = {
    from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
    to: email,
    subject: `Consulta sobre el plan ${asunto}`,
    text: `Hola ${nombre}, gracias por tu consulta sobre el plan "${asunto}". Nos pondremos en contacto contigo pronto.`,
    html: output
  };

  try {
    let info = await transporter.sendMail(mailOptions);
   
    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error al enviar el correo: %s", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

module.exports = router;