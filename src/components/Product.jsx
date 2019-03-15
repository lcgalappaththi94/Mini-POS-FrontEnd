import React, {Component} from 'react';
import ItemAvailability from './ItemAvailability';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderAvailability = this.renderAvailability.bind(this);
    }

    renderAvailability() {
        if (this.props.product.availability > 0) {
            return (<React.Fragment>
                <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '20%'}}><b>Rs {this.props.product.unitPrice}</b></span>
                <ItemAvailability available={this.props.product.availability}/>
                <input type="button" className="btn btn-sm btn-secondary" onClick={() => this.props.onAdd(this.props.product)} value="Add To Order"/>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '20%'}}><b>Rs {this.props.product.unitPrice}</b></span>
                <ItemAvailability available={this.props.product.availability}/>
                <input type="button" className="btn btn-sm btn-secondary" onClick={() => this.props.onAdd(this.props.product)} value="Add To Order" disabled/>
            </React.Fragment>)
        }
    }

    render() {
        return (
            <React.Fragment>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span style={{width: '20%'}}><b>{this.props.product.name}</b></span>
                    {this.renderAvailability()}
                </li>
            </React.Fragment>
        );
    }
}

export default Product;