const transporter = require("../middleware/nodemailer");

const welcomeUser = async (emailUsuario) => {
 
  try {
    const info = await transporter.sendMail({
      from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
      to: `${emailUsuario}`,
  
      subject: "Bienvenidos a Patas y Garras ", 
      html: "<b>Muchas gracias por confiar en nosotros</b>", 
    });
    if (info.response.includes("OK")) {
      return 200;
    }
  } catch (error) {
    return 500;
  }
};

const recoveryPass = async (emailUsuario) => {
  try {
    const info = await transporter.sendMail({
      from: `"Recuperacion de contraseña" <${process.env.GMAIL_MAIL}>`, 
    
      to: `${emailUsuario}`, 
      subject: "Recupera tu contraseña en pocos pasos", 
      html: "<b>Haz click en el sgte enlace</b>", 
    });
    if (info.response.includes("OK")) {
      return 200;
    }
  } catch (error) {
    return 500;
  }
};

const contacto = async (req, res) => {
  try {
    const { nombre, apellido, email, mensaje } = req.body;

    const outputCliente = `
      <p>Hola ${nombre} ${apellido},</p>
      <p>Gracias por contactarte, en breve nos pondremos en contacto contigo.</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
    `;

    const mailOptionsCliente = {
      from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
      to: email,
      subject: "Gracias por contactarnos",
      text: `Hola ${nombre} ${apellido}, gracias por contactarte, en breve nos pondremos en contacto contigo.\n\nMensaje de consulta:\n${mensaje}`,
    };

    const mailOptionsAdmin = {
      from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
      to: process.env.GMAIL_MAIL,
      subject: `Consulta de ${nombre}`,
      text: `Mensaje de consulta de ${nombre} ${apellido}:\n\n${mensaje} \n\nMail del cliente: ${email}`,
    };

    const sendEmail = async (options) => {
      return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
          if (error) {
            return reject(error);
          }
          resolve(info);
        });
      });
    };

    const infoCliente = await sendEmail(mailOptionsCliente);
  

    const infoAdmin = await sendEmail(mailOptionsAdmin);
   

    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error al enviar el correo: %s", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};

module.exports = {
  welcomeUser,
  recoveryPass,
  contacto,
};
