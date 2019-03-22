import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import Title from './Title';
import './Components.css';
import NetworkCall from "../network";
import {NotificationManager} from 'react-notifications';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            redirect: ''
        };
        this.signUp = this.signUp.bind(this);
        this.backToLogin = this.backToLogin.bind(this);
        this.onChangeUpdateState = this.onChangeUpdateState.bind(this);
        document.body.style.overflow = 'hidden';
    }

    backToLogin() {
        this.setState({redirect: '/login'});
    }

    signUp() {
        if (this.state.name && this.state.username && this.state.password) {
            NetworkCall("/user", "POST", {
                'Content-Type': ' application/json'
            }, JSON.stringify(this.state))
                .then(res => res.json())
                .then((result) => {
                        if (result.id > 0) {
                            console.log('signed up');
                            NotificationManager.success('Welcome to the CakeShop Now You Can Login', 'User Created Successfully');
                            this.setState({redirect: '/login'});
                        } else {
                            console.log("Sign Up Failed!!!");
                            NotificationManager.error('Error Occurred When Creating User', 'Sign Up Failed');
                        }
                    }, (error) => {
                        this.setState({redirect: '/signUp', error});
                        NotificationManager.error('Error Occurred When Creating User', 'Sign Up Failed');
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
            return (<Redirect to={this.state.redirect}/>);
        } else {
            return (
                <React.Fragment>
                    <div className="container component">
                        <Title/>
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <form id="login-form" className="form" onSubmit={this.formOnSubmit}>
                                        <h3 className="text-center">Sign Up Here</h3>
                                        <div className="form-group">
                                            <label htmlFor="name">Name:</label><br/>
                                            <input type="text" name="name" id="name" onKeyUp={this.onChangeUpdateState} placeholder="Enter Name"
                                                   className="form-control" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="username">Username:</label><br/>
                                            <input type="text" name="username" id="username" onKeyUp={this.onChangeUpdateState} placeholder="Enter Username"
                                                   className="form-control" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password:</label><br/>
                                            <input type="password" name="password" id="password" onKeyUp={this.onChangeUpdateState} placeholder="Enter Password"
                                                   className="form-control" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" style={{marginRight: 20}} onClick={this.signUp} className="btn btn-primary btn-lg"
                                                   value="Sign Up Here"/>
                                            <input type="button" style={{marginRight: 20}} onClick={this.backToLogin} className="btn btn-success btn-lg"
                                                   value="Back To Login"/>
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

export default SignUp;