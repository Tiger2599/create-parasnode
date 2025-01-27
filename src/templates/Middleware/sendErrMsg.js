const axios = require('axios');

exports.errSend = async (msg) => { 
	await axios.post(
		process.env.ERR_BOTURL,
		{ 
			msg, 
			project:"" 
		}
	);
}