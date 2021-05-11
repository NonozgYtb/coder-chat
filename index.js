const { db, mydb } = require("./db").initDB();
const { app, io } = require("./server");

app.post("/api/login", (req, res) => {
	let re = mydb.login(req.body);
	res.json([re].map((e) => ({ ...e, name: e.username }))[0]);
});

app.post("/api/signin", (req, res) => {
	let re = mydb.signin(req.body);
	console.log({ input: req.body, output: re });
	res.json(re);
});

console.log(mydb.getUsrData(1, "*"));
console.log(mydb.getUsrData(2, "*"));

io.on("connection", (socket) => {
	socket.on("msg", (msg) => {
		let re = mydb.insertMsg(msg);
		console.log([re].map((e) => ({ ...e, name: e.user.username })));
		io.emit("msg", re);
	});
	socket.on("init", () => socket.emit("infos", mydb.getMsg().reverse()));
	socket.on("disconnect", () => {});
});
