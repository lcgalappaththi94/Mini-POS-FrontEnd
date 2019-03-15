import React, {Component} from 'react';
import SubTotal from './SubTotal';
import IncrementDecrementButtons from './IncrementDecrementButtons';
import ItemAvailability from './ItemAvailability';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderActionButtons() {
        if (this.props.open) {
            return (<React.Fragment>
                <IncrementDecrementButtons orderItem={this.props.orderItem} onIncrease={this.props.onIncrease} onDecrease={this.props.onDecrease}/>
                <SubTotal unitPrice={this.props.orderItem.unitPrice} numItems={this.props.orderItem.order_product.numItems}/>
                <button type="button" style={{color: 'red'}}
                        onClick={() => this.props.onDelete(this.props.orderItem.id, this.props.orderItem.order_product.numItems, this.props.orderItem.availability)}
                        className='close'>
                    <span style={{fontSize: 30}}>&times;</span>
                </button>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-primary badge-pill"
                      style={{fontSize: 14, width: '10%'}}><b> {this.props.orderItem.order_product.numItems}</b></span>
                <SubTotal unitPrice={this.props.orderItem.unitPrice} numItems={this.props.orderItem.order_product.numItems}/>
            </React.Fragment>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span style={{width: '20%'}}><b>{this.props.orderItem.name}</b></span>
                    <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '15%'}}><b>Rs {this.props.orderItem.unitPrice}</b></span>
                    <ItemAvailability available={this.props.orderItem.availability}/>
                    {this.renderActionButtons()}
                </li>
            </React.Fragment>
        );
    }
}

export default OrderItem;