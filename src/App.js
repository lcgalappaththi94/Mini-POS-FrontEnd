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
                <div className="container">
                    <h2>Current Orders of
                        <span className="badge m-2 badge-primary">{JSON.parse(localStorage.getItem('userData')).name}</span>
                    </h2>
                    <Orders/>
                </div>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <div className="container">
                    <Login/>
                </div>
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
        return (this.renderSelect());
    }
}

export default App;
