import React from 'react';
import Item from '../Item/Item';
import { Link } from 'react-router-dom';
import style from './NewArrivalsList.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
import SectionTitle from '../SectionTitle/SectionTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT.js';

function ItemListWithTitle2({ products, type, top }) {
    const params = useParams();
    console.log(params.categoryId);
    let navigate = useNavigate();
    const [products2, setproducts2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('-----');
    useEffect(() => {
        axios.get(`${REACT_APP_API_URL}/api/TheLoai`).then(res => {
            const categoriesFromAPI = res.data;
            // console.log(categoriesFromAPI);

            // categoriesFromAPI.map((category, index) => {
            //     let subCategories;
            //     subCategories = res.data.filter((subCategory, index) => {
            //         return subCategory.MA_TL_CHA === category.MA_TL;
            //     });
            //     category.subCategories = subCategories;
            // })

            // console.log(categoriesFromAPI);

            let categoriesLevel1; // chỉ lấy thể loại cha, trong thể loại cha có thể loại con
            categoriesLevel1 = categoriesFromAPI.filter((category, index) => {
                return category.CAP_TL === 1;
            });
            let x = categoriesFromAPI.find((item) => {
                return item.MA_TL === params.categoryId;
            })
            // console.log(categoriesLevel1);

            setCategoryName(x.TEN_TL);
        });
    })
    useEffect(() => {
        // axios.get(`http://localhost:8000/end-clothes/product/`)
        //     .then(res => {
        //         const productsFromApi = res.data;
        //         console.log(productsFromApi);
        //         setproducts2(productsFromApi);
        //     });
        let topToFind;
        if (!top) {
            topToFind = '';
        } else {
            topToFind = top;
        }
        console.log(topToFind)
        console.log(`${REACT_APP_API_URL}/api/SanPham/by-category?top=${topToFind}&categoryId=${params.categoryId}`)
        setIsLoading(true);
        try {
            axios.get(`${REACT_APP_API_URL}/api/SanPham/by-category?top=${topToFind}&categoryId=${params.categoryId}`).then(res => {
                const productsFromApi = res.data;
                // console.log(productsFromApi);
                setproducts2(productsFromApi);
                setIsLoading(false);

            });
            // let client = new SanPhamClient(undefined, axios);
            // let result2 = client.newArrivals("0","10");
            // console.log("1: ", result);
            // console.log("2: ", result2);
        } catch (error) {
            console.error(error);
        }

        // if (type === 'new-arrivals') {
        //     try {
        //         axios.get(`http://localhost:22081/api/SanPham/new-arrivals?top=${topToFind}`).then(res => {
        //             const productsFromApi = res.data;
        //             // console.log(productsFromApi);
        //             setproducts2(productsFromApi);
        //             setIsLoading(false);

        //         });
        //         // let client = new SanPhamClient(undefined, axios);
        //         // let result2 = client.newArrivals("0","10");
        //         // console.log("1: ", result);
        //         // console.log("2: ", result2);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        // if (type === 'most-viewed') {
        //     try {
        //         axios.get(`http://localhost:22081/api/SanPham/most-viewed?${topToFind}`).then(res => {
        //             const productsFromApi = res.data;
        //             // console.log(productsFromApi);
        //             setproducts2(productsFromApi);
        //             setIsLoading(false);
        //         });

        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        // if (type === 'sale-off') {
        //     try {
        //         axios.get(`http://localhost:22081/api/SanPham/sale-off?top=${topToFind}`).then(res => {
        //             const productsFromApi = res.data;
        //             // console.log(productsFromApi);
        //             setproducts2(productsFromApi);
        //             setIsLoading(false);
        //         });
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        // if (type === 'best-seller') {
        //     try {
        //         axios.get(`http://localhost:22081/api/SanPham/best-seller?top=${topToFind}&month=6`).then(res => {
        //             const productsFromApi = res.data;
        //             // console.log(productsFromApi);
        //             setproducts2(productsFromApi);
        //             setIsLoading(false);
        //         });

        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        // if (type === 'favorite') {
        //     const user = JSON.parse(localStorage.getItem('user'));
        //     if (!user) {
        //         navigate("/user/login", { replace: true });
        //     }
        //     try {
        //         axios.get(`http://localhost:22081/api/KhachHang/favorite?customerId=${user.MA_KH}&populated=1`).then(res => {
        //             const productsFromApi = res.data;
        //             // console.log(productsFromApi);
        //             setproducts2(productsFromApi);
        //             setIsLoading(false);
        //         });


        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    }, [params.categoryId]);
    return (
        <><SectionTitle title={`THỂ LOẠI: ${categoryName}`} />
            <div className="section">

                {isLoading ? <div className={clsx(style.flex_1, style.list)}>
                    <LoadingAnimation />
                </div> : <div className={style.itemList}>
                    {products2.map((product, index) => {
                        return (<Item key={index} product={product} type={1} />);
                    })}
                </div>}

                {top ? <div className={clsx(style.btnContainer)}><Link to={type === 'new-arrivals' ? "/new-arrivals" : type === 'most-viewed' ? "/most-viewed" : type === "sale-off" ? '/sale-off' : type === "best-seller" ? '/best-seller' : {}} className={clsx(style.btn)}>XEM THÊM</Link></div> : <></>}
            </div>
        </>);
}

export default ItemListWithTitle2;