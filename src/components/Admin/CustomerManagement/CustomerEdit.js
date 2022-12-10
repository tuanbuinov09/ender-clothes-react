import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './CustomerEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { XIcon, SaveIcon, CheckIcon, } from '../../../icons';
import { toast } from 'react-toastify';

import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function CustomerEdit(props) {
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.customerId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [inputModel, setInputModel] = useState({});
    const [flag, setFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ errorHO_TEN: "" });


    removeSyncfusionLicenseMessage();
    //chỉnh ngôn ngữ thư viện thành tiếng việt
    loadLocaleSyncfusion();

    // begin syncfusion react declaration
    const datePicker = useRef();

    // end syncfusion react declaration
    useEffect(() => {
        // console.log(JSON.parse(localStorage.getItem('employee')).MA_NV);

        if (!JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q02') {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }
        setFlag(true);

    }, []);

    const getCustomer = async () => {
        let url = `${REACT_APP_API_URL}/api/KhachHang?customerId=${props.customerId}`;
        console.log(url);
        axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
            }
        }).then(resp => {
            if (!resp.data.TRANG_THAI) {
                resp.data.TRANG_THAI_STR = 'Đã vô hiệu hóa';
            } else if (resp.data.TRANG_THAI) {
                resp.data.TRANG_THAI_STR = 'Đang hoạt động';
            }
            setInputModel(resp.data);
            setFlag(true);
            datePicker.current.value = resp.data.NGAY_TAO;
        })
    }
    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {
                getCustomer();

            } catch (error) {
                console.error(error);
            }
        } else {
            // setFlag(true);
            // datePicker.current.value = new Date();
        }

    }, []);



    const validate = () => {
        //console.log(inputModel, categoryDropdownList.current.value, multiSelectColors.current.value, multiSelectSizes.current.value)
        let hasError = false;
        let tmpErrorMsg = { errorHO_TEN: "" };
        if (!inputModel.HO_TEN) {
            tmpErrorMsg = { ...tmpErrorMsg, errorHO_TEN: "*Vui lòng nhập tên size" }
            //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
            hasError = true;
        }
        setErrorMessage(tmpErrorMsg)
        return hasError;
    }
    const activate = () => {

        console.log(JSON.parse(localStorage.getItem('employee')).accessToken);
        console.log(`${process.env.REACT_APP_API_URL}/api/KhachHang/activate`)
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/KhachHang/activate?customerId=${props.customerId}`
                , {},
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    console.log('res activate: ' + response);
                    if (response.errorDesc) {
                        toast.error(response.errorDesc);
                    } else {
                        toast.success(response.responseMessage);
                        inputModel.TRANG_THAI = true;
                        inputModel.TRANG_THAI_STR = 'Đang hoạt động';
                        props.rerender();
                    }
                });
        } catch (error) {
            console.error(error);
        }

    }
    const save = () => {
        if (validate()) {
            return;
        }
        let action = '';
        let method = '';
        if (props.viewMode === 'edit') {
            action = 'edit';
            method = 'put';
        } else if (props.viewMode === 'add') {
            action = 'add';
            method = 'post';
        }

        try {
            axios({
                method: method,
                url: `${process.env.REACT_APP_API_URL}/api/KhachHang/${action}`,
                data: {
                    ...inputModel,
                    //mã nhân viên
                    MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
                }
                , headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken }
            }).then(res => {
                const response = res.data;
                console.log('res: ' + response);

                if (response.affectedId) {
                    toast.success(response.responseMessage);
                    props.rerender();
                } else {
                    toast.error(response.errorDesc);
                }

            });;
            // axios.post(`${process.env.REACT_APP_API_URL}/api/KhachHang/${action}`, {
            //     ...inputModel,
            //     //mã nhân viên
            //     MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
            // },
            //     {
            //         headers: {
            //             Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
            //         }
            //     }
            // ).then(res => {
            //     const response = res.data;
            //     console.log('res: ' + response);

            //     if (response.affectedId) {
            //         toast.success(response.responseMessage);
            //         props.rerender();
            //     } else {
            //         toast.error(response.errorDesc);
            //     }

            // });
        } catch (error) {
            console.error(error);
        }

    }

    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết khách hàng ${props.customerId}` : props.viewMode === 'edit' ? `Chỉnh sửa khách hàng ${props.customerId}` : `Thêm mới khách hàng`
    }

    console.log('rerender, inputModel: ', inputModel)

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
                    <button onClick={() => {
                        activate();
                    }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: inputModel.TRANG_THAI }, style.activateButton)}>
                        <span className={clsx(style.iconSvg)}><CheckIcon /></span>Kích hoạt
                    </button>
                    {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ?
                        <>
                            {/* <button onClick={() => {
                                save();
                            }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: props.viewMode === 'view' })}>
                                <span className={clsx(style.iconSvg)}><SaveIcon /></span>Lưu
                            </button> */}
                        </>
                        : <></>
                    }

                </div>

                <div className={clsx(style.cartInfo, style.form)}>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Tên khách hàng:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={60}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, HO_TEN: e.target.value.trim() })
                            }} type="text" name='HO_TEN'
                            value={inputModel.HO_TEN}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorHO_TEN}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Email:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={60}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, EMAIL: e.target.value.trim() })
                            }} type="text" name='EMAIL'
                            value={inputModel.EMAIL}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorEMAIL}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Số điện thoại:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={60}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, SDT: e.target.value.trim() })
                            }} type="text" name='SDT'
                            value={inputModel.SDT}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorSDT}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={200}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, DIA_CHI: e.target.value.trim() })
                            }} type="text" name='DIA_CHI'
                            value={inputModel.DIA_CHI}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorDIA_CHI}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày đăng ký:</label>
                        <div className={clsx(style.datePickerContainer, style.readOnly)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} value={props.viewMode === 'add' ? new Date() : inputModel.NGAY_TAO} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Trạng thái:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={60}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, TRANG_THAI_STR: e.target.value.trim() })
                            }} type="text" name='TRANG_THAI_STR'
                            value={inputModel.TRANG_THAI_STR}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTRANG_THAI_STR}</p>}
                    </div>
                    {/* <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                        <input type="text" placeholder="" disabled
                            value={
                                props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : inputModel.HO_TEN_NV
                            } name='HO_TEN_NV' className={clsx(style.input)} />
                    </div> */}

                </div>
            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(CustomerEdit);