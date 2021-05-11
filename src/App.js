import React, { Component } from "react";
import Nav from "./Nav";
import Chat from "./Chat";
import Login from "./Login";
import Signin from "./Signin";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MainContext } from "./context";
import _merge from "lodash/merge";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			MainContext: {
				user: {
					id: "undefined",
					name: "undefined",
				},
				logged: false,
				change: (e) =>
					this.setState(({ MainContext }) => ({
						MainContext: _merge(MainContext, e),
					})),
			},
		};
	}
	render() {
		return (
			<>
				<MainContext.Provider value={this.state.MainContext}>
					<Router>
						<Nav />
						<Switch>
							<Route from="/login" render={(e) => <Login {...e} />} />
							<Route from="/signin" render={(e) => <Signin {...e} />} />
							<Route from="/" render={(e) => <Chat {...e} />} />
							{/*
								<Route from="/" render={(e) => <MainContext.Consumer>{value=><Login {...e} contex={value} />}</MainContext.Consumer>} />
							*/}
						</Switch>
					</Router>
				</MainContext.Provider>
			</>
		);
	}
}
