import React, {Component} from 'react';
import Order from './Order';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ReadMoreModel from './ReadMoreModal';
import Title from './Title';
import './Components.css';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOrderList: [],
            closedOrderList: [],
            modalIsOpen: false,
            modelOrderId: null,
            orderIsOpen: 1
        };
        this.handleDeleteOrder = this.handleDeleteOrder.bind(this);
        this.startNewOrder = this.startNewOrder.bind(this);

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleCloseOrder = this.handleCloseOrder.bind(this);
        this.handleReadMore = this.handleReadMore.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    addNotification(notificationType, title, message) {
        let notification = {
            title: title,
            message: message,
            type: notificationType,
            insert: "top",
            container: "top-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {duration: 2000},
            dismissable: {click: true}
        };
        this.notificationDOMRef.current.addNotification(notification);
    }

    handleCloseModal() {
        // document.body.removeAttribute('style');
        console.log("handle close model");
        fetch("http://localhost:8081/user/" + JSON.parse(localStorage.getItem('userData')).id + "/orders", {method: 'GET'})
            .then(res => res.json())
            .then((result) => {
                    const activeOrders = result.filter(order => order.open === true);
                    const closedOrders = result.filter(order => order.open === false);
                    this.setState({modalIsOpen: false, activeOrderList: activeOrders, closedOrderList: closedOrders});
                }, (error) => {
                    console.log("error occurred while fetching orders", error);
                    this.addNotification('danger', 'Error Occurred', 'Error occurred while fetching orders');
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
                        fetch("http://localhost:8081/orders/" + orderId,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': ' application/json'
                                }, body: JSON.stringify(payload)
                            }).then(res => res.json())
                            .then((result) => {
                                    this.handleCloseModal();
                                }, (error) => {
                                    console.log("error occurred while updating orders", error);
                                    this.addNotification('danger', 'Error Occurred', 'Error occurred while closing order ' + orderId);
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


    handleDeleteOrder(orderId) {
        console.log("delete order called", orderId);
        confirmAlert({
            title: 'Confirm Delete',
            message: `Are you sure want to delete order #${orderId}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch("http://localhost:8081/orders/" + orderId, {method: 'DELETE'})
                            .then(res => res.json())
                            .then((result) => {
                                    if (result.id) {
                                        const activeOrderList = this.state.activeOrderList.filter(order => order.id !== orderId);
                                        const closedOrderList = this.state.closedOrderList.filter(order => order.id !== orderId);
                                        this.addNotification('success', 'Order Deleted', 'Order ' + orderId + ' Successfully Deleted');
                                        this.setState({modalIsOpen: false, activeOrderList: activeOrderList, closedOrderList: closedOrderList});
                                    }
                                }, (error) => {
                                    console.log("error occurred while deleting order", error);
                                    this.addNotification('danger', 'Error Occurred', 'Order ' + orderId + ' Delete Failed');
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
        fetch("http://localhost:8081/user/" + JSON.parse(localStorage.getItem('userData')).id + "/orders", {method: 'POST'})
            .then(res => res.json())
            .then((result) => {
                    if (result.id) {
                        this.addNotification('success', 'New Order Created', 'Order ' + result.id + ' Successfully Created');
                        this.setState({modalIsOpen: true, orderIsOpen: 1, modelOrderId: result.id});
                    }
                }, (error) => {
                    console.log("error occurred while inserting new order", error);
                    this.addNotification('danger', 'Error Occurred', 'Error occurred while inserting new order');
                }
            );
    }

    componentWillMount() {
        document.body.style.overflow = 'hidden';
        fetch("http://localhost:8081/user/" + JSON.parse(localStorage.getItem('userData')).id + "/orders", {method: 'GET'})
            .then(res => res.json())
            .then((result) => {
                    const activeOrders = result.filter(order => order.open === true);
                    const closedOrders = result.filter(order => order.open === false);
                    this.setState({activeOrderList: activeOrders, closedOrderList: closedOrders});
                }, (error) => {
                    console.log("error occurred while fetching orders", error);
                    this.addNotification('danger', 'Error Occurred', 'Error occurred while fetching orders');
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
            return (<ReadMoreModel orderId={this.state.modelOrderId} open={this.state.orderIsOpen} onCloseOrder={this.handleCloseOrder}
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
                <ReactNotification ref={this.notificationDOMRef}/>
                <Title/>
                <h2>Current Orders of<span className="badge m-2 badge-primary">{JSON.parse(localStorage.getItem('userData')).name}</span></h2>
                {this.numberOfOrdersRender()}
                <button onClick={this.startNewOrder} className="btn btn-md btn-success"><b>Start New Order</b></button>
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

    render() {
        return (
            this.renderOrderList()
        );
    }
}

export default Orders;