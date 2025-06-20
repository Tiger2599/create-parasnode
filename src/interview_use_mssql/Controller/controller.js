const DB = require("../Middleware/db");

exports.login = async (req, res, next) => {
	try {
		res.render('login', {
			title: "login",
			mode: req.cookies.mode
		});
	} catch (error) {
		console.log(error);
		res.redirect('/')
	}
}
