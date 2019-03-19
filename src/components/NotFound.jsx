import React, {Component} from 'react';
import Title from "./Title";
import './Components.css';

class NotFound extends Component {
    constructor(props) {
        super(props);
        document.body.style.overflow = 'hidden';
    }

    render() {
        return (
            <React.Fragment>
                <div className="container component">
                    <Title/>
                    <h2 className="text-center form-group" style={{color: 'black'}}>Page Not Found (404) !!!</h2>
                    <hr/>
                    <a className="form-group btn btn-success btn-md" href="/" style={{marginLeft: '45%'}}>Back To Home</a>
                    <br/>
                </div>
            </React.Fragment>
        );
    }
}

export default NotFound;