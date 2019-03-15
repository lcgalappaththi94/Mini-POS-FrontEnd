import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import Title from './Title';
import './Components.css';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: JSON.parse(localStorage.getItem('userData')).name,
            redirect: ''
        };
        this.logout = this.logout.bind(this);
        this.cancelLogout = this.cancelLogout.bind(this);
    }

    logout() {
        console.log("logout");
        localStorage.removeItem('userData');
        this.setState({redirect: '/'});
    }

    cancelLogout() {
        console.log("cancel logout");
        this.setState({redirect: '/'});
    }

    render() {
        if (this.state.redirect !== '') {
            return (<Redirect to={this.state.redirect}/>);
        } else {
            return (
                <React.Fragment>
                    <div style={{marginTop: '2%'}} className="container component">
                        <Title/>
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <div className="form-group">
                                        <h3 className="text-center form-group">Do you really want to logout <span
                                            style={{color: 'blue'}}><br/>{this.state.name}</span> ?</h3>
                                        <input type="button" style={{marginLeft: 160}} onClick={this.logout} className="btn btn-danger btn-lg"
                                               value="Yes"/>
                                        <input type="button" style={{margin: 10}} onClick={this.cancelLogout} className="btn btn-success btn-lg"
                                               value="No"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Logout;