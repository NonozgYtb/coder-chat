import React, { Component } from "react";
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Link,
	Paper,
	Box,
	Grid,
	Typography,
} from "@material-ui/core";
import * as $ from "jquery";
import { Redirect, Link as RouterLink } from "react-router-dom";
import { MainContext } from "./context";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { withStyles } from "@material-ui/core/styles";
import { Copyright } from "./Login";

const styles = (theme) => ({
	root: {
		height: "calc(100% - 48px)",
	},
	image: {
		backgroundImage: "url(https://source.unsplash.com/random)",
		backgroundRepeat: "no-repeat",
		backgroundColor:
			theme.palette.type === "light"
				? theme.palette.grey[50]
				: theme.palette.grey[900],
		backgroundSize: "cover",
		backgroundPosition: "center",
	},
	paper: {
		margin: theme.spacing(0, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	part: {
		alignItems: "center",
		display: "flex",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			_user: " ",
			_mdp: " ",
			_mdp_verif: " ",
			_email: " ",
			_user_error: "",
			_mdp_error: "",
			_email_error: "",
		};

		$("#_user").focus();
	}
	send = (ev = false) => {
		this.setState((pre) => ({
			_user_error: pre._user.length < 1 ? "Obligatoire" : "",
			_mdp_error: pre._mdp.length < 1 ? "Obligatoire" : "",
			_email_error: pre._email.length < 1 ? "Obligatoire" : "",
		}));
		if (this.state._user.trim().length < 1) {
			$("#_user").focus();
			return;
		}
		if (this.state._mdp.trim().length < 1) {
			$("#_mdp").focus();
			return;
		}
		if (this.state._mdp_verif.trim().length < 1) {
			$("#_mdp_verif").focus();
			return;
		}
		if (this.state._email.trim().length < 1) {
			$("#_email").focus();
			return;
		}
		this.setState({ _mdp: "" });
		fetch("/api/signin", {
			method: "POST",
			body: JSON.stringify({
				username: this.state._user,
				pass: this.state._mdp,
				email: this.state._email,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		})
			.then((e) => e.json())
			.then((e) => {
				if (e.work) {
					this.context.change({ user: e.data, logged: true });
				} else if (e.error == "alred_us") {
					this.setState((pre) => ({
						_user_error: "Déja utilisé",
						_email_error: "Déja utilisé",
					}));
				}
			});
	};
	render() {
		const { classes } = this.props;
		return (
			<Grid container component="main" className={classes.root}>
				{this.context.logged ? <Redirect to="/chat" /> : ""}
				<CssBaseline />
				<Grid item xs={false} sm={4} md={7} className={classes.image} />
				<Grid
					item
					xs={12}
					sm={8}
					md={5}
					className={classes.part}
					component={Paper}
					elevation={6}
					square
				>
					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<form
							className={classes.form}
							onSubmit={(e) => {
								e.preventDefault();
								this.send();
							}}
						>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="_user"
								label="Username"
								error={!!this.state._user_error}
								helperText={this.state._user_error}
								name="text"
								autoComplete="username"
								autoFocus
								value={this.state._user.trim()}
								onChange={(ev) => {
									this.setState({ _user: ev.target.value.trim() });
								}}
								onKeyPress={(event) => {
									if (event.which === 13) {
										event.preventDefault();
										this.send();
									}
								}}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="_email"
								label="Email"
								error={!!this.state._email_error}
								helperText={this.state._email_error}
								name="email"
								autoComplete="email"
								autoFocus
								value={this.state._email.trim()}
								onChange={(ev) => {
									this.setState({ _email: ev.target.value.trim() });
								}}
								onKeyPress={(event) => {
									if (event.which === 13) {
										event.preventDefault();
										this.send();
									}
								}}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								error={
									!!this.state._mdp_error ||
									(this.state._mdp.trim().length < 6 &&
										this.state._mdp.trim().length > 0)
								}
								helperText={
									this.state._mdp.trim().length < 6
										? "La longueur du Mdp doit supérieur à 6."
										: this.state._mdp_error
								}
								name="password"
								label="Mot de passe"
								type="password"
								id="_mdp"
								autoComplete="new-password"
								value={this.state._mdp.trim()}
								onChange={(ev) => {
									this.setState({ _mdp: ev.target.value });
								}}
								onKeyPress={(event) => {
									if (event.which === 13) {
										event.preventDefault();
										this.send();
									}
								}}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								error={this.state._mdp_verif.trim() != this.state._mdp.trim()}
								helperText={
									this.state._mdp_verif.trim() != this.state._mdp.trim() &&
									"Les 2 Mdp doivent être les mêmes !"
								}
								name="password"
								label="Confirmation du Mdp"
								type="password"
								id="_mdp_verif"
								autoComplete="password"
								value={this.state._mdp_verif.trim()}
								onChange={(ev) => {
									this.setState({ _mdp_verif: ev.target.value });
								}}
								onKeyPress={(event) => {
									if (event.which === 13) {
										event.preventDefault();
										this.send();
									}
								}}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={(e) => {
									e.preventDefault();
									this.send();
								}}
								onSubmit={(e) => {
									e.preventDefault();
									this.send();
								}}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item>
									<RouterLink to="/login" variant="body2">
										{"Déja un compte : Connecte toi !"}
									</RouterLink>
								</Grid>
							</Grid>
							<Box mt={2}>
								<Copyright />
							</Box>
						</form>
					</div>
				</Grid>
			</Grid>
		);
	}
}
Login.contextType = MainContext;
export default withStyles(styles, { withTheme: true })(Login);
