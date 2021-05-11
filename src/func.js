const random = (length = 8) => {
		// Declare all characters
		let chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; /*0123456789'*/

		// Pick characers randomly
		let str = "";
		for (let i = 0; i < length; i++) {
			str += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return str;
	},
	toDate = (date_str = false) => {
		let date = date_str ? new Date(date_str) : new Date();
		var a = {};
		a.time = date
			.toLocaleTimeString("fr-fr")
			.replace(/([0-9]*\:[0-9]*)(\:[0-9]*)/, "$1");
		a.date = date.toLocaleDateString("fr-fr");
		return a;
	};

export { random, toDate };
