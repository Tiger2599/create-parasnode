const DB = require('../Middleware/db');
const { verifyToken } = require('../Middleware/jwt');

exports.getuserDetails = async (req, res, next) => {
	var mid = 0;
	var getProfile = {};
	var verify = await verifyToken(req.cookies.mid);
	if (verify == undefined) {
		mid = 0;
	} else {
		mid = verify;
		const json = {
			mode: "GETUSERDETAILS",
			uid: mid
		};
		const { recordsets } = await DB.SP('Sp_admin', json);

		getProfile['userData'] = recordsets[0]

		req.memberid = mid;
		req.getProfile = getProfile;
	}
}
