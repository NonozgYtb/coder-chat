const b_sqli3 = require("better-sqlite3"),
	faker = require("faker"),
	bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(),
	toDateSQL = (date) =>
		date
			.toISOString()
			.replace(/Z|T|(\.[0-9]*)/g, " ")
			.trim(),
	toDate = (date_str, timezone = true) => {
		let date = new Date(
			timezone
				? new Date(date_str).getTime() -
				  new Date().getTimezoneOffset() * 60 * 1000
				: date_str
		);
		return {
			time: date
				.toLocaleTimeString("fr-fr")
				.replace(/([0-9]*\:[0-9]*)(\:[0-9]*)/, "$1"),
			date: date.toLocaleDateString("fr-fr"),
		};
	};

class DB {
	constructor(file) {
		this.db = b_sqli3(file !== null && file !== void 0 ? file : "mem.db");
		this.prep_selector = this.db.prepare(
			"select * from usr WHERE username = @name OR email = @name"
		);
		this.prep_usr = this.db.prepare(
			"INSERT INTO usr ( username, email, pswd, create_at, last_co ) VALUES ( @username, @email, @pswd, @create_at, @last_co)"
		);
		this.prep_msg = this.db.prepare(
			"INSERT INTO msg ( usr_id, content ) VALUES ( @usr_id, @content )"
		);
		this._prep_msg = this.db.prepare(
			"INSERT INTO msg ( usr_id, content, create_at ) VALUES ( @usr_id, @content, @create_at )"
		);
		this.modifyUsrDate = this.db.prepare(
			"UPDATE usr SET last_co = @date WHERE id = @id"
		);
		this.prep_modifyPswd = this.db.prepare(
			"UPDATE usr SET pswd = @pswd WHERE id = @id"
		);
		this.prep_modifyUsrName = this.db.prepare(
			"UPDATE usr SET username = @name WHERE id = @id"
		);
		this.inserter = (prepared) =>
			this.db.transaction((usrs) => {
				for (const usr of usrs) prepared.run(usr);
			});
		this.users_data = {};
		return this;
	}

	init() {
		this.db.exec("DROP TABLE IF EXISTS usr");
		this.db.exec("DROP TABLE IF EXISTS msg");
		this.db.exec(
			"CREATE TABLE IF NOT EXISTS usr ( id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, pswd TEXT NOT NULL, create_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_co DATETIME DEFAULT CURRENT_TIMESTAMP)"
		);
		this.db.exec(
			"CREATE TABLE IF NOT EXISTS msg ( id INTEGER PRIMARY KEY AUTOINCREMENT, usr_id INTEGER NOT NULL, content TEXT NOT NULL, create_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
		);
		return this;
	}

	getdb() {
		return { db: this.db, mydb: this };
	}

	modifyPswd({ id, pswd }) {
		this.prep_modifyPswd.run({
			id: log.data.id ?? id,
			pswd: bcrypt.hashSync(pswd, salt),
		});
		return true;
	}

	modifyUsrName({ id, name }) {
		if (this.prep_selector.all({ name }).length) {
			return false;
		}
		this.prep_modifyUsrName.run({
			id: log.data.id ?? id,
			pswd: bcrypt.hashSync(pswd, salt),
		});
		return true;
	}

	getUsrData(id, fields = "id, username, email, create_at, last_co") {
		return this.db.prepare(`SELECT ${fields} FROM usr WHERE id = ?`).get(id);
	}

	login({ name, pass }) {
		if (!name || !pass) return { verify: false, data: {} };
		let raw = this.prep_selector.get({ name });
		if (!raw) return { verify: false, data: {} };
		let verify = bcrypt.compareSync(pass, raw.pswd);
		if (!verify) return { verify, data: {} };
		this.modifyUsrDate.run({ date: toDateSQL(new Date()), id: raw.id });
		delete raw.pswd;
		return {
			verify,
			data: { ...raw, last_co: toDateSQL(new Date()), pswd: undefined },
		};
	}

	signin({ username, email, pass } = {}) {
		if (!username || !email || !pass) return { work: false, error: "empty" };
		let raw =
			this.prep_selector.get({ name: username }) ??
			this.prep_selector.get({ name: email });
		if (raw) {
			let data = this.login({ name: username, pass });
			if (
				data.verify &&
				data.data.username == username &&
				data.data.email == email
			)
				return { work: true, data, redirect: "login" };
			data = this.login({ name: email, pass });
			if (
				data.verify &&
				data.data.username == username &&
				data.data.email == email
			)
				return { work: true, data, redirect: "login" };
			return { work: false, error: "alred_us" };
		}
		let date = new Date();
		this.prep_usr.run({
			username,
			email,
			pswd: bcrypt.hashSync(pass, salt),
			create_at: toDateSQL(date),
			last_co: toDateSQL(date),
		});
		return {
			work: true,
			data: [this.prep_selector.get({ name: username })].map((e) => ({
				...e,
				name: e.username,
				pswd: undefined,
			})),
		};
	}

	insertMsg({ usr_id, content }) {
		this.prep_msg.run({
			usr_id,
			content,
		});
		return this.db
			.prepare("SELECT * FROM msg ORDER BY id DESC LIMIT 1")
			.all()
			.map(({ id, content, create_at, usr_id }) => ({
				id,
				message: content,
				date: toDate(create_at),
				user: this.getUsrData(usr_id),
			}))[/*.map((e) => ({ ...e, name: e.user.username }))*/ 0];
	}

	getMsg() {
		return this.db
			.prepare("SELECT * FROM msg ORDER BY id DESC LIMIT 10")
			.all()
			.map(({ id, content, create_at, usr_id }) => ({
				id,
				message: content,
				date: toDate(create_at),
				user: this.getUsrData(usr_id),
			}))
			.map((e) => ({ ...e, name: e.user.username }));
	}

	insertFakeUsers(number) {
		for (let i = 1; i <= number; i++) {
			let date = new Date();
			date.setSeconds(date.getSeconds() + 10 * i);
			let { username, email } = faker.helpers.userCard();
			let pswd = /*faker.internet.password(Math.floor(Math.random() * 5) + 8);*/ bcrypt.hashSync(
				username.slice(0, 3),
				salt
			);
			if (i == 1) {
				console.log({
					username,
					email,
					pswd,
					create_at: toDateSQL(date),
					last_co: toDateSQL(date),
				});
			}
			this.prep_usr.run({
				username,
				email,
				pswd,
				create_at: toDateSQL(date),
				last_co: toDateSQL(date),
			});
		}

		return this;
	}

	insertFakeMessages(number, nOfUsr) {
		for (let i = 1; i <= number; i++) {
			let date = new Date();
			date.setSeconds(date.getSeconds() + 10 * i);
			let usr_id = Math.floor(Math.random() * nOfUsr + 1);
			let content = faker.lorem.sentence(Math.floor(Math.random() * 9) + 6);
			this._prep_msg.run({
				usr_id,
				content,
				create_at: toDateSQL(date),
			});
		}
		return this;
	}
}

const initDB = () =>
	new DB() /*.init().insertFakeUsers(20).insertFakeMessages(50, 20)*/
		.getdb();

module.exports = { DB, initDB };
