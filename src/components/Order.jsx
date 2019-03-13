import React, {Component} from 'react';

class Order extends Component {
    state = {};

    renderOpenClose(open) {
        if (open === 1) {
            return (<span style={{marginLeft: 20}} className="badge badge-success">Open</span>);
        } else {
            return (<span style={{marginLeft: 20}} className="badge badge-danger">Closed</span>);
        }
    }

    renderNumberOfItems() {
        if (this.props.order.products.length > 0) {
            return (<React.Fragment>
                <span className="badge badge-warning">{this.props.order.products.length} Item(s)</span>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <span className="badge badge-danger">No Items</span>
            </React.Fragment>)
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="card col-lg-4 col-md-4 col-sm-4 col-xs-12" style={{width: '18rem', marginTop: 10, marginRight: 10}}>
                    <div className="card-body">
                        <h5 className="card-title"><i><b>Order ID : <span className="badge badge-primary"
                                                                          style={{fontSize: 16}}>{this.props.order.id}</span>
                            {this.renderOpenClose(this.props.open)}
                        </b></i>
                        </h5>
                        <h5 className="card-text"><i>No of Items : <b>{this.renderNumberOfItems()}</b></i></h5>
                        <h5 className="card-text"><i>Total : <b><span
                            className="badge badge-dark">Rs {this.props.calculateTotal(this.props.order.products)}</span></b></i></h5>
                        <button type="button" className="btn btn-md btn-info"
                                onClick={() => this.props.onReadMore(this.props.order.id, this.props.open)}
                                style={{margin: 5}}><b>View or Edit</b></button>
                        <button type="button" className="btn btn-md btn-danger" onClick={() => this.props.onDelete(this.props.order.id)}
                                style={{margin: 5}}><b>Delete Order</b></button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Order;