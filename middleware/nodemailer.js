const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,

  secure: false,

  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASS_APP,
  },
});

module.exports = transporter;
