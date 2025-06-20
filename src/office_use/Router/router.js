const express = require('express');
const router = express.Router();
const Controller = require("../Controller/controller");
const { body } = require('express-validator');
const { validateFields, noHtmlTags } = require('../Middleware/validateFields');
const { appLimiter, checkBlockedIps } = require('../Middleware/appLimiter');
const { checkRequest } = require('../Middleware/checkRequest');

router.route('/')
	.get(Controller.login);

// router.route('/login')
// 	.post(checkRequest, appLimiter, checkBlockedIps, [
// 		body('userName').notEmpty().withMessage('Please enter a User Name.').custom(noHtmlTags),
// 		body('password').notEmpty().withMessage('Please enter a Password.').custom(noHtmlTags)
// 	], Controller.handleLogin);

// router.route('/login-verification')
// 	.get(Controller.loginverification)
// 	.post(checkRequest, appLimiter, checkBlockedIps, validateFields(['verification']), Controller.handleLoginVerification);

module.exports = router;