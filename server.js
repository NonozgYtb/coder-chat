const express = require("express"),
	http = require("http"),
	path = require("path"),
	SocketIO = require("socket.io").Server;
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});

module.exports = { app, io };
