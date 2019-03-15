import React, {Component} from 'react';

class NavBar extends Component {
    renderItems() {
        if (localStorage.getItem('userData')) {
            return (<React.Fragment>
                <nav className="navbar navbar-dark bg-dark sticky-top">
                    <a className="navbar-brand" href="/" style={{color: '#FF7433'}}>Cake Shop</a>
                    <span className="navbar-brand mb-0 h1" style={{color: '#FF7433'}}>
                        <b>Hi, {JSON.parse(localStorage.getItem('userData')).name}</b>
                    </span>
                    <a className="navbar-brand" href="/logout"><b>Logout</b></a>
                </nav>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" href="/" style={{color: '#FF7433'}}><b>Cake Shop</b></a>
                </nav>
            </React.Fragment>);
        }
    }

    render() {
        return (this.renderItems());
    }
}

export default NavBar;