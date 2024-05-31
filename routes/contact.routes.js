const express = require("express");
const { contacto } = require("../middleware/messages");

const router = express.Router();

router.post("/send", contacto);

module.exports = router;
