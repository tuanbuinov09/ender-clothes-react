import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon, EditIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import FileUploadComponent from '../../FileUploadComponent/FileUploadComponent';
import { REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL, REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function ProductEdit(props) {
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.productId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

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
    const multiSelectColorsFields = { text: 'TEN_MAU', value: 'MA_MAU' };
    const multiSelectSizesFields = { text: 'TEN_SIZE', value: 'MA_SIZE' };

    const [isShowEditImages, setIsShowEditImages] = useState(props.viewMode === 'add' ? true : false);

    let oldSizes = useRef();
    let oldColors = useRef();

    console.log(oldSizes, oldColors);

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

        if (props.viewMode === 'edit') {
            let oldColorsDeleted = false;
            oldColors.current.forEach((item) => {
                //nếu có màu bị loại bỏ khi update
                if (!multiSelectColors.current.value.includes(item)) {

                    oldColorsDeleted = true;
                    return;
                }
            })
            if (oldColorsDeleted) {
                multiSelectColors.current.value = oldColors.current;
                toast.error("Chỉ có thể thêm màu, không thể xóa màu đã chọn khi tạo sản phẩm");
            }
        }


        const initHinhAnhSanPham = multiSelectColors.current.value.map(item => {
            return { MA_MAU: item, HINH_ANH: null };
        })
        setProduct({ ...product, hinhAnhSanPham: initHinhAnhSanPham })
    }
    const onChangeSizes = (e) => {

        if (props.viewMode === 'edit') {
            let oldSizesDeleted = false;
            oldSizes.current.forEach((item) => {
                //nếu có màu bị loại bỏ khi update
                if (!multiSelectSizes.current.value.includes(item)) {

                    oldSizesDeleted = true;
                    return;
                }
            })
            if (oldSizesDeleted) {
                multiSelectSizes.current.value = oldSizes.current;
                toast.error("Chỉ có thể thêm size, không thể xóa size đã chọn khi tạo sản phẩm");
            }
        }

    }
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')).MA_NV) {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }

    }, [])
    useEffect(() => {
        try {
            axios.get(`${REACT_APP_API_URL}/api/TheLoai`).then(res => {
                const categoriesFromAPI = res.data.filter((item) => {
                    return !!item.MA_TL_CHA;
                });
                //console.log(categoriesFromAPI)
                setCategories(categoriesFromAPI);
                setFlag(true);

                axios.get(`${REACT_APP_API_URL}/api/BangMau/all`).then(res => {
                    //console.log("Bang Mau: ", res.data)
                    setColors(res.data);

                    axios.get(`${REACT_APP_API_URL}/api/BangSize/all`).then(res => {
                        //console.log("Bang Size: ", res.data)
                        setSizes(res.data);


                        if (props.viewMode === 'view' || props.viewMode === 'edit') {
                            try {

                                axios.get(`${REACT_APP_API_URL}/api/SanPham?productId=${props.productId}`).then(res => {
                                    const response = res.data[0];

                                    // lấy hình ảnh để show, muốn sửa có luồng riêng
                                    if (response.HINH_ANH && !response.HINH_ANH.startsWith('http')) {
                                        response.HINH_ANH_FOR_SHOW = `${REACT_APP_API_URL}/${REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL}/${response.HINH_ANH}`
                                    } else {
                                        response.HINH_ANH_FOR_SHOW = response.HINH_ANH;
                                    }
                                    const hinhAnhSanPham_FOR_SHOW = [];
                                    response.chiTietSanPham.forEach(item => {
                                        //nếu data cũ hình sẽ có http, data mới thì k
                                        if (item.HINH_ANH && !item.HINH_ANH.startsWith('http')) {
                                            item.HINH_ANH_FOR_SHOW = `${REACT_APP_API_URL}/${REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL}/${item.HINH_ANH}`
                                        } else {
                                            item.HINH_ANH_FOR_SHOW = item.HINH_ANH;
                                        }
                                        const isExists = hinhAnhSanPham_FOR_SHOW.find(im => {
                                            return im.MA_MAU === item.MA_MAU;
                                        })
                                        if (!isExists) {
                                            hinhAnhSanPham_FOR_SHOW.push(item);
                                        }
                                    })

                                    response.hinhAnhSanPham_FOR_SHOW = hinhAnhSanPham_FOR_SHOW;
                                    //

                                    setProduct(response);

                                    //set nhân viên đã được assign   
                                    setFlag(true);

                                    categoryDropdownList.current.value = response.MA_TL;

                                    const listSelectedSizes = [];
                                    response.chiTietSanPham.forEach((item) => {
                                        if (!listSelectedSizes.includes(item.MA_SIZE)) {
                                            listSelectedSizes.push(item.MA_SIZE);
                                        }
                                    });

                                    oldSizes.current = listSelectedSizes;

                                    multiSelectSizes.current.value = listSelectedSizes;

                                    const listSelectedColors = [];
                                    response.chiTietSanPham.forEach((item) => {
                                        if (!listSelectedColors.includes(item.MA_MAU)) {
                                            listSelectedColors.push(item.MA_MAU);
                                        }
                                    });

                                    oldColors.current = listSelectedColors;

                                    multiSelectColors.current.value = listSelectedColors;
                                });

                            } catch (error) {
                                console.error(error);
                            }
                        } else {


                        }
                    })
                })
            })


        } catch (e) {
            console.log(e);
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
        if (props.viewMode === 'add') {

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
        } else {
            let listColorNoImages = [];
            product.hinhAnhSanPham.forEach(item => {
                if (!item.HINH_ANH && !oldColors.current.includes(item.MA_MAU) && multiSelectColors.current.value.includes(item.MA_MAU)) {
                    listColorNoImages.push(colors.find(item1 => item.MA_MAU === item1.MA_MAU).TEN_MAU);
                    tmpErrorMsg = { ...tmpErrorMsg, errorHINH_ANH_CHITIET: `*Vui lòng chọn hình ảnh cho (các) màu mới được thêm: ${listColorNoImages.join(', ')}` }
                    // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
                    hasError = true;
                }
            });
            console.log(listColorNoImages)
        }

        setErrorMessage(tmpErrorMsg);
        return hasError;
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

        console.log(product, chiTietSP);

        //nếu đang sửa hình mới up hình

        if (isShowEditImages) {
            uploadGeneralFileUpload();
            uploadDetailFileUploadComponents();
        }


        if (props.viewMode === 'edit') {
            console.log('pass', chiTietSP, `${process.env.REACT_APP_API_URL}/api/SanPham/edit`)

            try {
                axios.put(`${process.env.REACT_APP_API_URL}/api/SanPham/edit`, {
                    ...product,
                    chiTietSanPham: chiTietSP,
                    //mã nhân viên tạo sản phẩm
                    MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                        }
                    }
                ).then(res => {
                    const response = res.data;
                    console.log('res: ' + response);
                    // setProduct({
                    //     ...product, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao hàng',
                    //     MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN
                    //     , MA_NV_GIAO: assignedEmpID, TEN_NV_GIAO: selectedItem.HO_TEN
                    // })
                    if (response.errorDesc) {
                        toast.error(response.errorDesc);
                    } else {
                        toast.success("Sửa sản phẩm thành công");
                        setProduct({ ...product, NGAY_TAO: new Date() })
                        props.rerender();
                    }

                });
            } catch (error) {
                console.error(error);
            }

            return;
        }

        console.log('pass', chiTietSP, `${process.env.REACT_APP_API_URL}/api/SanPham/add`)

        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/SanPham/add`, {
                ...product,
                chiTietSanPham: chiTietSP,
                //mã nhân viên tạo sản phẩm
                MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                // setProduct({
                //     ...product, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao hàng',
                //     MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN
                //     , MA_NV_GIAO: assignedEmpID, TEN_NV_GIAO: selectedItem.HO_TEN
                // })

                toast.success("Thêm sản phẩm thành công");

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
                {/* <ToastContainer /> */}
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
                            }} ref={datePicker} format={'dd/MM/yyyy'} locale='vi'
                                value={props.viewMode === 'add' ? new Date() : product.NGAY_TAO} />
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
                                    <MultiSelectComponent onChange={onChangeSizes} ref={multiSelectSizes} id="multiSelectSizes" dataSource={sizes} fields={multiSelectSizesFields} filtering={onSizeFiltering} filterBarPlaceholder='Tìm size' allowFiltering={true} placeholder="Chọn các size của sản phẩm" />
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

                {props.viewMode === 'edit' ?
                    <>
                        {!isShowEditImages ?

                            <button onClick={() => {
                                setIsShowEditImages(true);

                            }} className={clsx(style.checkButton, style.editButton, { [style.inActive]: props.viewMode === 'view' })}>
                                <span className={clsx(style.iconSvg)}><EditIcon /></span>Chỉnh sửa hình ảnh
                            </button>

                            : <>
                                <div>
                                    <button onClick={() => {
                                        setIsShowEditImages(false);

                                    }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: props.viewMode === 'view' })}>
                                        <span className={clsx(style.iconSvg)}><EditIcon /></span>Hủy
                                    </button><p className={clsx(style.imageLink, style.tooltip)}>{'Lưu ý: Nếu không chọn mới, hình ảnh tương ứng sẽ được giữ nguyên'}</p>
                                </div>
                            </>}
                    </> : <></>}

                {isShowEditImages ? <div className={clsx(style.inputGroup)}>
                    <FileUploadComponent
                        ref={generalFileInputRef}
                        field={'HINH_ANH_CHUNG'}
                        title={'Chọn hình ảnh chung'}
                        onSelectedOptionsChange={generalFileChange}
                        showUploadButton={false}
                    />
                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHUNG}</p>}
                </div> : <><div className={clsx(style.inputLabel, style.longLabel)}>Hình ảnh chung: </div>
                    <div className={clsx(style.inputGroup)} >
                        <img src={product.HINH_ANH_FOR_SHOW} alt={product.TEN_SP} />
                    </div>
                </>}




                {isShowEditImages ? <div className={clsx(style.inputLabel, style.longLabel)}>Chọn hình ảnh chi tiết cho các màu: </div> :
                    <div className={clsx(style.inputLabel, style.longLabel)}>Hình ảnh chi tiết của các màu: </div>}

                {isShowEditImages ?
                    <div className={clsx(style.detailFileUploadsContainer)}>
                        {
                            product.hinhAnhSanPham && product.hinhAnhSanPham.map((item, index) => {
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
                    </div> :
                    <div className={clsx(style.detailFileUploadsContainer)}>
                        {
                            product.hinhAnhSanPham_FOR_SHOW && product.hinhAnhSanPham_FOR_SHOW.map((item, index) => {
                                return (
                                    <div className={clsx(style.inputGroup)} key={index} >
                                        <p className={clsx(style.imageLink)}
                                        //  onClick={(e) => {
                                        //     console.log(item.HINH_ANH);
                                        //     window.open(item.HINH_ANH, '_blank', '');
                                        // }}
                                        >{`${item.TEN_MAU}:`}</p>

                                        <img src={item.HINH_ANH_FOR_SHOW} alt={item.TEN_MAU} />
                                    </div>
                                )
                            })
                        }
                    </div>
                }


                {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHITIET}</p>}

                {/* detail */}

            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(ProductEdit);