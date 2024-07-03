const express = require('express');
const { contactoPlanes } = require("../middleware/messages");
const router = express.Router();


router.post('/send', contactoPlanes);

module.exports = router;
