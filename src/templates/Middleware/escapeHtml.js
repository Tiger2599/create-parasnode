exports.escapeHtml = async(data) =>{
	data.forEach(object => {
		Object.keys(object).forEach(key => {
			if (object[key]) {
				object[key] = object[key]
					.toString()
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}
		});
	});
	return data;
}
