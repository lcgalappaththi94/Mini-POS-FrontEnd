import React, {Component} from 'react';
import Product from './Product';

class Products extends Component {
    render() {
        return (
            <React.Fragment>
                <ul className="list-group">
                    {this.props.products.map(product => <Product key={product.id} product={product} onAdd={this.props.onAdd}/>)}
                </ul>
            </React.Fragment>
        );
    }
}

export default Products;