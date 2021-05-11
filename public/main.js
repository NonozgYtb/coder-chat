const socket = io();
const list = document.getElementById("list");
const form = document.getElementById("form");
const inp = document.getElementById("inp");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	if (inp.value.trim()) {
		socket.emit("msg", inp.value);
		inp.value = "";
	}
});

socket.on("msg", (msg) => {
	let item = document.createElement("li");
	item.textContent = msg;
	list.appendChild(item);
});
