const express = require('express');
const router = express.Router();
const transporter = require('../middleware/nodemailer');

router.post('/send', contactoPlanes);

module.exports = router;
