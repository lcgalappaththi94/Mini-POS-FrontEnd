import React, {Component} from 'react';
import SubTotal from './SubTotal';
import IncrementDecrementButtons from './IncrementDecrementButtons';
import ItemAvailability from './ItemAvailability';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {confirmDelete: false};
        this.confirmDelete = this.confirmDelete.bind(this);
        this.cancelConfirmDelete = this.cancelConfirmDelete.bind(this);
    }

    confirmDelete() {
        console.log("confirm delete");
        this.setState({confirmDelete: true});
    }

    cancelConfirmDelete() {
        console.log("cancel confirm delete");
        this.setState({confirmDelete: false});
    }

    renderActionButtons() {
        if (this.props.open) {
            return (<React.Fragment>
                <IncrementDecrementButtons orderItem={this.props.orderItem} onIncrease={this.props.onIncrease} onDecrease={this.props.onDecrease}/>
                <SubTotal unitPrice={this.props.orderItem.unitPrice} numItems={this.props.orderItem.order_product.numItems}/>
                <button type="button" style={{color: 'red'}} onClick={this.confirmDelete} className='close'>
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
        if (this.state.confirmDelete) {
            return (
                <React.Fragment>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span style={{width: '20%'}}><b>{this.props.orderItem.name}</b></span>
                        <div style={{color: 'red', width: '80%'}}>
                            <b>Do you want to delete this item? </b>
                            <input style={{marginLeft: 10, marginRight: 10}} type="button" className="btn btn-sm btn-danger"
                                   onClick={() => this.props.onDelete(this.props.orderItem.id, this.props.orderItem.order_product.numItems, this.props.orderItem.availability)}
                                   value="Yes"/>
                            <input style={{marginLeft: 10, marginRight: 10}} type="button" className="btn btn-sm btn-success" onClick={this.cancelConfirmDelete} value="No"/>
                        </div>
                    </li>
                </React.Fragment>
            );
        } else {
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
}

export default OrderItem;