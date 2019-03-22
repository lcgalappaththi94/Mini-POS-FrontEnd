import React, {Component} from 'react';

class Order extends Component {
    state = {};

    renderOpenClose(open) {
        if (open === 1) {
            return (<span className="badge badge-success"> Open </span>);
        } else {
            return (<span className="badge badge-danger"> Closed </span>);
        }
    }

    renderDeleteButton(open) {
        if (open === 1) {
            return (<button type="button" className="btn btn-md btn-danger" onClick={() => this.props.onDelete(this.props.order.id, this.props.order.products)}
                            style={{margin: 10}}><b>Delete Order</b></button>);
        } else {
            return (<button type="button" className="btn btn-md btn-danger" onClick={() => this.props.onDelete(this.props.order.id, this.props.order.products)}
                            style={{margin: 10}} disabled><b>Delete Order</b></button>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="card col-lg-4 col-md-4 col-sm-6 col-xs-6" style={{width: '18rem', marginTop: 5, marginBottom: 5}}>
                    <div className="card-body">

                        <div className='row'>
                            <h5 className="card-title col-6"><i><b>Order ID</b></i></h5>
                            <h5 className="card-title col-2"><i><b><span className="badge badge-primary" style={{fontSize: 16}}>{this.props.order.id}</span></b></i>
                            </h5>
                            <h5 className="card-title col-4"><i><b>{this.renderOpenClose(this.props.open)}</b></i></h5>
                        </div>

                        <div className='row'>
                            <h5 className="card-text col-6"><i>No of Items</i></h5>
                            <h5 className="card-text col-3"><i><b><span
                                className="badge badge-warning">{this.props.order.products.length} Item(s)</span></b></i></h5>
                        </div>

                        <div className='row'>
                            <h5 className="card-text col-6"><i>Total</i></h5>
                            <h5 className="card-text col-6"><i><b><span
                                className="badge badge-dark col-8">Rs {this.props.calculateTotal(this.props.order.products)}</span></b></i></h5>
                        </div>

                        <button type="button" className="btn btn-md btn-secondary" onClick={() => this.props.onReadMore(this.props.order.id, this.props.open)}>
                            <b>{this.props.open === 1 ? 'View & Edit' : 'View More'}</b>
                        </button>
                        {this.renderDeleteButton(this.props.open)}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Order;