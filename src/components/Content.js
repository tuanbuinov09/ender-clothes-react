import {
    Link
} from "react-router-dom";
import bannerImage from './assets/img/slider/xmodel_3.png.pagespeed.ic.IuWWDLqA4l.webp';
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import Icon from "react-hero-icon";
function Content() {
    const [products, setProducts] = useState([]);
    useEffect(function () {
        fetch('https://fakestoreapi.com/products?limit=10')
            .then(res => res.json())
            .then(json => setProducts(json));
    }, []);
    function compareByRate(a, b) {
        if (a.rating.rate < b.rating.rate) {
            return -1;
        }
        if (a.rating.rate > b.rating.rate) {
            return 1;
        }
        return 0;
    }

    const [top2products, setTop2products] = useState([]);
    useEffect(function () {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then((json) => {
                setTop2products(json.sort(compareByRate).slice(0, 2));
            });
    }, []);
    console.log(top2products);

    return (
        <div className="container">
            <div className="cover row section">
                <div className="cover__img-container col-half">
                    <img src={bannerImage} alt="" />
                </div>
                <div className="cover__right col-half d-flex-col align-items-center">
                    <h3 className="sub-title">
                        #NEW SUMMER COLLECTION 2019
                    </h3>
                    <h1 className="title">
                        ARRIVALS SALES
                    </h1>
                    <Link to="nowhere" className="btn bg-dark">SHOP NOW</Link>
                </div>
            </div>

            <h1 className="section section-title">NEW ARRIVALS</h1>

            <div className="section">
                <div className="new-arrivals item__list row">
                    {products.map((product, index) => {
                        return (<div key={index} className="item col-1per5 p-x-16">
                            <Link to={`/products/${index}`} className="item__img-container">
                                <img src={product.image} alt="item" />
                            </Link>
                            <Link to={`/products/${index}`} className="item__label">{product.title}</Link>
                            <div className="bottom-of-item-container">
                                <div className="bottom-of-item"><p className="item__price"><span>{product.price} $</span> <Link to="/add-to-bag" className="header-icon shopping-bag-icon"><Icon icon="shopping-bag" className="header-icon-svg" /><b className="plus-text">+</b></Link></p>
                                    {/* <div className="add-to-cart-button">Add to cart</div> */}
                                </div>
                            </div>
                        </div>);
                    })}
                    {/* <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-1.webp" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 1</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-2.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 2</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-3.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 3</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-4.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 4</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-5.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 5</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-6.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 6</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-7.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 7</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-8.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 8</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-9.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 9</Link>
                        <p className="item__price">300,000₫</p>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-10.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Name 10</Link>
                        <p className="item__price">300,000₫</p>
                    </div>*/}
                </div>
                <div className="section__btn-container"><Link to="nowhere" className="btn bg-dark">SHOP NOW</Link></div>
            </div>
            <h1 className="section section-title">SALES OFF UP TO 50%</h1>
            <div className="section">
                <div className="sale-off item__list row">
                    <div className="sale-off__img-container col-third">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-1.webp" alt="item" />
                        </Link>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-1.webp" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Product Product</Link>
                        <p className="item__price">300,000₫</p>
                        <Link to="nowhere" className="btn bg-dark">SEE DETAILS</Link>
                    </div>
                    <div className="sale-off__img-container col-third">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-3.jpg" alt="item" />
                        </Link>
                    </div>
                    <div className="item col-1per5 p-x-16">
                        <Link to="nowhere" className="item__img-container">
                            <img src="./assets/img/item-3.jpg" alt="item" />
                        </Link>
                        <Link to="nowhere" className="item__label">Product Product Product</Link>
                        <p className="item__price">300,000₫</p>
                        <Link to="nowhere" className="btn bg-dark">SEE DETAILS</Link>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Content;
