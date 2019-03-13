import React, {Component} from 'react';
import Products from './Products';
import OrderItems from './OrderItems';
import Modal from 'react-modal';

Modal.setAppElement('#root');

class ReadMoreModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            queriedProducts: [],
            orderItems: [],
            orderId: this.props.orderId
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.onChangeUpdateState = this.onChangeUpdateState.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleIncreaseItemCount = this.handleIncreaseItemCount.bind(this);
        this.handleDecreaseItemCount = this.handleDecreaseItemCount.bind(this);
        this.handleAddToOrder = this.handleAddToOrder.bind(this);
    }

    handleAddToOrder(product) {
        console.log("add order item", product.id);
        let orderList = [...this.state.orderItems];
        let newOrderItem = {
            "id": product.id,
            "name": product.name,
            "unitPrice": product.unitPrice,
            "availability": product.availability - 1,
            "order_product": {
                "numItems": 1,
                "productId": product.id,
                "orderId": this.state.orderId
            }
        };
        let payload = {availability: product.availability - 1};
        fetch("http://localhost:8081/orders/" + this.state.orderId + "/products/" + product.id, {
            method: 'POST', headers: {
                'Content-Type': ' application/json'
            }, body: JSON.stringify(payload)
        }).then(res => res.json())
            .then((result) => {
                    if (result.orderId) {
                        orderList.push(newOrderItem);
                        this.setState({orderItems: orderList});
                    }
                }, (error) => {
                    console.log("Error occurred while adding product to order", error);
                    alert("Error occurred while adding product to order");
                }
            );
    }

    handleRemoveItem(productId, currentAmount, available) {
        console.log("remove order item", productId);
        let payload = {availability: currentAmount + available};
        fetch("http://localhost:8081/orders/" + this.state.orderId + "/products/" + productId, {
            method: 'DELETE', headers: {
                'Content-Type': ' application/json'
            }, body: JSON.stringify(payload)
        }).then(res => res.json())
            .then((result) => {
                    if (result.productId) {
                        const orderItems = this.state.orderItems.filter(orderItem => orderItem.id !== productId);
                        this.setState({orderItems: orderItems});
                    }
                }, (error) => {
                    console.log("Error occurred while removing product from order", error);
                    alert("Error occurred while removing product from order");
                }
            );
    }

    handleIncreaseItemCount(productId, currentAmount, available) {
        if (available > 0) {
            let orderList = [...this.state.orderItems];
            let payload = {numItems: currentAmount + 1, availability: available - 1};
            fetch("http://localhost:8081/orders/" + this.state.orderId + "/products/" + productId, {
                method: 'PATCH', headers: {
                    'Content-Type': ' application/json'
                }, body: JSON.stringify(payload)
            }).then(res => res.json())
                .then((result) => {
                        if (result.numItems) {
                            const orderItem = this.state.orderItems.filter(orderItem => orderItem.id === productId)[0];
                            const index = orderList.indexOf(orderItem);
                            orderList[index] = {...orderItem};
                            orderList[index].order_product.numItems++;
                            orderList[index].availability--;
                            this.setState({orderItems: orderList});
                        }
                    }, (error) => {
                        console.log("Error occurred while incrementing product", error);
                        alert("Error occurred while incrementing product");
                    }
                );
            console.log("increase order item", productId);
        }
    }

    handleDecreaseItemCount(productId, currentAmount, available) {
        if (currentAmount - 1 >= 1) {
            let orderList = [...this.state.orderItems];
            let payload = {numItems: currentAmount - 1, availability: available + 1};
            fetch("http://localhost:8081/orders/" + this.state.orderId + "/products/" + productId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': ' application/json'
                }, body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then((result) => {
                        if (result.numItems) {
                            const orderItem = this.state.orderItems.filter(orderItem => orderItem.id === productId)[0];
                            const index = orderList.indexOf(orderItem);
                            orderList[index] = {...orderItem};
                            orderList[index].order_product.numItems--;
                            orderList[index].availability++;
                            this.setState({orderItems: orderList});
                        }
                    }, (error) => {
                        console.log("Error occurred while decreasing product", error);
                        alert("Error occurred while decreasing product");
                    }
                );
            console.log("decrease order item", productId);
        }
    }

    componentWillMount() {
        fetch("http://localhost:8081/orders/" + this.state.orderId, {method: 'GET'})
            .then(res => res.json())
            .then((result) => {
                    this.setState({modalIsOpen: true, orderItems: result.products});
                }, (error) => {
                    console.log("Error occurred while fetching order details", error);
                    alert("Error occurred while fetching order details");
                }
            );
    }

    onChangeUpdateState(event) {
        if (event.target.value.length > 0) {
            fetch("http://localhost:8081/product/" + event.target.value, {method: 'GET'})
                .then(res => res.json())
                .then((result) => {
                        this.setState({queriedProducts: result});
                    }, (error) => {
                        console.log("Error occurred while querying products", error);
                        alert("Error occurred while querying products");
                    }
                );
        } else {
            this.setState({queriedProducts: []});
        }
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    renderAddNewProducts(open) {
        if (open) {
            return (<React.Fragment><h3>Add New Products</h3>
                <input type="text" className="form-control" name="query" onKeyUp={this.onChangeUpdateState} placeholder="Search products Here"
                       autoComplete="off"/>
                <Products products={this.state.queriedProducts} onAdd={this.handleAddToOrder}/>
                <hr/>
            </React.Fragment>);
        }
    }

    renderButtons(open) {
        if (open) {
            return (<React.Fragment>
                <button type="button" className="btn btn-danger" onClick={() => this.props.onDeleteOrder(this.state.orderId)}><b>Delete Order</b></button>
                <button type="button" className="btn btn-info" onClick={() => this.props.onCloseOrder(this.state.orderId)}><b>Close Order/Window</b></button>
            </React.Fragment>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal} className="Model"
                       contentLabel="Order Modal" style={{width: '100%'}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order Details of Order <span className="badge badge-primary"
                                                                                         style={{fontSize: 16}}>#{this.state.orderId}</span></h5>
                                <button type="button" style={{color: 'red'}} className="close" onClick={() => this.props.onClose()} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.renderAddNewProducts(this.props.open)}
                                <OrderItems orderItems={this.state.orderItems}
                                            onDelete={this.handleRemoveItem}
                                            onIncrease={this.handleIncreaseItemCount}
                                            onDecrease={this.handleDecreaseItemCount} open={this.props.open}/>
                                <h3 style={{marginTop: 10}}><b><i>Total: <span
                                    className="badge badge-dark"> Rs {this.props.calculateTotal(this.state.orderItems)}</span></i></b>
                                </h3>
                            </div>
                            <div className="modal-footer">
                                {this.renderButtons(this.props.open)}
                                <button type="button" className="btn btn-secondary" onClick={() => this.props.onClose(this.state.orderId)}><b>Close Window</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ReadMoreModal;