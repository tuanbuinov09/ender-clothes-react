import React from 'react';
function SideBarComponents(props) {
    return (
        <>
            <div className="search-box">
                <div className="top">
                    <h3>SEARCH</h3>
                    <i className="fas fa-times search-close"></i>
                </div>
                <div className="search-bar-wrapper">
                    <input type="text" placeholder="Search for product..." />
                </div>
            </div>
            <div className="bag-box">
                <div className="top">
                    <h3>SHOPPING BAG</h3>
                    <i className="fas fa-times bag-close"></i>
                </div>
                <div className="cart-list">
                    <>{/* <!-- <div className="cart-list__item">
                        <a href="#" className="item__img-container">
                            <img src="./assets/img/item-9.jpg" alt="item">
                        </a>
                        <div className="item__detail">
                            <a href="#" className="item__label">Product Product Product</a>
                            <p className="item__price">300,000₫</p>
                            <div className="input-group">
                                <input type="button" value="-" className="button-minus" data-field="quantity">
                                    <input type="number" step="1" max="" min="1" value="1" name="quantity" className="quantity-field">
                                        <input type="button" value="+" className="button-plus" data-field="quantity">
                                        </div>
                                        <a href="#" className="btn--danger">Remove</a>
                                    </div>
                            </div>

                            <div className="cart-list__item">
                                <a href="#" className="item__img-container">
                                    <img src="./assets/img/item-9.jpg" alt="item">
                                </a>
                                <div className="item__detail">
                                    <a href="#" className="item__label">Product Product Product</a>
                                    <p className="item__price">300,000₫</p>
                                    <div className="input-group">
                                        <input type="button" value="-" className="button-minus" data-field="quantity">
                                            <input type="number" step="1" max="" min="1" value="1" name="quantity" className="quantity-field">
                                                <input type="button" value="+" className="button-plus" data-field="quantity">
                                                </div>
                                                <a href="#" className="btn--danger">Remove</a>
                                            </div>
                                    </div> --> */}</>
                </div>
            </div>
        </>
    );
}

export default SideBarComponents;