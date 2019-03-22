import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import Title from './Title';
import './Components.css';
import NetworkCall from '../network';
import {NotificationManager} from 'react-notifications';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            redirect: '',
            notificationType: '',
            notificationTitle: '',
            notificationMessage: ''
        };
        this.login = this.login.bind(this);
        this.onChangeUpdateState = this.onChangeUpdateState.bind(this);
        this.showNewUserInterface = this.showNewUserInterface.bind(this);
        document.body.style.overflow = 'hidden';
    }

    showNewUserInterface() {
        this.setState({redirect: '/signUp'});
    }

    login() {
        if (this.state.username && this.state.password) {
            NetworkCall("/auth", "POST", {
                'Content-Type': ' application/json'
            }, JSON.stringify(this.state))
                .then(res => res.json())
                .then((result) => {
                        if (result.id) {
                            console.log('Login success');
                            NotificationManager.success('Welcome to the CakeShop', 'Login Successful');
                            localStorage.setItem('userData', JSON.stringify(result));
                            this.setState({redirect: '/'});
                        } else {
                            console.log("Login Failed!!!");
                            NotificationManager.error('Wrong Credentials', 'Login Failed');
                        }
                    }, (error) => {
                        this.setState({redirect: '/login', error});
                        NotificationManager.error('Wrong Credentials', 'Login Failed');
                    }
                )
        }
    }

    onChangeUpdateState(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    formOnSubmit(e) {
        e.preventDefault();
        return false;
    }

    render() {
        if (this.state.redirect !== '') {
            return (<React.Fragment>
                <Redirect to={this.state.redirect}/>
            </React.Fragment>);
        } else {
            return (
                <React.Fragment>
                    <div className="container component">
                        <Title/>
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <form id="login-form" className="form" onSubmit={this.formOnSubmit}>
                                        <h3 className="text-center">Login Here</h3>
                                        <div className="form-group">
                                            <label htmlFor="username">Username:</label><br/>
                                            <input type="text" name="username" id="username" onKeyUp={this.onChangeUpdateState} placeholder="Enter Username"
                                                   className="form-control" autoComplete="off"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password:</label><br/>
                                            <input type="password" name="password" id="password" onKeyUp={this.onChangeUpdateState}
                                                   placeholder="Enter Password"
                                                   className="form-control" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" onClick={this.login} style={{marginRight: 20}} name="submit" className="btn btn-primary btn-lg"
                                                   value="Login Here"/>
                                            <input type="button" onClick={this.showNewUserInterface} className="btn btn-success btn-lg"
                                                   value="New Users Register Here"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Login;