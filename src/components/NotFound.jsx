import React, {Component} from 'react';
import Title from "./Title";
import './Components.css';

class NotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="container component">
                    <Title/>
                    <h2 className="text-center form-group" style={{color: 'black'}}>Page Not Found (404) !!!</h2>
                    <br/>
                </div>
            </React.Fragment>
        );
    }
}

export default NotFound;