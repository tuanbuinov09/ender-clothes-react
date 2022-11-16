import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductDetail.module.css';
import clsx from 'clsx';
import axios from 'axios';
import ToastContainer, { toast } from 'react-light-toast';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { removeSyncfusionLicenseMessage } from '../../uitilities/utilities'

import { caculateTotalAmountAndPrice, addItem, removeItem, increaseAmount, decreaseAmount } from '../../features/shoppingBag/shoppingBagSlice.js';
import EJ2ImageCarousel from './EJ2ImageCarousel';
function ProductDetail(props) {

    const dispatch = useDispatch();
    const params = useParams();
    console.log(params.productId);

    const [ratingComment, setRatingComment] = useState({ CAN_RATE: false, MA_SP: params.productId, MA_KH: JSON.parse(localStorage.getItem('user')).MA_KH, DANH_GIA: 4, NOI_DUNG: "" })
    const [allRatingComment, setAllRatingComment] = useState([])
    const [selectedProductDetail, setSelectedProductDetail] = useState({});
    const [product, setProduct] = useState({});
    const [flag, setFlag] = useState(false);
    const [mapped, setMapped] = useState([]);
    const [mappedSize, setMappedSize] = useState([]);
    const [productImages, setProductImages] = useState();
    const { bagProducts, amount, total } = useSelector((store) => {
        return store.shoppingBag;
    })
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    removeSyncfusionLicenseMessage();
    useEffect(() => {

        console.log(`http://localhost:22081/api/SanPham/?productId=${params.productId}`);
        try {
            axios.get(`http://localhost:22081/api/SanPham/check-can-comment?productId=${params.productId}&customerId=${ratingComment.MA_KH}`).then(res => {
                const response = res.data;
                // console.log("response", response);
                let canRate = response.affectedId;
                setRatingComment({ ...ratingComment, CAN_RATE: canRate === '0' ? false : true });
            });
        } catch (error) {
            console.error(error);
        }

        console.log(`http://localhost:22081/api/SanPham/all-comment?productId=${params.productId}`);
        try {
            axios.get(`http://localhost:22081/api/SanPham/all-comment?productId=${params.productId}`).then(res => {
                const response = res.data;
                response.forEach(item => {
                    let date = new Date(item.NGAY_DANH_GIA);
                    item.NGAY_DANH_GIA = date.toLocaleDateString('vi-VN');
                    console.log(new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', hour12: true }).format(date))
                    item.NGAY_DANH_GIA = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', hour12: true }).format(date)
                })
                setAllRatingComment(response);
            });
        } catch (error) {
            console.error(error);
        }

        try {
            axios.put(`http://localhost:22081/api/SanPham/incre-view?productId=${params.productId}`).then(res => {
                const response = res.data;
                // console.log("response", response);
            });
        } catch (error) {
            console.error(error);
        }

        try {
            axios.get(`http://localhost:22081/api/SanPham/?productId=${params.productId}`).then(res => {
                const productsFromApi = res.data;
                // console.log(productsFromApi[0]);
                //nếu data cũ hình sẽ có http, data mới thì k
                if (productsFromApi[0].HINH_ANH && !productsFromApi[0].HINH_ANH.startsWith('http')) {
                    productsFromApi[0].HINH_ANH = `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL}/${productsFromApi[0].HINH_ANH}`
                }
                productsFromApi[0].chiTietSanPham.forEach(item => {
                    //nếu data cũ hình sẽ có http, data mới thì k
                    if (item.HINH_ANH && !item.HINH_ANH.startsWith('http')) {
                        item.HINH_ANH = `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL}/${item.HINH_ANH}`
                    }
                })
                setProduct(productsFromApi[0]);

                // laays ra cac mau cua san pham
                let tempMau = [];
                productsFromApi[0].chiTietSanPham.forEach((ctsp) => {
                    const maMau = tempMau.find(tempMauctsp => {
                        return tempMauctsp.MA_MAU === ctsp.MA_MAU
                    })
                    if (!maMau) {
                        tempMau = [...tempMau, ctsp]
                    }
                })
                console.log("mau: ", tempMau.reduce((total, item) => {
                    return total + item.MA_MAU + ", "
                }, ''))
                // sap xep lai mau
                tempMau = tempMau.sort((a, b) => {
                    if (a.MA_MAU < b.MA_MAU) {
                        return -1;
                    }
                    if (a.MA_MAU > b.MA_MAU) {
                        return 1;
                    }
                    return 0;
                })
                setMapped(tempMau);
                console.log("mau mapped: ", mapped.reduce((total, item) => {
                    return total + item.MA_MAU + ", "
                }, ''))
                // laays ra cac soze cua san pham
                let tempSize = [];
                productsFromApi[0].chiTietSanPham.forEach((ctsp) => {
                    const maSize = tempSize.find(tempSizectsp => {
                        return tempSizectsp.MA_SIZE === ctsp.MA_SIZE;
                    })
                    if (!maSize) {
                        tempSize = [...tempSize, ctsp];
                    }
                })
                console.log("size: ", tempSize.reduce((total, item) => {
                    return total + item.MA_SIZE + ", ";
                }, ''))
                setMappedSize(tempSize);
                console.log("size mapped: ", mappedSize.reduce((total, item) => {
                    return total + item.MA_SIZE + ", ";
                }, ''))

                setSelectedProductDetail(productsFromApi[0].chiTietSanPham.find((item) => {
                    return item.MA_MAU === tempMau[0].MA_MAU && item.MA_SIZE === tempSize[0].MA_SIZE
                }))

                let tempHinhAnh = [];
                productsFromApi[0].chiTietSanPham.forEach((ctsp) => {
                    const img = tempHinhAnh.find(tempHinhAnh => {
                        return tempHinhAnh.MA_MAU === ctsp.MA_MAU;
                    })
                    if (!img) {
                        tempHinhAnh = [...tempHinhAnh, { MA_MAU: ctsp.MA_MAU, TEN_MAU: ctsp.TEN_MAU, HINH_ANH: ctsp.HINH_ANH, }]
                    }
                })
                console.log("hinh anh: ", tempHinhAnh.reduce((total, item) => {
                    return total + item.HINH_ANH + ", ";
                }, ''))

                // sap xep lai hinh anh theo ma_mau
                tempHinhAnh = tempHinhAnh.sort((a, b) => {
                    if (a.MA_MAU < b.MA_MAU) {
                        return -1;
                    }
                    if (a.MA_MAU > b.MA_MAU) {
                        return 1;
                    }
                    return 0;
                })

                setProductImages(tempHinhAnh);

                setFlag(true);
            });
        } catch (error) {
            console.error(error);
        }
    }, []);
    const checkQuantity = (MA_CT_SP) => {
        console.log(MA_CT_SP, bagProducts)
        let quantity;
        bagProducts.forEach((item) => {
            // console.log(item.chiTietSanPham[0].MA_CT_SP);
            if (item.chiTietSanPham[0].MA_CT_SP === MA_CT_SP) {
                quantity = item.chiTietSanPham[0].SO_LUONG;
            }
        })
        return quantity
    }
    console.log(product);
    console.log(selectedProductDetail);

    let priceString = '';
    let oldPriceString = '';
    try {
        oldPriceString = selectedProductDetail.GIA.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        oldPriceString = oldPriceString.substring(0, oldPriceString.length - 4) + " ₫";
        if (product.PHAN_TRAM_GIAM) {
            priceString = (selectedProductDetail.GIA - selectedProductDetail.GIA * product.PHAN_TRAM_GIAM / 100).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
            priceString = priceString.substring(0, priceString.length - 4) + " ₫";
        }
    } catch (e) {

    }


    const updateSelectedProductDetail = (p) => {
        //         console.log("before update: ", selectedProductDetail.MA_MAU, selectedProductDetail.MA_SIZE)
        // console.log(product)
        if (p.type === 'updatecolor') {
            const x = product.chiTietSanPham.find((item) => {
                return item.MA_MAU === p.MA_MAU && item.MA_SIZE === selectedProductDetail.MA_SIZE
            })
            console.log("xxxxxxxxxx: ", x);
            setSelectedProductDetail(x);
        } else if (p.type === 'updatesize') {
            const y = product.chiTietSanPham.find((item) => {
                return item.MA_MAU === selectedProductDetail.MA_MAU && item.MA_SIZE === p.MA_SIZE
            })
            console.log("xxxxxxxxxx: ", y);
            setSelectedProductDetail(y);
        }
    }


    return (!flag ? <div className={clsx(style.flex_1, style.list)}>
        <LoadingAnimation />
    </div> :
        <>
            <div className={clsx(style.container)}>
                <div className={clsx(style.left)}>
                    <div className={clsx(style.imgContainer)}>
                        {product.PHAN_TRAM_GIAM > 0 ? <div className={clsx(style.salePercentTag)}>
                            {`- ${product.PHAN_TRAM_GIAM}%`}
                        </div> : <></>}
                        {product.TONG_SL_TON <= 0 ? <div className={clsx(style.outOfStockTag)}>
                            {`HẾT HÀNG`}
                        </div> : <></>}
                        {productImages && <EJ2ImageCarousel productImages={productImages} selectedProductDetail={selectedProductDetail} />}
                        {/* {<img src={product.HINH_ANH} className={clsx(style.img)} alt={`${product.TEN_SP}`} />} */}
                    </div>
                </div>
                <div className={clsx(style.right)}>
                    <h2 className={clsx(style.title)}>{product.TEN_SP}</h2>

                    <div className={clsx(style.flex)}>
                        <div className={clsx(style.subtitle)}>Màu: </div>
                        <div className={clsx(style.sizeContainer)}>
                            {mapped.map((ctsp, index) => {

                                return (
                                    <div key={index} className={clsx(style.color, { [style.active]: ctsp.MA_MAU === selectedProductDetail.MA_MAU },
                                    )}//trong csdl s07 la free size
                                        onClick={() => {

                                            updateSelectedProductDetail({ type: 'updatecolor', MA_MAU: ctsp.MA_MAU });

                                        }}

                                        style={{ backgroundColor: ctsp.TEN_TIENG_ANH }}>{ }</div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={clsx(style.flex)}>
                        <div className={clsx(style.subtitle)}>Size: </div>
                        <div className={clsx(style.sizeContainer)}>
                            {mappedSize.map((ctsp, index) => {

                                return (
                                    <div key={index} className={clsx(style.size, { [style.active]: ctsp.MA_SIZE === selectedProductDetail.MA_SIZE },
                                        { [style.freeSize]: ctsp.MA_SIZE === 'S07' })}//trong csdl s07 la free size
                                        onClick={() => {
                                            updateSelectedProductDetail({ type: 'updatesize', MA_SIZE: ctsp.MA_SIZE });

                                        }}>{ctsp.TEN_SIZE}</div>
                                );
                            })}
                        </div>
                    </div>
                    <p className={clsx(style.sizeQuantity)}>Tồn kho: {selectedProductDetail.SL_TON}</p>

                    {product.PHAN_TRAM_GIAM ?
                        <>
                            <p className={clsx(style.oldPrice)}><span className={clsx(style.priceLabel)}>Giá cũ: </span><span className={clsx(style.oldPriceString)}>{oldPriceString}</span></p>
                            <p className={clsx(style.price)}><span className={clsx(style.priceLabel)}>Giá khuyến mãi: </span><span>{priceString}</span></p>
                        </>
                        : <p className={clsx(style.price)}><span className={clsx(style.priceLabel)}>Giá: </span><span>{oldPriceString}</span></p>}
                    <div className={clsx(style.desc)}>{product.MO_TA ? product.MO_TA : "Không có mô tả cho sản phẩm này"}</div>
                    <div className={clsx(style.btnContainer)}
                        onClick={(e) => {
                            console.log("selected size, color: ", selectedProductDetail.TEN_SIZE, selectedProductDetail.TEN_MAU)
                            if (product.TONG_SL_TON <= 0) {
                                return;
                            }
                            const quantityInCart = checkQuantity(selectedProductDetail.MA_CT_SP)
                            console.log(quantityInCart);

                            if ((quantityInCart) === selectedProductDetail.SL_TON || selectedProductDetail.SL_TON === 0) {
                                console.log("Đạt giới hạn tồn kho của sản phẩm")
                                notify("Đạt giới hạn tồn kho của sản phẩm");
                                return;
                            }

                            dispatch(addItem({ ...product, chiTietSanPham: [{ ...selectedProductDetail, SO_LUONG: 1, SO_LUONG_TON: selectedProductDetail.SL_TON }] }));
                            dispatch(caculateTotalAmountAndPrice());
                        }}>
                        <button className={clsx(style.btn, { [style.disabled]: product.TONG_SL_TON <= 0 })}>THÊM VÀO GIỎ HÀNG</button>
                    </div>

                </div>
                <div className={clsx(style.top)}>
                    <ToastContainer />
                </div>


            </div>
            <div className={clsx(style.ratingContainer)}>
                <div className={clsx(style.subtitle)}>Bình luận</div>

                <textarea maxLength={1000} onChange={(e) => {
                    console.log(e.target.value)
                    setRatingComment({ ...ratingComment, NOI_DUNG: e.target.value })
                }} type="text"
                    value={ratingComment.NOI_DUNG}
                    name='NOI_DUNG' className={clsx(style.input)}
                    placeholder="Nhập nội dung đánh giá... " />

                <div className={clsx(style.btnContainer)}
                    onClick={(e) => {
                        if (!ratingComment.CAN_RATE) {
                            return
                        }
                        try {
                            axios.post(`http://localhost:22081/api/SanPham/rate`, ratingComment).then(res => {
                                const response = res.data;
                                if (response.affectedId) {
                                    toast.success('Đã thêm đánh giá')
                                    return
                                } else {
                                    toast.error('Đăng đánh giá thất bại')
                                    return
                                }
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }}>
                    <button className={clsx(style.btn, style.btnComment, { [style.disabled]: !ratingComment.CAN_RATE })}>Bình luận</button>
                </div>
                <div className={clsx(style.listCommentContainer)}>
                    {allRatingComment.map((item, index) => {
                        return (<div className={clsx(style.commentContainer)} key={index}>

                            <div className={clsx(style.infoCommentor)}>
                                <div className={clsx(style.nameAndStar)}>
                                    <div className={clsx(style.ratingName)}> {item.TEN_KH}:</div>
                                    <div className={clsx(style.ratingStar)}> {item.DANH_GIA}</div>
                                </div>
                                <div className={clsx(style.ratingDate)}> {item.NGAY_DANH_GIA}</div>
                            </div>
                            <div className={clsx(style.comment)}> {item.NOI_DUNG}</div>
                        </div>);
                    })}
                </div>

            </div>
        </>);
}

export default ProductDetail;