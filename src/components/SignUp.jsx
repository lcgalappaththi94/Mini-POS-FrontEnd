import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import Title from './Title';
import './Components.css';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    addNotification(notificationType, title, message) {
        let notification = {
            title: title,
            message: message,
            type: notificationType,
            insert: "top",
            container: "top-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {duration: 2000},
            dismissable: {click: true}
        };
        this.notificationDOMRef.current.addNotification(notification);
    }

    backToLogin() {
        this.setState({redirect: '/login'});
    }

    signUp() {
        if (this.state.name && this.state.username && this.state.password) {
            fetch("http://localhost:8081/user", {
                method: 'POST',
                headers: {
                    'Content-Type': ' application/json'
                },
                body: JSON.stringify(this.state)
            })
                .then(res => res.json())
                .then((result) => {
                        if (result.id > 0) {
                            console.log('signed up');
                            this.setState({redirect: '/login'});
                        } else {
                            console.log("Sign Up Failed!!!");
                            this.addNotification('danger', 'Error Occurred', 'Sign Up Failed');
                        }
                    }, (error) => {
                        this.setState({redirect: '/signUp', error});
                        this.addNotification('danger', 'Error Occurred', 'Sign Up Failed');
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
                        <ReactNotification ref={this.notificationDOMRef}/>
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