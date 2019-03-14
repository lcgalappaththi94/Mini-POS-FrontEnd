import React, {Component} from 'react';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderActionButtons() {
        if (this.props.open) {
            return (<React.Fragment>
                <div className="btn-group" role="group">
                    <button type="button" style={{color: 'blue'}}
                            onClick={() => this.props.onIncrease(this.props.orderItem.id, this.props.orderItem.order_product.numItems, this.props.orderItem.availability)}
                            className='close'>
                        <span style={{fontSize: 30}}>+</span>
                    </button>
                </div>
                <span className="badge badge-primary badge-pill"
                      style={{fontSize: 14, width: '8%'}}><b>{this.props.orderItem.order_product.numItems}</b></span>
                <div className="btn-group" role="group">
                    <button type="button" style={{color: 'green', marginRight: 10}}
                            onClick={() => this.props.onDecrease(this.props.orderItem.id, this.props.orderItem.order_product.numItems, this.props.orderItem.availability)}
                            className='close'>
                        <span style={{fontSize: 30}}>&minus;</span>
                    </button>
                    <button type="button" style={{color: 'red'}}
                            onClick={() => this.props.onDelete(this.props.orderItem.id, this.props.orderItem.order_product.numItems, this.props.orderItem.availability)}
                            className='close'>
                        <span style={{fontSize: 30}}>&times;</span>
                    </button>
                </div>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-primary badge-pill"
                      style={{fontSize: 14, width: '10%'}}><b> {this.props.orderItem.order_product.numItems}</b></span>
                <span className="badge badge-dark badge-pill"
                      style={{fontSize: 14, width: '25%'}}><b>Rs {this.props.orderItem.order_product.numItems * this.props.orderItem.unitPrice}</b></span>
            </React.Fragment>);
        }
    }

    renderAvailability() {
        if (this.props.open) {
            if (this.props.orderItem.availability > 0) {
                return (<React.Fragment>
                    <span className="badge badge-success badge-pill" style={{fontSize: 14, width: '25%'}}><b>Available ({this.props.orderItem.availability})</b></span>
                </React.Fragment>);
            } else {
                return (<React.Fragment>
                    <span className="badge badge-danger badge-pill" style={{fontSize: 14, width: '25%'}}><b>Not Available</b></span>
                </React.Fragment>)
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span style={{width: '25%'}}>{this.props.orderItem.name}</span>
                    <span className="badge badge-dark badge-pill" style={{fontSize: 14, width: '20%'}}><b>Rs {this.props.orderItem.unitPrice}</b></span>
                    {this.renderAvailability()}
                    {this.renderActionButtons()}
                </li>
            </React.Fragment>
        );
    }
}

export default OrderItem;