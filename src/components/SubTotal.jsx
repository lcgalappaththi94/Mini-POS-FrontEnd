import React, {Component} from 'react';

class SubTotal extends Component {
    render() {
        return (
            <React.Fragment>
                <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '25%'}}>
                    <b>
                        <span style={{color: 'yellow'}}>Rs {this.props.unitPrice} x {this.props.numItems} </span>
                        = Rs {this.props.numItems * this.props.unitPrice}
                    </b>
                </span>
            </React.Fragment>
        );
    }
}

export default SubTotal;