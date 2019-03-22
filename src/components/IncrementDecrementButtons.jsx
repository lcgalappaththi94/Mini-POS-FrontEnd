import React, {Component} from 'react';

class IncrementDecrementButtons extends Component {
    render() {
        return (
            <React.Fragment>
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
                            onClick={() => this.props.onDecrease(this.props.orderItem.id, this.props.orderItem.order_product.numItems)}
                            className='close'>
                        <span style={{fontSize: 30}}>&minus;</span>
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default IncrementDecrementButtons;
