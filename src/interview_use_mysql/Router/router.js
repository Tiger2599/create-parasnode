const express = require('express');
const router = express.Router();
const Controller = require("../Controller/controller");

router.route('/')
	.get(Controller.login);

module.exports = router;