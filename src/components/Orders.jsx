import React, {Component} from 'react';
import Order from './Order';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ReadMoreModel from './ReadMoreModal';
import Title from './Title';
import './Components.css';
import NetworkCall from '../network';
import {NotificationManager} from 'react-notifications';
import Switch from "react-switch";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOrderList: [],
            closedOrderList: [],
            modalIsOpen: false,
            modelOrderId: null,
            orderIsOpen: 1,
            realtime: false
        };
        this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
        this.startNewOrder = this.startNewOrder.bind(this);

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleCloseOrder = this.handleCloseOrder.bind(this);
        this.handleReadMore = this.handleReadMore.bind(this);
        this.fetchOrdersOfUser = this.fetchOrdersOfUser.bind(this);
        this.handleChangeRealtime = this.handleChangeRealtime.bind(this);
    }

    handleChangeRealtime(checked) {
        if (checked) {
            confirmAlert({
                title: 'Enable Real Time Update',
                message: 'This is a experimental feature so it will affect the performance of the system',
                buttons: [
                    {
                        label: 'Ok',
                        onClick: () => {
                            this.setState({realtime: checked});
                        }
                    },
                    {
                        label: 'Cancel',
                        onClick: () => console.log('Realtime update canceled')
                    }
                ]
            });
        } else {
            this.setState({realtime: checked});
        }
    }

    handleCloseModal() {
        console.log("handle close model");
        this.fetchOrdersOfUser();
    }

    fetchOrdersOfUser() {
        NetworkCall("/user/" + JSON.parse(localStorage.getItem('userData')).id + "/orders", "GET", null, null)
            .then(res => res.json())
            .then((result) => {
                    const activeOrders = result.filter(order => order.open === true);
                    const closedOrders = result.filter(order => order.open === false);
                    this.setState({modalIsOpen: false, activeOrderList: activeOrders, closedOrderList: closedOrders});
                }, (error) => {
                    console.log("error occurred while fetching orders", error);
                    NotificationManager.error('Error occurred while fetching orders', 'Error Occurred');
                }
            );
    }

    handleCloseOrder(orderId) {
        console.log("close order", orderId);
        let payload = {open: 0};

        confirmAlert({
            title: 'Confirm Finish',
            message: `Are you sure want to finish order #${orderId}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        NetworkCall("/orders/" + orderId, "PATCH", {
                            'Content-Type': ' application/json'
                        }, JSON.stringify(payload))
                            .then(res => res.json())
                            .then((result) => {
                                    NotificationManager.success('Order ' + orderId + ' Finished Successfully', 'Order Finished');
                                    this.handleCloseModal();
                                }, (error) => {
                                    console.log("error occurred while updating orders", error);
                                    NotificationManager.error('Error occurred while closing order ' + orderId, 'Error Occurred');
                                }
                            );
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Order finish canceled')
                }
            ]
        });

    }

    handleRemoveItem(orderId, productId, currentAmount) {
        console.log("remove order item", productId);
        let payload = {availability: currentAmount};
        NetworkCall("/orders/" + orderId + "/products/" + productId, "DELETE", {
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


    handleDeleteOrder(orderId, orderItems) {
        console.log("delete order called", orderId);
        confirmAlert({
            title: 'Confirm Delete',
            message: `Are you sure want to delete order #${orderId} ?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        orderItems.map(orderItem => this.handleRemoveItem(orderId, orderItem.id, orderItem.order_product.numItems));
                        NetworkCall("/orders/" + orderId, "DELETE", null, null)
                            .then(res => res.json())
                            .then((result) => {
                                    if (result.id) {
                                        const activeOrderList = this.state.activeOrderList.filter(activeOrder => activeOrder.id !== orderId);
                                        const closedOrderList = this.state.closedOrderList.filter(closedOrder => closedOrder.id !== orderId);
                                        NotificationManager.success('Order ' + orderId + ' Deleted Successfully ', 'Order Deleted');
                                        this.setState({modalIsOpen: false, activeOrderList: activeOrderList, closedOrderList: closedOrderList});
                                    }
                                }, (error) => {
                                    console.log("error occurred while deleting order", error);
                                    NotificationManager.error('Order ' + orderId + ' Delete Failed', 'Error Occurred');
                                }
                            );
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Delete canceled')
                }
            ]
        });

    }

    handleReadMore(orderId, open) {
        console.log("Read more", orderId);
        this.setState({modalIsOpen: true, modelOrderId: orderId, orderIsOpen: open});
    }


    startNewOrder() {
        NetworkCall("/user/" + JSON.parse(localStorage.getItem('userData')).id + "/orders", "POST", null, null)
            .then(res => res.json())
            .then((result) => {
                    if (result.id) {
                        NotificationManager.success('Order ' + result.id + ' Created Successfully', 'New Order Created');
                        this.setState({modalIsOpen: true, orderIsOpen: 1, modelOrderId: result.id});
                    }
                }, (error) => {
                    console.log("error occurred while inserting new order", error);
                    NotificationManager.error('Error occurred while inserting new order', 'Error Occurred');
                }
            );
    }

    numberOfOrdersRender() {
        if (this.state.activeOrderList.length > 0) {
            return (<h3><span className="badge badge-warning">You have {this.state.activeOrderList.length} active order(s) </span></h3>);
        } else {
            return (<h3><span className="badge badge-danger">You have no active orders</span></h3>);
        }
    }


    getModelElement() {
        if (this.state.modalIsOpen) {
            return (<ReadMoreModel realtime={this.state.realtime} orderId={this.state.modelOrderId}
                                   open={this.state.orderIsOpen}
                                   onCloseOrder={this.handleCloseOrder}
                                   onClose={this.handleCloseModal} onDeleteOrder={this.handleDeleteOrder} calculateTotal={this.calculateOrderTotal}/>);
        }
    }

    renderOrders(orderList, open) {
        if (orderList.length > 0) {
            return (<React.Fragment>
                <div className="row" style={{margin: 0}}>
                    {orderList.map(order => <Order key={order.id}
                                                   onReadMore={this.handleReadMore}
                                                   onDelete={this.handleDeleteOrder}
                                                   calculateTotal={this.calculateOrderTotal}
                                                   order={order} open={open}/>)}
                </div>
            </React.Fragment>);
        } else {
            return (<React.Fragment><h3><span className="badge badge-danger">No {open === 1 ? 'Active' : 'Closed'} Orders</span></h3></React.Fragment>);
        }
    }

    calculateOrderTotal(orderProductList) {
        let total = 0;
        orderProductList.forEach(function (product) {
            total += (product.order_product.numItems * product.unitPrice);
        });
        return total;
    }

    renderOrderList() {
        return (<React.Fragment>
            <div className="container component">
                <Title/>
                <h2>Current Orders of<span className="badge m-2 badge-primary">{JSON.parse(localStorage.getItem('userData')).name}</span></h2>
                <label htmlFor="material-switch" style={{marginTop: 10, marginBottom: 10}}>
                    <span style={{fontSize: 20}}><b>Realtime Update Product Availability </b></span>
                    <Switch
                        onChange={this.handleChangeRealtime} checked={this.state.realtime}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="react-switch"
                        id="material-switch"
                    />
                </label>
                {this.numberOfOrdersRender()}
                <button onClick={this.startNewOrder} style={{marginRight: 10}} className="btn btn-md btn-success"><b>Start New Order</b></button>

                <hr/>
                <div style={{height: window.innerHeight - 400 + 'px', overflowY: 'scroll', position: 'relative'}}>
                    <h3>Active Orders</h3>
                    {this.renderOrders(this.state.activeOrderList, 1)}
                    <br/>
                    <hr/>
                    <h3>Closed Orders</h3>
                    {this.renderOrders(this.state.closedOrderList, 0)}
                </div>
                {this.getModelElement()}
                <br/>
            </div>
        </React.Fragment>);
    }

    componentWillMount() {
        document.body.style.overflow = 'hidden';
        this.fetchOrdersOfUser();
    }

    render() {
        return (
            this.renderOrderList()
        );
    }
}

export default Orders;