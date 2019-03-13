import React, {Component} from 'react';

class NavBar extends Component {
    renderItems() {
        if (localStorage.getItem('userData')) {
            return (<React.Fragment>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">Cake Shop</a>
                    <span className="navbar-brand mb-0 h1" style={{color: 'green'}}>
                        <b>Hi, {JSON.parse(localStorage.getItem('userData')).name}</b>
                    </span>
                    <a className="navbar-brand" href="/logout">Logout</a>
                </nav>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">Cake Shop</a>
                </nav>
            </React.Fragment>);
        }
    }

    render() {
        return (this.renderItems());
    }
}

export default NavBar;