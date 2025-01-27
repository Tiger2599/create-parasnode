const DB = require("../Middleware/db");
const { createToken, verifyToken } = require("../Middleware/jwt");
const { validationResult } = require('express-validator');
const { errSend } = require("../Middleware/sendErrMsg");
const { Verification } = require("../Middleware/2faVerification");

exports.login = async (req, res, next) => {
	try {
		res.render('login', {
			title: "login",
			mode: req.cookies.mode
		});
	} catch (error) {
		console.log(error);
		res.redirect('/')
		await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- Login \nmethod :- handleLogin \nuser :- '' \nmsg :- ${error.message}`)
	}
}

exports.handleLogin = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors?.isEmpty()) {
			return res.send({
				status: "Fail",
				msg: "",
				data: [],
				errors: errors.array()
			})
		}

		const { userName, password, ip, os, browserName } = req.body;

		let json = {
			mode: "ADMIN",
			username: userName,
			password: password
		}
		let { recordset } = await DB.SP('Sp_Admin_Login', json);

		if (recordset[0]?.msgcode !== "Success") {
			return res.send({
				status: "Error",
				msg: "",
				data: [],
				errors: new Array({ msg: recordset[0].msg })
			})
		}

		if (recordset[0].is2fa) {
			res.cookie("user", recordset[0].id);
			return res.send({
				status: recordset[0].msgcode,
				msg: recordset[0].msg,
				data: [{
					renderPage: "/login-verification"
				}],
				errors: []
			})
		}

		res.cookie("mid", await createToken(recordset[0].id));
		res.send({
			status: recordset[0].msgcode,
			msg: recordset[0].msg,
			data: [{
				renderPage: "/admin/dashboard"
			}],
			errors: []
		})
	} catch (error) {
		console.log(error);
		res.send({
			status: "Error",
			msg: "",
			data: [],
			errors: new Array({ msg: 'An error occurred. Please try again later.' })
		})

		await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- Login \nmethod :- handleLogin \nuser :- '' \nmsg :- ${error.message}`)
	}
}

exports.handleLoginVerification = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors?.isEmpty()) {
			return res.send({
				status: "Fail",
				msg: "",
				data: [],
				errors: errors.array()
			})
		}

		const { verification, ip, os, browserName } = req.body;

		let is2fa = await Verification( req.cookies.user, verification )
		res.clearCookie("user");
		if(is2fa.status !== "Success"){
			return res.send(is2fa)
		}

		res.cookie("mid", await createToken(is2fa.data[0].id));
		res.send({
			status: is2fa.data[0].msgcode,
			msg: is2fa.data[0].msg,
			data: [{
				renderPage: "/admin/dashboard"
			}],
			errors: []
		})
	} catch (error) {
		console.log(error);
		res.send({
			status: "Error",
			msg: "",
			data: [],
			errors: new Array({ msg: 'An error occurred. Please try again later.' })
		})

		await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- Login Verification \nmethod :- handleLoginVerification \nuser :- '' \nmsg :- ${error.message}`)
	}
}