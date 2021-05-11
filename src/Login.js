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
import { Redirect } from "react-router-dom";
import { MainContext } from "./context";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { withStyles } from "@material-ui/core/styles";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				NonozgYtb
			</Link>{" "}
			{new Date().getFullYear() + "."}
		</Typography>
	);
}

export { Copyright };

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
		};

		$("#_user").focus();
	}
	send = (ev = false) => {
		this.setState((pre) => ({
			_user_error: pre._user.trim().length < 1 ? "Obligatoire" : "",
			_mdp_error: pre._mdp.trim().length < 1 ? "Obligatoire" : "",
		}));
		if (this.state._user.trim().length < 1) {
			$("#_user").focus();
			return;
		}
		if (this.state._mdp.trim().length < 1) {
			$("#_mdp").focus();
			return;
		}
		this.setState({ _mdp: "" });
		fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({
				name: this.state._user,
				pass: this.state._mdp,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		})
			.then((e) => e.json())
			.then((e) => {
				if (e.verify) {
					this.context.change({ user: e.data, logged: true });
				} else {
					this.setState((pre) => ({
						_user_error: "Mauvais identifiants",
						_mdp_error: "Mauvais identifiants",
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
							Login
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
								label="Username ou Email"
								error={!!this.state._user_error}
								helperText={this.state._user_error}
								name="text"
								autoComplete="email"
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
								error={!!this.state._mdp_error}
								helperText={this.state._mdp_error}
								name="password"
								label="Mot de passe"
								type="password"
								id="_mdp"
								autoComplete="current-password"
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
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Remember me"
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
									<Link href="#" variant="body2">
										{"T'a pas de compte, crée en toi un !"}
									</Link>
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
