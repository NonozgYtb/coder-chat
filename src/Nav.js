import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	MenuItem,
	Menu,
	Button,
	withStyles,
	useMediaQuery,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
const NavConfig = [
	{
		title: "Accueil",
		url: "/",
	},
	{
		title: "Contact",
		url: "/contact",
	},
	{
		title: "About",
		url: "/about",
	},
];

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		[theme.breakpoints.down("xs")]: {
			flexGrow: 1,
		},
		paddingRight: "16px",
		cursor: "pointer",
	},
	headerOptions: {
		display: "flex",
		flex: 1,
	},
}));

const DesktopButton = withStyles({
	root: {
		fontSize: "1rem",
	},
	label: {
		marginBottom: "-3.5px",
		color: "white",
	},
})(Button);

const Nav = (props) => {
	const { history } = props;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClick = (pageURL) => {
		history.push(pageURL);
		setAnchorEl(null);
	};

	const handleButtonClick = (pageURL) => {
		history.push(pageURL);
	};

	const menuItems = [
		{
			menuTitle: "Home",
			pageURL: "/",
		},
		{
			menuTitle: "Contact",
			pageURL: "/contact",
		},
		{
			menuTitle: "About",
			pageURL: "/about",
		},
	];
	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar variant="dense">
					<Typography
						variant="h6"
						onClick={() => handleButtonClick("/")}
						className={classes.title}
					>
						Iris
					</Typography>
					{isMobile ? (
						<>
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="menu"
								onClick={handleMenu}
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={open}
								onClose={() => setAnchorEl(null)}
							>
								{NavConfig.map(({ title, url }, i) => (
									<MenuItem key={i} onClick={() => handleMenuClick(url)}>
										{title}
									</MenuItem>
								))}
							</Menu>
						</>
					) : (
						<div className={classes.headerOptions}>
							{NavConfig.map(({ title, url }, i) => (
								<DesktopButton
									key={i}
									variant="text"
									onClick={() => handleButtonClick(url)}
								>
									{title}
								</DesktopButton>
							))}
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default withRouter(Nav);
