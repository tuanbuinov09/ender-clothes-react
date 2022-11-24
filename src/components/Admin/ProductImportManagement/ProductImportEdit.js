import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductImportEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { intToVNDCurrencyFormat, loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { XIcon, CheckIcon, SaveIcon, PrintIcon } from '../../../icons';
import ToastContainer, { toast } from 'react-light-toast';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
function ProductImportEdit(props) {
    console.log('dredner')
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');

    //const params = useParams(); prams.cartId
    console.log(props.importId, props.viewMode);
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [flag, setFlag] = useState(false);

    const [products, setProducts] = useState([]);
    const [productDetailsForImport, setProductDetailsForImport] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [importProductEntity, setImportProductEntity] = useState({ MA_NV: "", GHI_CHU: "", NGAY_TAO: "", chiTietPhieuNhap: [] });

    removeSyncfusionLicenseMessage();

    const productDropdownList = useRef();

    const datePicker = useRef();

    const onChangeProduct = (e) => {
        setIsLoading(true);
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        setErrorMessage(tmpErrorMsg);
        axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${productDropdownList.current.value}`).then(res => {
            // console.log('dt for import: ', res.data)
            res.data.forEach(item => {
                item.GIA = 0;
                item.SO_LUONG = 0;
                item.errorGIA_NHAP = "";
                item.errorSO_LUONG = "";
            })

            let a = res.data.map(item => {
                return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA }
            });
            console.log(a);
            setProductDetailsForImport(res.data);
            setImportProductEntity({ ...importProductEntity, chiTietPhieuNhap: a })
            setIsLoading(false);
        })
    }



    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
            notify("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
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
                        setImportProductEntity(importEntityFromApi)
                        datePicker.current.value = importEntityFromApi.NGAY_TAO;

                        productDropdownList.current.value = importEntityFromApi.MA_SP;


                        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
                        setErrorMessage(tmpErrorMsg);
                        axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${importEntityFromApi.MA_SP}`).then(res => {
                            // console.log('dt for import: ', res.data)
                            res.data.forEach(item => {
                                const a = importEntityFromApi.chiTietPhieuNhap.find(ctpn => ctpn.MA_CT_SP === item.MA_CT_SP)
                                a ? item.GIA = a.GIA : item.GIA = 0;
                                a ? item.SO_LUONG = a.SO_LUONG : item.SO_LUONG = 0;
                                item.errorGIA_NHAP = "";
                                item.errorSO_LUONG = "";
                            })

                            let a = res.data.map(item => {
                                return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA }
                            });

                            // console.log(a);
                            setProductDetailsForImport(res.data);
                            setImportProductEntity({ ...importProductEntity, chiTietPhieuNhap: a })
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
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng chọn sản phẩm cần nhập" }
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
        let item = productDetailsForImport.some(item => {
            return item.SO_LUONG > 0;
        })
        if (!item) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSO_LUONG_ALL: "*Tổng số lượng nhập của phiếu phải lớn hơn 0" }
            hasError = true;
        }
        productDetailsForImport.forEach(item => {
            item.errorSO_LUONG = '';
            if (item.SO_LUONG < 0) {
                item.errorSO_LUONG = '*Số lượng nhập phải lớn hơn hoặc bằng 0'
                hasError = true;
            }
            if (!item.SO_LUONG) {
                item.SO_LUONG = 0;
            }

            item.errorGIA_NHAP = '';
            if (item.GIA < 0) {
                item.errorGIA_NHAP = '*Giá nhập phải lớn hơn hoặc bằng 0'
                hasError = true;
            }
            if (!item.GIA) {
                item.GIA = 0;
            }
        })

        setErrorMessage(tmpErrorMsg)

        return hasError
    }


    const save = () => {
        if (validate()) {
            return;
        }

        let data = productDetailsForImport.filter(item => {
            return item.SO_LUONG > 0;
        })
        // console.log("data to send: ", data)

        let _importProductEntity = {

            MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
            GHI_CHU: importProductEntity.GHI_CHU,
            // NGAY_TAO: datePicker,
            chiTietPhieuNhap: data
        }

        setImportProductEntity(_importProductEntity)

        console.log('pass', _importProductEntity, `${process.env.REACT_APP_API_URL}/api/NhapHang/add-product-import`)
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/NhapHang/add-product-import`, _importProductEntity,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                if (response.errorDesc) {
                    notify(response.responseMessage);
                    return
                }

                toast.success("Thêm phiếu nhập thành công");
                props.rerender();
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
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
        return props.viewMode === 'view' ? `Chi tiết phiếu nhập ${props.importId}` : props.viewMode === 'edit' ? `Chỉnh sửa phiếu nhập ${props.importId}` : `Thêm mới phiếu nhập`
    }

    const getTotalPrice = () => {
        return productDetailsForImport.reduce((total, item) => {
            return total = total + (item.SO_LUONG * item.GIA)
        }, 0)
    }
    const getTotalQuantity = () => {
        return productDetailsForImport.reduce((total, item) => {
            return total = total + (item.SO_LUONG * 1)
        }, 0)
    }
    const onChangeQuantity = (MA_CT_SP, quantity) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForImport.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, SO_LUONG: quantity };
            } else {
                return item;
            }
        });
        setProductDetailsForImport(newArray);

    }
    const onChangePrice = (MA_CT_SP, price) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForImport.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, GIA: price };
            } else {
                return item;
            }
        });
        setProductDetailsForImport(newArray);

    }

    // console.log('rerender, product: ', product)
    console.log('rerender input": ', productDetailsForImport)
    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            <div className={clsx(style.top)}>
                <ToastContainer />
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


                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Sản phẩm:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <DropDownListComponent id="products" ref={productDropdownList} dataSource={products}
                                        filtering={onProductFiltering} filterBarPlaceholder='Tìm sản phẩm' allowFiltering={true}
                                        fields={productDropdownFields} placeholder="Chọn sản phẩm cần nhập" popupHeight="220px"
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
                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                        <textarea maxLength={1000} onChange={(e) => {
                            console.log(e.target.value)
                            setImportProductEntity({ ...importProductEntity, GHI_CHU: e.target.value })
                        }} type="text" placeholder=""
                            value={importProductEntity.GHI_CHU} name='GHI_CHU' className={clsx(style.input)} />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorGHI_CHU}</p>}
                    </div>

                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                        <input type="text" placeholder="" disabled
                            value={
                                props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : importProductEntity.HO_TEN_NV
                            } name='HO_TEN_NV' className={clsx(style.input)} />
                    </div>


                    {productDetailsForImport.length > 0 ?
                        // <div className={clsx(style.detailFileUploadsContainer)}>
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Màu /size</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số lượng</label>
                                {<p className={clsx(style.errorMessage)}>{errorMessage.errorSO_LUONG_ALL}</p>}
                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Đơn giá</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Thành tiền</label>

                            </div>
                        </>
                        // </div>
                        : <></>}

                    {/* <div className={clsx(style.detailFileUploadsContainer)}> */}
                    {
                        productDetailsForImport.map((item, index) => {
                            return (
                                <div key={index} className={clsx(style.quantityInputContainer)}>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        {/* <label className={clsx(style.inputLabel)}>Màu /size:</label> */}
                                        <input disabled onChange={(e) => {

                                        }} type="text" name='MAU_SIZE'
                                            value={`${item.TEN_MAU}/ ${item.TEN_SIZE}`}
                                            placeholder="" className={clsx(style.input)}
                                        />

                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        {/* <label className={clsx(style.inputLabel)}>Số lượng:</label> */}
                                        <input onChange={(e) => {
                                            console.log(e.target.value)
                                            onChangeQuantity(item.MA_CT_SP, e.target.value);
                                        }} type="number"
                                            value={productDetailsForImport[index].SO_LUONG}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorSO_LUONG}</p>}
                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        {/* <label className={clsx(style.inputLabel)}>Giá nhập:</label> */}
                                        <input onChange={(e) => {
                                            console.log(e.target.value)
                                            onChangePrice(item.MA_CT_SP, e.target.value);
                                        }} type="number"
                                            value={productDetailsForImport[index].GIA}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorGIA_NHAP}</p>}
                                    </div>

                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        {/* <label className={clsx(style.inputLabel)}>Thành tiền</label> */}
                                        <input disabled onChange={(e) => {

                                        }} type="text" name='THANH_TIEN'
                                            value={`${intToVNDCurrencyFormat(item.GIA * item.SO_LUONG, true)}`}
                                            placeholder="" className={clsx(style.input)}
                                        />

                                    </div>
                                </div>
                            )
                        })
                    }
                    {/* </div> */}

                    {productDetailsForImport.length > 0 ?
                        // <div className={clsx(style.detailFileUploadsContainer)}>
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.totalLabel)}>Tổng số lượng: {getTotalQuantity()}</label>
                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.totalLabel)}>Tổng giá nhập: {intToVNDCurrencyFormat(getTotalPrice(), true)}</label>

                            </div></>
                        // </div>
                        : <></>}
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
export default React.memo(ProductImportEdit);