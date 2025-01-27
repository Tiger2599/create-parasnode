const DB = require('../Middleware/db');
const speakeasy = require("speakeasy");
const { errSend } = require("../Middleware/sendErrMsg");
const { validationResult } = require('express-validator');

exports.Verification = async ( mid, verification_code ) => {
	try {
		let json = {
			mode: "VERIFY_2FA",
			mid
		}
		let { recordset } = await DB.SP('Sp_Admin_Login', json);

		if(recordset[0]?.msgcode !== "Success") {
			return {
				status: "Error",
				msg: "",
				data: [],
				errors: new Array({ msg: recordset[0].msg, path: 'verification' })
			}
		}

		const isVerified = speakeasy.totp.verify({
			secret: recordset[0].secrateKey,
			encoding: "base32",
			token: verification_code,
		});

		if (!isVerified) {
			return {
				status: "Fail",
				msg: "",
				data: [],
				errors: new Array({ msg: "Authentication failed", path: 'verification' })
			}
		} 

		return {
			status: "Success",
			msg: "",
			data: recordset,
			errors: new Array({ msg: "" })
		}
	} catch (error) {
		console.log(error);
		await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- Login Verification \nmethod :- handleLoginVerification \nuser :- '' \nmsg :- ${error.message}`)

		return {
			status: "Error",
			msg: "",
			data: [],
			errors: new Array({ msg: 'An error occurred. Please try again later.' })
		}
	}
}

exports.is2faOn = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors?.isEmpty()) return res.send({ status: "Fail", msg: "", data: [], errors: errors.array() })

		let json = {
			mode: "IS2FA_ON",
			mid: req.memberid
		}
		let { recordset } = await DB.SP('Sp_Admin_Login', json);
		if(recordset[0]?.msgcode !== "Success") return res.send({ status: "Error", msg: "", data: [], errors: new Array({ msg: recordset[0].msg })})

		return res.send({ status: "Success", msg: "", data: [], errors: new Array({ msg: "" }) })
	} catch (error) {
		console.log(error);
		await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- clientController \nmethod :- updateInfo \nuser :- '' \nmsg :- ${error.message}`)
		return res.send({ status: "Error", msg: "", data: [], errors: new Array({ msg: "An error has occurred. Please try again later." }) })
	}
}