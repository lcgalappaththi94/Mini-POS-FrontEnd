import React from "react"
import {Route, Switch} from "react-router-dom"
import Login from "./components/Login"
import Logout from "./components/Logout"
import SignUp from "./components/SignUp"
import NotFound from "./components/NotFound"
import NavBar from "./components/NavBar"
import App from './App';

const Routes = () => {
    return (
        <div>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/signUp" component={SignUp}/>
                <Route path="/logout" component={Logout}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    );
};

export default Routes