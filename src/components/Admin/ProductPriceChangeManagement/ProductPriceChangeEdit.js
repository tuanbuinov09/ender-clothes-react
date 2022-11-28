import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductPriceChangeEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { intToVNDCurrencyFormat, loadLocaleSyncfusion, removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { XIcon, CheckIcon, SaveIcon, PrintIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { setupInterceptors } from '../../../uitilities/utilities';

import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
function ProductPriceChangeEdit(props) {
    console.log('dredner')
    let navigate = useNavigate();
    setupInterceptors(navigate, 'employee');
    //const params = useParams(); prams.cartId
    console.log(props.importId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [flag, setFlag] = useState(false);

    const [products, setProducts] = useState([]);
    const [productDetailsForPriceChange, setProductDetailsForPriceChange] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [productPriceChangeEntity, setProductPriceChangeEntity] = useState({ MA_NV: "", GHI_CHU: "", NGAY_TAO: "", chiTietThayDoiGia: [] });

    removeSyncfusionLicenseMessage();

    const productDropdownList = useRef();

    const datePicker = useRef();

    const onChangeProduct = (e) => {
        setIsLoading(true);
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        setErrorMessage(tmpErrorMsg);
        axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-price-change?productId=${productDropdownList.current.value}`).then(res => {
            // console.log('dt for import: ', res.data)
            res.data.forEach(item => {
                // item.GIA = 0;
                // item.SO_LUONG = 0;
                // item.errorGIA_NHAP = "";
                // item.errorSO_LUONG = "";
                item.GIA_THAY_DOI = item.GIA;
                item.errrorGIA_THAY_DOI = "";
            })

            let a = res.data.map(item => {
                return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA, GIA_THAY_DOI: item.GIA_THAY_DOI }
            });
            console.log(a);
            setProductDetailsForPriceChange(res.data);
            setProductPriceChangeEntity({ ...productPriceChangeEntity, chiTietThayDoiGia: a })
            setIsLoading(false);
        })
    }



    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            navigate("/employee/login", true);
        }
        setIsLoading(true);

        try {

            let url = `${process.env.REACT_APP_API_URL}/api/SanPham/all?top=`;

            console.log(url)
            axios.get(url).then(res => {
                const productsFromAPI = res.data;
                // console.log(productsFromAPI);
                productsFromAPI.forEach((item) => {
                    if (item.NGAY_TAO) {
                        let date = new Date(item.NGAY_TAO);
                        item.NGAY_TAO = date.toLocaleDateString('vi-VN');
                    }
                    if (item.SIZE_STR) {
                        item.SIZE_STR = item.SIZE_STR.substr(1)
                    }
                    let a = item.MA_SP + ' - ' + item.TEN_SP
                    item.TEN_SP_STR = a;

                })
                console.log(productsFromAPI);

                setProducts(productsFromAPI);
                setIsLoading(false);
                // console.log(productsFromAPI);
                // grid.current.dataSource = productsFromAPI;

                setFlag(true);

                if (props.viewMode === 'add') {
                    console.log(datePicker)
                    datePicker.current.value = new Date();
                } else {
                    setIsLoading(true);
                    let url = `${process.env.REACT_APP_API_URL}/api/NhapHang/?importId=${props.importId}`;
                    axios.get(url).then(res => {
                        console.log(res.data)
                        const importEntityFromApi = res.data
                        setProductPriceChangeEntity(importEntityFromApi)
                        datePicker.current.value = importEntityFromApi.NGAY_TAO;

                        productDropdownList.current.value = importEntityFromApi.MA_SP;


                        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
                        setErrorMessage(tmpErrorMsg);
                        axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${importEntityFromApi.MA_SP}`).then(res => {
                            // console.log('dt for import: ', res.data)
                            res.data.forEach(item => {
                                const a = importEntityFromApi.chiTietThayDoiGia.find(ctpn => ctpn.MA_CT_SP === item.MA_CT_SP)
                                a ? item.GIA = a.GIA : item.GIA = 0;
                                a ? item.SO_LUONG = a.SO_LUONG : item.SO_LUONG = 0;
                                item.errorGIA_NHAP = "";
                                item.errorSO_LUONG = "";
                            })

                            let a = res.data.map(item => {
                                return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA }
                            });

                            // console.log(a);
                            setProductDetailsForPriceChange(res.data);
                            setProductPriceChangeEntity({ ...productPriceChangeEntity, chiTietThayDoiGia: a })
                            setIsLoading(false);
                        })
                    })

                }
            });
        } catch (e) {
            console.log(e);
        }
    }, [])
    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {

                // axios.get(`http://localhost:22081/api/SanPham/${props.productId}`).then(res => {
                //     const response = res.data;
                //     response.chiTietGioHang2.forEach((resp, index) => {
                //         try {
                //             resp.STT = index + 1;
                //             resp.GIA_STR = intToVNDCurrencyFormat(resp.GIA) + " ₫";
                //             resp.TRI_GIA_STR = intToVNDCurrencyFormat(resp.GIA * resp.SO_LUONG, true);//thêm true + đ
                //         } catch (e) {
                //             console.log(e)
                //         }
                //     })
                //     setCart(response);
                //     //set nhân viên đã được assign   
                //     setFlag(true);


                //     productDropdownList.current.value = response.MA_NV_GIAO;
                //     console.log("nvgiao old:", response.MA_NV_GIAO)

                // });
            } catch (error) {
                console.error(error);
            }
        } else {

        }

    }, []);

    loadLocaleSyncfusion();

    const validate = () => {
        let hasError = false;
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        // if (!product.TEN_SP) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng nhập tên sản phẩm" }
        //     hasError = true;
        // }

        if (!productDropdownList.current.value) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng chọn sản phẩm cần thay đổi giá" }
            hasError = true;
        }
        // if (!multiSelectColors.current.value) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorBANG_MAU: "*Vui lòng chọn các màu" }
        //     hasError = true;
        // }
        // if (!product.HINH_ANH) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorHINH_ANH_CHUNG: "*Vui lòng chọn hình ảnh chung cho sản phẩm" }
        //     hasError = true;
        // }
        // if (
        //     product.hinhAnhSanPham.some(item => !item.HINH_ANH)//nếu có màu chưa có hình ảnh
        // ) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorHINH_ANH_CHITIET: "*Vui lòng chọn hình ảnh chi tiết cho tất cả các màu" }
        //     hasError = true;
        // }
        let item = productDetailsForPriceChange.some(item => {
            return item.GIA !== item.GIA_THAY_DOI;
        })
        if (!item) {
            tmpErrorMsg = { ...tmpErrorMsg, errorGIA_THAY_DOI_ALL: "*Phải có ít nhất 1 giá được thay đổi so với giá cũ" }
            hasError = true;
        }
        productDetailsForPriceChange.forEach(item => {
            item.errorGIA_THAY_DOI = '';
            if (item.GIA_THAY_DOI <= 0) {
                item.errorGIA_THAY_DOI = '*Giá thay đổi phải lớn hơn 0'
                hasError = true;
            }
            if (!item.GIA_THAY_DOI) {
                item.GIA_THAY_DOI = item.GIA;
            }

        })

        setErrorMessage(tmpErrorMsg)

        return hasError
    }


    const save = () => {
        if (validate()) {
            return;
        }
        //chỉ lấy những giá bị thay đổi thôi
        let data = productDetailsForPriceChange.filter(item => {
            return item.GIA_THAY_DOI !== item.GIA;
        })
        // console.log("data to send: ", data)

        let _productPriceChangeEntity = {

            MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
            // GHI_CHU: productPriceChangeEntity.GHI_CHU,
            // NGAY_TAO: datePicker,
            listThayDoiGia: data
        }

        setProductPriceChangeEntity(_productPriceChangeEntity)

        console.log('pass', _productPriceChangeEntity, `${process.env.REACT_APP_API_URL}/api/ThayDoiGia/add-price-change`)
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/ThayDoiGia/add-price-change`, _productPriceChangeEntity
                ,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                if (response.errorDesc) {
                    toast.error(response.responseMessage);
                    return
                }

                toast.success("Thêm thay đổi giá thành công");
                props.rerender();
            });
        } catch (error) {
            console.error(error);
        }

    }

    let productDropdownFields = { text: 'TEN_SP_STR', value: 'MA_SP' };
    // filtering event handler to filter a Country

    const onProductFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_SP_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(products, query);
    };


    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết thay đổi giá ${props.importId}` : props.viewMode === 'edit' ? `Chỉnh sửa thay đổi giá ${props.importId}` : `Thêm mới thay đổi giá`
    }

    const getTotalPrice = () => {
        return productDetailsForPriceChange.reduce((total, item) => {
            return total = total + (item.SO_LUONG * item.GIA)
        }, 0)
    }
    const getTotalQuantity = () => {
        return productDetailsForPriceChange.reduce((total, item) => {
            return total = total + (item.SO_LUONG)
        }, 0)
    }
    const onChangeQuantity = (MA_CT_SP, quantity) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForPriceChange.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, SO_LUONG: quantity };
            } else {
                return item;
            }
        });
        setProductDetailsForPriceChange(newArray);

    }
    const onChangePrice = (MA_CT_SP, price) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForPriceChange.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, GIA_THAY_DOI: price };
            } else {
                return item;
            }
        });

        setProductDetailsForPriceChange(newArray);

    }

    // console.log('rerender, product: ', product)
    console.log('rerender input": ', productDetailsForPriceChange)
    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            <div className={clsx(style.top)}>
                {/* <ToastContainer /> */}
            </div>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                    props.closeDialog();
                }}><XIcon /></span></h1>

                <h1 className={clsx(style.title)}>{getTitle()}</h1>
                <div className={clsx(style.btnCheckContainer)}>
                    {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ?
                        <>
                            <button onClick={() => {
                                save();
                            }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: props.viewMode === 'view' })}>
                                <span className={clsx(style.iconSvg)}><SaveIcon /></span>Lưu
                            </button>

                        </>
                        : <></>

                    }

                </div>

                <div className={clsx(style.cartInfo, style.form)}>


                    <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width50)}>
                        <label className={clsx(style.inputLabel)}>Sản phẩm:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <DropDownListComponent id="products" ref={productDropdownList} dataSource={products}
                                        filtering={onProductFiltering} filterBarPlaceholder='Tìm sản phẩm' allowFiltering={true}
                                        fields={productDropdownFields} placeholder="Chọn sản phẩm cần thay đổi giá" popupHeight="220px"
                                        onChange={onChangeProduct} />
                                </div>
                            </div>

                        </div>
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTEN_SP}</p>}
                    </div>

                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                        <div className={clsx(style.datePickerContainer, style.readOnly)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    {/* <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Bảng màu:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <MultiSelectComponent onChange={onChangeColors} ref={multiSelectColors} id="multiSelectColors" dataSource={colors} fields={multiSelectColorsFields} filtering={onColorFiltering} filterBarPlaceholder='Tìm màu' allowFiltering={true} placeholder="Chọn các màu của sản phẩm" />
                                </div>

                            </div>
                        </div>
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorBANG_MAU}</p>}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Bảng size:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <MultiSelectComponent ref={multiSelectSizes} id="multiSelectSizes" dataSource={sizes} fields={multiSelectSizesFields} filtering={onSizeFiltering} filterBarPlaceholder='Tìm size' allowFiltering={true} placeholder="Chọn các size của sản phẩm" />
                                </div>

                            </div>
                        </div>
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorBANG_SIZE}</p>}
                    </div>
*/}
                    {/* <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                        <textarea maxLength={1000} onChange={(e) => {
                            console.log(e.target.value)
                            setProductPriceChangeEntity({ ...productPriceChangeEntity, GHI_CHU: e.target.value })
                        }} type="text" placeholder=""
                            value={productPriceChangeEntity.GHI_CHU} name='GHI_CHU' className={clsx(style.input)} />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorGHI_CHU}</p>}
                    </div> */}

                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                        <input type="text" placeholder="" disabled
                            value={
                                props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : productPriceChangeEntity.HO_TEN_NV
                            } name='HO_TEN_NV' className={clsx(style.input)} />
                    </div>


                    {productDetailsForPriceChange.length > 0 ?
                        // <div className={clsx(style.detailFileUploadsContainer)}>
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                <label className={clsx(style.inputLabel)}>Màu /size</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                <label className={clsx(style.inputLabel)}>Giá cũ</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                <label className={clsx(style.inputLabel)}>Giá mới</label>
                                {<p className={clsx(style.errorMessage)}>{errorMessage.errorGIA_THAY_DOI_ALL}</p>}
                            </div>
                            {/* <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Thành tiền</label>

                            </div> */}
                        </>
                        // </div>
                        : <></>}

                    {/* <div className={clsx(style.detailFileUploadsContainer)}> */}
                    {
                        productDetailsForPriceChange.map((item, index) => {
                            return (
                                <div key={index} className={clsx(style.quantityInputContainer)}>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                        {/* <label className={clsx(style.inputLabel)}>Màu /size:</label> */}
                                        <input disabled onChange={(e) => {

                                        }} type="text" name='MAU_SIZE'
                                            value={`${item.TEN_MAU}/ ${item.TEN_SIZE}`}
                                            placeholder="" className={clsx(style.input)}
                                        />

                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                        {/* <label className={clsx(style.inputLabel)}>Giá cũ:</label> */}
                                        <input onChange={(e) => {
                                            // console.log(e.target.value)
                                            // onChangeQuantity(item.MA_CT_SP, e.target.value);
                                        }} type="text"
                                            value={intToVNDCurrencyFormat(productDetailsForPriceChange[index].GIA, true)}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            disabled
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {/* {<p className={clsx(style.errorMessage)}>{item.errorSO_LUONG}</p>} */}
                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                        <input onChange={(e) => {
                                            console.log(e.target.value)
                                            onChangePrice(item.MA_CT_SP, e.target.value);
                                        }} type="number"
                                            value={productDetailsForPriceChange[index].GIA_THAY_DOI}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorGIA_THAY_DOI}</p>}
                                    </div>

                                    {/* <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                        <label className={clsx(style.inputLabel)}>Thành tiền</label>
                                        <input disabled onChange={(e) => {

                                        }} type="text" name='THANH_TIEN'
                                            value={`${intToVNDCurrencyFormat(item.GIA * item.SO_LUONG, true)}`}
                                            placeholder="" className={clsx(style.input)}
                                        />

                                    </div> */}
                                </div>
                            )
                        })
                    }
                    {/* </div> */}

                    {/* {productDetailsForPriceChange.length > 0 ?
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.totalLabel)}>Tổng số lượng: {getTotalQuantity()}</label>
                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.totalLabel)}>Tổng giá nhập: {intToVNDCurrencyFormat(getTotalPrice(), true)}</label>

                            </div></>
                        : <></>} */}
                    {/* {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHITIET}</p>} */}

                    {/* detail */}
                </div>

                {/* <div className={clsx(style.inputGroup)}>
                    <FileUploadComponent
                        ref={generalFileInputRef}
                        field={'HINH_ANH_CHUNG'}
                        title={'Chọn hình ảnh chung'}
                        onSelectedOptionsChange={generalFileChange}
                        showUploadButton={false}
                    />
                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHUNG}</p>}
                </div> */}
                {/* <div className={clsx(style.inputLabel, style.longLabel)}>Nhập số lượng và giá nhập: </div> */}



            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(ProductPriceChangeEdit);