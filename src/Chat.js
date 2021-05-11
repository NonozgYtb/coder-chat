import React, { Component } from "react";
import {
	Paper,
	TextField,
	IconButton,
	Button,
	Typography,
} from "@material-ui/core";
import Mic from "@material-ui/icons/Mic";
import Send from "@material-ui/icons/Send";
import * as $ from "jquery";
import SockIoCli from "socket.io-client";
const socket = SockIoCli();
import { random, toDate } from "./func";
import { MainContext } from "./context";
import { Redirect } from "react-router-dom";

const styles = {
	paper: {
		width: "80vw",
		height: "calc( 100% - 53px)",
		maxHeight: "700px",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		position: "relative",
	},
	paper2: {
		width: "80vw",
		maxWidth: "400px",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		position: "relative",
	},
	container: {
		paddingTop: "12px",
		paddingBottom: "12px",
		height: "calc(100vh - 72px)",
		width: "100vw",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	record: {
		width: "95%",
		height: 60,
		display: "flex",
		alignItems: "center",
		/*position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,*/
		margin: "-10px 10px 10px 10px",
	},
	record1: {
		width: "95%",
		display: "flex",
		alignItems: "center",
		margin: 10,
	},
	logOut: {
		display: "flex",
	},
	messagesBody: {
		width: "calc( 100% - 20px )",
		height: "80vh",
		margin: 10,
		overflowY: "scroll",
		height: "calc( 100% - 80px )",
	},
	message: {
		padding: 10,
		display: "flex",
		justifyContent: "space-between",
	},
};

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			name: "",
			text: "",
		};

		this.send = this.send.bind(this);

		this.endRef = null;
	}

	logout = () => {
		this.setState({ text: "", name: "" });
		this.context.change({ logged: false, user: {} });
	};

	send(msg) {
		if (this.state.text.trim().length > 0) {
			socket.emit("msg", {
				usr_id: this.context.user.id ?? 1,
				content: this.state.text,
			});
		}
	}

	scroll() {
		if (this.endRef) {
			this.endRef.scrollIntoView({ behavior: "smooth" });
		}
	}

	setName() {
		localStorage.setItem("userName", this.state._name);
		this.setState({ name: this.state._name, _name: "" });
	}

	componentWillMount() {
		this.scroll();
		socket.emit("init");
		socket.on("infos", (messages) => {
			this.setState({ messages });
		});
		socket.on("msg", (msg) => {
			this.setState((prevState) => ({
				messages: [
					...prevState.messages,
					[msg].map((e) => ({ ...e, name: e.user.username }))[0],
				],
				text: "",
			}));
			this.scroll();
		});
	}

	componentWillUnmount() {
		socket.off("msg");
		socket.off("infos");
		socket.off("msg");
	}

	render() {
		window.ii = this.state.messages;
		return (
			<div style={styles.container}>
				{!this.context.logged ? <Redirect to="/login" /> : ""}
				<div style={{ height: "100%" }}>
					<div
						className="chat-inner"
						style={{ display: "flex", justifyContent: "space-between" }}
					>
						<Typography variant="h4" style={{ display: "flex" }} gutterBottom>
							Chat
						</Typography>
						<div>
							<Button
								onClick={this.logout}
								color="secondary"
								label="Log Out"
								variant="contained"
								disabled={!this.context.logged}
								/*style={{padding:"0px 16px"}}*/
							>
								Log Out
							</Button>
						</div>
					</div>
					<Paper style={styles.paper} elevation={2}>
						<Paper style={styles.messagesBody}>
							{this.state.messages.map((el, i) => (
								<div style={styles.message} key={i}>
									<span>
										<strong>{el.name ?? el.user.username} : </strong>
										{el.message}
									</span>
									<sub>{el.date.time}</sub>
								</div>
							))}
							<div
								style={{ float: "left", clear: "both" }}
								ref={(e) => (this.endRef = e)}
							/>
						</Paper>
						<div style={styles.record}>
							<TextField
								id="input"
								value={this.state.text}
								onChange={(ev) => {
									this.setState({ text: ev.target.value });
									this.scroll();
								}}
								onKeyPress={(event) => {
									if (event.which === 13) {
										event.preventDefault();
										this.send();
									}
								}}
								label="Full width"
								fullWidth={true}
							/>
							<IconButton
								onClick={this.send}
								ref="send"
								id="btn"
								className="micBtn"
								style={styles.MicBtn}
							>
								<Send />
							</IconButton>
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

Chat.contextType = MainContext;

export default Chat;
