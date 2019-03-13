import React, {Component} from 'react';

class NotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <div style={{background: "#d2e7ea"}} className="container">
                    <h1 style={{color: 'red'}} className="text-center pt-5">Cake Shop POS System</h1>
                    <div id="login-row" className="row justify-content-center align-items-center">
                        <div id="login-column" className="col-md-6">
                            <div id="login-box" className="col-md-12">
                                <div className="form-group">
                                    <h2 className="text-center form-group" style={{color: 'black'}}>Not Found (404) !!!</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default NotFound;