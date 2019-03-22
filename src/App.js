import React, {Component} from 'react';
import Login from "./components/Login";
import Orders from "./components/Orders";
import './components/Components.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validCookie: false
        };
        document.body.style.overflow = 'hidden';
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
                <div className="container component">
                    {this.renderSelect()}
                </div>
            </React.Fragment>
        );
    }
}

export default App;
