import React, {Component} from 'react';

class ItemAvailability extends Component {
    renderAvailability() {
        if (this.props.available > 0) {
            return (<React.Fragment>
                <span className="badge badge-success badge-pill" style={{fontSize: 14, width: '15%'}}><b>{this.props.available} Available </b></span>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-danger badge-pill" style={{fontSize: 14, width: '15%'}}><b>Not Available</b></span>
            </React.Fragment>)
        }
    }

    render() {
        return (this.renderAvailability());
    }
}

export default ItemAvailability;