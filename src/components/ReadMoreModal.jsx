import React, {Component} from 'react';
import Products from './Products';
import OrderItems from './OrderItems';
import Modal from 'react-modal';
import NetworkCall from "../network";
import {NotificationManager} from 'react-notifications';

Modal.setAppElement('#root');

class ReadMoreModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            queriedProducts: [],
            queryString: '',
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

    updateQueriedProductListById(productId, availability) {
        let queriedProductList = [...this.state.queriedProducts];
        const similarProduct = queriedProductList.filter(Product => Product.id === productId)[0];
        const index = queriedProductList.indexOf(similarProduct);
        queriedProductList[index] = {...similarProduct};
        queriedProductList[index].availability = availability;
        this.setState({queriedProducts: queriedProductList});
    }

    updateQueriedProductList(orderProductsList) {
        if (this.state.queriedProducts) {
            orderProductsList.map(product => this.updateQueriedProductListById(product.id, product.availability));
        }
    }

    updateOrderListById(productId, result, count) {
        let orderList = [...this.state.orderItems];
        const orderItem = orderList.filter(orderItem => orderItem.id === productId)[0];
        const index = orderList.indexOf(orderItem);
        orderList[index] = {...orderItem};
        orderList[index].order_product.numItems += count;
        orderList[index].availability = result.availability;
        return orderList;
    }

    handleAddToOrder(product) {
        console.log("add order item", product.id);
        let orderList = [...this.state.orderItems];
        const similarOrderItems = orderList.filter(orderItem => orderItem.id === product.id);
        if (similarOrderItems.length === 0) {
            let itemCount = prompt("Please enter the required quantity of " + product.name + " ( 1-" + product.availability + " )", "1");
            let count = parseInt(itemCount);
            if (itemCount != null) {
                if (count > 0 && count <= product.availability) {
                    let payload = {availability: count};
                    NetworkCall("/orders/" + this.state.orderId + "/products/" + product.id, "POST", {
                        'Content-Type': ' application/json'
                    }, JSON.stringify(payload))
                        .then(res => res.json())
                        .then((result) => {
                                console.log(result);
                                if (typeof result.availability !== 'undefined') {
                                    if (result.availability >= 0) {
                                        console.log("added to order");
                                        let newOrderItem = {
                                            "id": product.id,
                                            "name": product.name,
                                            "unitPrice": product.unitPrice,
                                            "availability": result.availability,
                                            "order_product": {
                                                "numItems": count,
                                                "productId": product.id,
                                                "orderId": this.state.orderId
                                            }
                                        };
                                        orderList.push(newOrderItem);
                                        this.updateQueriedProductListById(product.id, result.availability);
                                        this.setState({orderItems: orderList});
                                        let modalBodyElements = document.getElementById("modalBodyElements");
                                        modalBodyElements.scrollTop = modalBodyElements.scrollHeight;
                                    } else {
                                        NotificationManager.warning("Sorry only " + -1 * result.availability + " " + product.name + " available now.", 'Quantity Warning');
                                        this.updateQueriedProductListById(product.id, -1 * result.availability);
                                    }
                                }
                            }, (error) => {
                                console.log("Error occurred while adding product to order", error);
                                NotificationManager.error('Error occurred while adding product to order', 'Error Occurred');
                            }
                        );
                } else {
                    NotificationManager.warning("Item count for " + product.name + " should be between 1 and " + product.availability, 'Quantity Warning');
                }
            } else {
                console.log("canceled adding product");
            }
        } else {
            NotificationManager.warning(product.name + " is already added to Order\n You can increase or decrease the quantity", 'Item Already Added');
        }
    }

    handleRemoveItem(productId, currentAmount) {
        console.log("remove order item", productId);
        let payload = {availability: currentAmount};
        NetworkCall("/orders/" + this.state.orderId + "/products/" + productId, "DELETE", {
            'Content-Type': ' application/json'
        }, JSON.stringify(payload))
            .then(res => res.json())
            .then((result) => {
                    console.log(result);
                    if (typeof result.availability !== 'undefined') {
                        const orderItems = this.state.orderItems.filter(orderItem => orderItem.id !== productId);
                        this.updateQueriedProductListById(productId, result.availability);
                        this.setState({orderItems: orderItems});
                    }
                }, (error) => {
                    console.log("Error occurred while removing product from order", error);
                    NotificationManager.error('Error occurred while removing product from order', 'Error Occurred');
                }
            );
    }

    handleIncreaseItemCount(productId, currentAmount, available) {
        if (available > 0) {
            let payload = {numItems: currentAmount + 1, availability: 1};
            NetworkCall("/orders/" + this.state.orderId + "/products/" + productId, "PATCH", {
                'Content-Type': ' application/json'
            }, JSON.stringify(payload))
                .then(res => res.json())
                .then((result) => {
                        console.log(result);
                        if (typeof result.availability !== 'undefined') {
                            this.updateQueriedProductListById(productId, result.availability);
                            if (result.availability >= 0) {
                                this.setState({orderItems: this.updateOrderListById(productId, result, 1)});
                            } else {
                                this.setState({orderItems: this.updateOrderListById(productId, result, 0)});
                                NotificationManager.warning("This is the maximum quantity for this item", 'Quantity Warning');
                            }
                        }
                    }, (error) => {
                        console.log("Error occurred while incrementing product", error);
                        NotificationManager.error('Error occurred while incrementing product quantity', 'Error Occurred');
                    }
                );
            console.log("increase order item", productId);
        } else {
            NotificationManager.warning("This is the maximum quantity for this item", 'Quantity Warning');
        }
    }

    handleDecreaseItemCount(productId, currentAmount) {
        if (currentAmount - 1 >= 1) {
            let payload = {numItems: currentAmount - 1, availability: -1};
            NetworkCall("/orders/" + this.state.orderId + "/products/" + productId, "PATCH", {
                'Content-Type': ' application/json'
            }, JSON.stringify(payload))
                .then(res => res.json())
                .then((result) => {
                        console.log(result);
                        if (typeof result.availability !== 'undefined') {
                            this.updateQueriedProductListById(productId, result.availability);
                            this.setState({
                                orderItems: this.updateOrderListById(productId, result, -1)
                            });
                        }
                    }, (error) => {
                        console.log("Error occurred while decreasing product", error);
                        NotificationManager.error('Error occurred while decreasing product quantity', 'Error Occurred');
                    }
                );
            console.log("decrease order item", productId);
        } else {
            NotificationManager.warning("Minimum item quantity is 1.\nIf you want to delete item use button(x)", 'Quantity Warning');
        }
    }

    fetchCurrentOrder() {
        NetworkCall("/orders/" + this.state.orderId, "GET", null, null)
            .then(res => res.json())
            .then((result) => {
                    this.updateQueriedProductList(result.products);
                    this.setState({
                        modalIsOpen: true,
                        orderItems: result.products
                    });
                }, (error) => {
                    console.log("Error occurred while fetching order details", error);
                    NotificationManager.error('Error occurred while fetching order details', 'Error Occurred');
                }
            );
    }

    fetchQueryProducts(query) {
        if (query !== '') {
            NetworkCall("/product/" + query, "GET", null, null)
                .then(res => res.json())
                .then((result) => {
                        this.setState({queriedProducts: result});
                    }, (error) => {
                        console.log("Error occurred while querying products", error);
                        NotificationManager.error('Error occurred while querying products', 'Error Occurred');
                    }
                );
        }
    }

    onChangeUpdateState(event) {
        if (event.target.value.length > 0) {
            this.setState({queryString: event.target.value});
            this.fetchQueryProducts(event.target.value);
            if (this.props.realtime) {
                this.timerQueryProductsFetch = setInterval(() => this.fetchQueryProducts(this.state.queryString), 5000);
            }
        } else {
            this.setState({queryString: '', queriedProducts: []});
            if (this.props.realtime) {
                clearInterval(this.timerQueryProductsFetch);
            }
        }
    }

    afterOpenModal() {
        document.body.style.overflow = 'hidden';
    }

    renderAddNewProducts(open) {
        if (open) {
            return (<React.Fragment>
                <h3>Add Products To Order</h3>
                <input type="text" className="form-control" name="query" onKeyUp={this.onChangeUpdateState} placeholder="Search Products Here"
                       autoComplete="off" autoFocus/>
                <Products products={this.state.queriedProducts} onAdd={this.handleAddToOrder}/>
                <br/>
                <hr/>
            </React.Fragment>);
        }
    }

    renderButtons(open) {
        if (open) {
            return (<React.Fragment>
                <button type="button" className="btn btn-danger" onClick={() => this.props.onDeleteOrder(this.state.orderId, this.state.orderItems)}>
                    <b>Delete Order</b></button>
                <button type="button" className="btn btn-info" onClick={() => this.props.onCloseOrder(this.state.orderId)}><b>Finish Order & Close</b></button>
                <button type="button" className="btn btn-secondary" onClick={() => this.props.onClose(this.state.orderId)}><b>Save & Close</b></button>
            </React.Fragment>);
        } else {
            return (<React.Fragment>
                <button type="button" className="btn btn-secondary" onClick={() => this.props.onClose(this.state.orderId)}><b>Close</b></button>
            </React.Fragment>);
        }
    }

    componentWillMount() {
        this.fetchCurrentOrder();
        if (this.props.realtime) {
            this.timerOrderFetch = setInterval(() => this.fetchCurrentOrder(), 5000);
        }
    }

    componentWillUnmount() {
        if (this.props.realtime) {
            clearInterval(this.timerOrderFetch);
            clearInterval(this.timerQueryProductsFetch);
        }
        this.setState({queryString: '', queriedProducts: []});
    }

    renderOpenClose(open) {
        if (open === 1) {
            return (
                <React.Fragment>
                    <h4 className="modal-title" style={{marginLeft: '5%', marginRight: '5%', color: '#FF7433'}}><b>Order Status: </b>
                        <span style={{fontSize: 16}} className="badge badge-success"> Open </span>
                    </h4>
                </React.Fragment>);
        } else {
            return (
                <React.Fragment>
                    <h4 className="modal-title" style={{marginLeft: '5%', marginRight: '5%', color: '#FF7433'}}><b>Order Status: </b>
                        <span style={{fontSize: 16}} className="badge badge-danger"> Closed </span>
                    </h4></React.Fragment>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} className="Model" contentLabel="Order Details Modal">
                    <div className="modal-dialog modal-lg" style={{marginTop: '5%'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" style={{marginRight: '5%', color: '#FF7433'}}><b>Order Details of Order: </b><span
                                    className="badge badge-primary"
                                    style={{fontSize: 16}}>{this.state.orderId}</span>
                                </h4>
                                {this.renderOpenClose(this.props.open)}
                                <button type="button" style={{color: 'red'}} className="close" onClick={() => this.props.onClose()} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div id="modalBodyElements" className="modal-body"
                                 style={{height: window.innerHeight - 250 + 'px', overflowY: 'scroll', position: 'relative'}}>
                                {this.renderAddNewProducts(this.props.open)}
                                <OrderItems orderItems={this.state.orderItems}
                                            onDelete={this.handleRemoveItem}
                                            onIncrease={this.handleIncreaseItemCount}
                                            onDecrease={this.handleDecreaseItemCount} open={this.props.open}/>
                                <h3 style={{marginTop: 10}}>
                                    <b><i>Total: <span className="badge badge-dark"> Rs {this.props.calculateTotal(this.state.orderItems)}</span></i></b>
                                </h3>
                            </div>
                            <div className="modal-footer">
                                {this.renderButtons(this.props.open)}
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default ReadMoreModal;