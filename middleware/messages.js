const transporter = require("../middleware/nodemailer");

const welcomeUser = async (emailUsuario) => {
  /* const welcomeUser = async () => { */
  try {
    const info = await transporter.sendMail({
      from: `"Veterinaria Patas y Garras" <${process.env.GMAIL_MAIL}>`,
      to: `${emailUsuario}`, // list of receivers
      /* to: `${process.env.GMAIL_MAIL}`, */ // list of receivers
      subject: "Bienvenidos a Patas y Garras ", // Subject line
      html: "<b>Muchas gracias por confiar en nosotros</b>", // html body
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
      from: `"Recuperacion de contraseña" <${process.env.GMAIL_MAIL}>`, // sender address
      /*   to: `${emailUsuario}`, */ // list of receivers
      to: `${emailUsuario}`, // list of receivers
      subject: "Recupera tu contraseña en pocos pasos", // Subject line
      html: "<b>Haz click en el sgte enlace</b>", // html body
    });
    if (info.response.includes("OK")) {
      return 200;
    }
  } catch (error) {
    return 500;
  }
};

module.exports = {
  welcomeUser,
  recoveryPass,
};
