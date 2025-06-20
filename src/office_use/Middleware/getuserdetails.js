const DB = require('../Middleware/db');
const { verifyToken } = require('../Middleware/jwt');

exports.getuserDetails = async (req, res, next) => {
	var mid = 0;
	var getProfile = {};
	var userPrivilege = [];
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
		recordsets[1].forEach(e => userPrivilege.push({ privilege_name: e.privilege_name, notification: e.notification }));

		req.memberid = mid;
		req.getProfile = getProfile;
		req.userPrivilege = userPrivilege;
	}
}

exports.checkPrivlege = async (req, res, next, ...rest) => {
	console.log("🚀 ~ exports.checkPrivlege= ~ rest:", rest)
    const hasPermission = rest.every(page =>
        ['mn_', 'sub_mn_', 'user_', 'order_', 'contract_'].some(prefix =>
            req.userPrivilege.some(privilege => privilege.privilege_name === prefix + page)
        )
    );

    if (!hasPermission) {
        console.log("You don't have permission to open this page");
        return res.status(403).send("You don't have permission to open this page");
    }
};