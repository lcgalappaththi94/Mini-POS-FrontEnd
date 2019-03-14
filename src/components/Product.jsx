import React, {Component} from 'react';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
        };
        this.renderAvailability = this.renderAvailability.bind(this);
    }

    renderAvailability() {
        if (this.state.product.availability > 0) {
            return (<React.Fragment>
                <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '20%'}}><b>Rs {this.state.product.unitPrice}</b></span>
                <span className="badge badge-success badge-pill"
                      style={{fontSize: 14, width: '25%'}}><b>Available ({this.state.product.availability})</b></span>
                <input type="button" className="btn btn-sm btn-secondary" onClick={() => this.props.onAdd(this.state.product)} value="Add To Order"/>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '20%'}}><b>Rs {this.state.product.unitPrice}</b></span>
                <span className="badge badge-danger badge-pill" style={{fontSize: 14, width: '25%'}}><b>Not Available</b></span>
                <input type="button" className="btn btn-sm btn-secondary" onClick={() => this.props.onAdd(this.state.product)} value="Add To Order" disabled/>
            </React.Fragment>)
        }
    }

    render() {
        return (
            <React.Fragment>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span style={{width: '25%'}}>{this.state.product.name}</span>
                    {this.renderAvailability()}
                </li>
            </React.Fragment>
        );
    }
}

export default Product;