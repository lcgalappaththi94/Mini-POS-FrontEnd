import React, {Component} from 'react';
import OrderItem from './OrderItem';

class OrderItems extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderOrderItemList() {
        if (this.props.orderItems.length > 0) {
            return (this.props.orderItems.map(orderItem => <OrderItem key={orderItem.id}
                                                                      onIncrease={this.props.onIncrease}
                                                                      onDecrease={this.props.onDecrease}
                                                                      onDelete={this.props.onDelete}
                                                                      orderItem={orderItem} open={this.props.open}/>));
        } else {
            return (<h3><span className="badge badge-danger">There are no items in order yet!!! </span></h3>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3>Current Order <span className="badge badge-warning"> {this.props.orderItems.length} Item(s)</span></h3>
                <ul className="list-group">
                    {this.renderOrderItemList()}
                </ul>
            </React.Fragment>
        );
    }
}

export default OrderItems;