import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import ToastContainer, { toast } from 'react-light-toast';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import FileUploadComponent from '../../FileUploadComponent/FileUploadComponent';

function ProductEdit(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.productId, props.viewMode);
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [product, setProduct] = useState({ hinhAnhSanPham: [], chiTietSanPham: [] });
    const [flag, setFlag] = useState(false);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [errorMessage, setErrorMessage] = useState({ errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });


    removeSyncfusionLicenseMessage();
    const multiSelectSizes = useRef();
    const multiSelectColors = useRef();
    const categoryDropdownList = useRef();
    const grid = useRef();
    const datePicker = useRef();
    const multiSelectColorsFields = { text: 'TEN_MAU', value: 'MA_MAU' }
    const multiSelectSizesFields = { text: 'TEN_SIZE', value: 'MA_SIZE' }
    const onColorFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_MAU', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(colors, query);
    };
    const onSizeFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_SIZE', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(sizes, query);
    };

    const onChangeColors = (e) => {
        const initHinhAnhSanPham = multiSelectColors.current.value.map(item => {
            return { MA_MAU: item, HINH_ANH: null };
        })
        setProduct({ ...product, hinhAnhSanPham: initHinhAnhSanPham })
    }

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')).MA_NV) {
            navigate("/employee/login", true);
            notify("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }
        try {
            axios.get('http://localhost:22081/api/TheLoai').then(res => {
                const categoriesFromAPI = res.data.filter((item) => {
                    return !!item.MA_TL_CHA
                });
                //console.log(categoriesFromAPI)
                setCategories(categoriesFromAPI);
                setFlag(true);

                datePicker.current.value = new Date();
            })

            axios.get('http://localhost:22081/api/BangMau').then(res => {
                //console.log("Bang Mau: ", res.data)
                setColors(res.data);
            })

            axios.get('http://localhost:22081/api/BangSize').then(res => {
                //console.log("Bang Size: ", res.data)
                setSizes(res.data);
            })
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


                //     categoryDropdownList.current.value = response.MA_NV_GIAO;
                //     console.log("nvgiao old:", response.MA_NV_GIAO)

                // });
            } catch (error) {
                console.error(error);
            }
        } else {

        }



    }, []);

    //chỉnh ngôn ngữ thư viện thành tiếng việt
    loadLocaleSyncfusion();

    const validate = () => {
        //console.log(product, categoryDropdownList.current.value, multiSelectColors.current.value, multiSelectSizes.current.value)
        let hasError = false;
        let tmpErrorMsg = { errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        if (!product.TEN_SP) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng nhập tên sản phẩm" }
            //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
            hasError = true;
        }

        if (!categoryDropdownList.current.value) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTHE_LOAI: "*Vui lòng chọn thể loại" }
            hasError = true;
        }
        if (!multiSelectColors.current.value) {
            tmpErrorMsg = { ...tmpErrorMsg, errorBANG_MAU: "*Vui lòng chọn các màu" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (!multiSelectSizes.current.value) {
            tmpErrorMsg = { ...tmpErrorMsg, errorBANG_SIZE: "*Vui lòng chọn các size" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (!product.HINH_ANH) {
            tmpErrorMsg = { ...tmpErrorMsg, errorHINH_ANH_CHUNG: "*Vui lòng chọn hình ảnh chung cho sản phẩm" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        if (
            product.hinhAnhSanPham.some(item => !item.HINH_ANH)//nếu có màu chưa có hình ảnh
        ) {
            tmpErrorMsg = { ...tmpErrorMsg, errorHINH_ANH_CHITIET: "*Vui lòng chọn hình ảnh chi tiết cho tất cả các màu" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        setErrorMessage(tmpErrorMsg)
        return hasError
    }

    const uploadDetailFileUploadComponents = () => {
        let idx = 0;
        let next = detailFileInputRefs.current[idx];
        if (next) {
            console.log('file upload cmpnt: ', next);
            next.uploadHandler(); //upload ảnh từ cmpnt FileUploadComponent
        }
        while (next) {
            idx = idx + 1;
            next = detailFileInputRefs.current[idx];
            if (next) {
                console.log('file upload cmpnt: ', next);
                next.uploadHandler();
            }
        }
    };

    const uploadGeneralFileUpload = () => {
        console.log('general file cmpnt: ', generalFileInputRef.current);
        generalFileInputRef.current.uploadHandler();
    }

    const detailFileInputRefs = useRef([]);
    const generalFileInputRef = useRef();

    const save = () => {
        if (validate()) {
            return;
        }

        product.MA_TL = categoryDropdownList.current.value;
        let chiTietSP = [];

        multiSelectColors.current.value.forEach(maMau => {

            multiSelectSizes.current.value.forEach(maSize => {
                chiTietSP.push({ MA_MAU: maMau, MA_SIZE: maSize })
            });
        });

        uploadGeneralFileUpload();
        uploadDetailFileUploadComponents();

        console.log('pass', chiTietSP, `${process.env.REACT_APP_API_URL}/api/SanPham/add`)
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/SanPham/add`, {
                ...product,
                chiTietSanPham: chiTietSP,
                //mã nhân viên tạo sản phẩm
                MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
            }
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                // setProduct({
                //     ...product, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao hàng',
                //     MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN
                //     , MA_NV_GIAO: assignedEmpID, TEN_NV_GIAO: selectedItem.HO_TEN
                // })
                notify("Thêm sản phẩm thành công");

                props.rerender();
            });
        } catch (error) {
            console.error(error);
        }

    }

    let fields = { text: 'TEN_TL', value: 'MA_TL' };
    // filtering event handler to filter a Country

    const onCategoryFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_TL', 'startswith', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(categories, query);
    };

    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết sản phẩm ${props.productId}` : props.viewMode === 'edit' ? `Chỉnh sửa sản phẩm ${props.productId}` : `Thêm mới sản phẩm`
    }

    console.log('rerender, product: ', product)

    const generalFileChange = (file) => {
        console.log('11111111111', file)
        setProduct({ ...product, HINH_ANH: file.file.name })
    }

    const detailFileChange = (file) => {
        console.log('11111111111', file)

        let oldProduct = product;
        oldProduct.hinhAnhSanPham.find(item => {
            return item.MA_MAU === file.field //field là mã màu
        }).HINH_ANH = file.file.name;
        setProduct(oldProduct);

        // setProduct({ ...product, hinhAnhSanPham: [...product.hinhAnhSanPham, { MA_MAU: file.field, HINH_ANH: file.file.name }] })
    }


    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>

            <div className={clsx(style.top)}>
                <ToastContainer />
            </div>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                    props.closeDialog();
                }}><XIcon /></span></h1>

                <h1 className={clsx(style.title)}>{getTitle()}</h1>
                <div className={clsx(style.btnCheckContainer)}>
                    {/* không duyệt nữa, assign cho nhân viên là duyệt luôn */}
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
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Tên sản phẩm:</label>
                        <input onChange={(e) => {
                            //console.log(e.target.value, "fired")
                            setProduct({ ...product, TEN_SP: e.target.value })
                        }} type="text" name='TEN_SP'
                            value={product.TEN_SP}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTEN_SP}</p>}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Thể loại:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <DropDownListComponent id="category" ref={categoryDropdownList} dataSource={categories} filtering={onCategoryFiltering} filterBarPlaceholder='Tìm thể loại' allowFiltering={true} fields={fields} placeholder="Chọn thể loại cho sản phẩm" popupHeight="220px" />
                                </div>
                            </div>

                        </div>
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTHE_LOAI}</p>}
                    </div>

                    {/* <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Lượt xem:</label>
                        <input onChange={(e) => {
                            // setPassword(e.target.value.trim());
                            // handleChange("name1", e.target.value);
                        }} type="text" name='LUOT_XEM'
                            value={cart.LUOT_XEM}
                            placeholder="" className={clsx(style.input)}
                        />
                        {{errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""}}
                    </div> */}

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                        <div className={clsx(style.datePickerContainer, style.readOnly)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    <div className={clsx(style.inputGroup)}>
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

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Mô tả:</label>
                        <textarea maxLength={500} onChange={(e) => {
                            setProduct({ ...product, MO_TA: e.target.value })
                        }} type="text" placeholder="" /*value={email}*/
                            value={product.MO_TA} name='MO_TA' className={clsx(style.input)} />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorMO_TA}</p>}
                    </div>

                </div>

                <div className={clsx(style.inputGroup)}>
                    <FileUploadComponent
                        ref={generalFileInputRef}
                        field={'HINH_ANH_CHUNG'}
                        title={'Chọn hình ảnh chung'}
                        onSelectedOptionsChange={generalFileChange}
                        showUploadButton={false}
                    />
                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHUNG}</p>}
                </div>
                <div className={clsx(style.inputLabel, style.longLabel)}>Chọn hình ảnh chi tiết cho các màu: </div>
                <div className={clsx(style.detailFileUploadsContainer)}>
                    {
                        product.hinhAnhSanPham.map((item, index) => {
                            return (
                                <div className={clsx(style.inputGroup)} key={index} >
                                    <FileUploadComponent
                                        ref={el => detailFileInputRefs.current[index] = el}
                                        field={item.MA_MAU}
                                        title={colors.find(color => color.MA_MAU === item.MA_MAU).TEN_MAU}
                                        onSelectedOptionsChange={detailFileChange}
                                        showUploadButton={false}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHITIET}</p>}

                {/* detail */}

            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(ProductEdit);