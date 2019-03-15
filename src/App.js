import React, {Component} from 'react';
import './App.css';
import Login from "./components/Login"
import Orders from "./components/Orders"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validCookie: false
        };
    }

    renderSelect() {
        if (localStorage.getItem('userData')) {
            return (<React.Fragment>
                <Orders/>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <Login/>
            </React.Fragment>);
        }
    }


    componentWillMount() {
        if (localStorage.getItem('userData')) {
            this.setState({validCookie: true});
        } else {
            this.setState({validCookie: false});
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="container App-header">
                    {this.renderSelect()}
                </div>
            </React.Fragment>
        );
    }
}

export default App;
