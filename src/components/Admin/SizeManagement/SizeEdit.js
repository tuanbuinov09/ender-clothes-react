import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './SizeEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent, DateRangePicker } from '@syncfusion/ej2-react-calendars';

import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import FileUploadComponent from '../../FileUploadComponent/FileUploadComponent';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function SizeEdit(props) {
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.sizeId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [inputModel, setInputModel] = useState({});
    const [flag, setFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ errorTEN_SIZE: "" });


    removeSyncfusionLicenseMessage();
    //chỉnh ngôn ngữ thư viện thành tiếng việt
    loadLocaleSyncfusion();

    // begin syncfusion react declaration
    const datePicker = useRef();

    // end syncfusion react declaration
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')).MA_NV) {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }
        setFlag(true);

    }, []);

    const getSize = async () => {
        let url = `${REACT_APP_API_URL}/api/BangSize?sizeId=${props.sizeId}`;
        console.log(url);
        axios.get(url).then(resp => {
            setInputModel(resp.data);
            setFlag(true);
            datePicker.current.value = resp.data.NGAY_TAO;
        })
    }
    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {
                getSize();

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
        let tmpErrorMsg = { errorTEN_SIZE: "" };
        if (!inputModel.TEN_SIZE) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SIZE: "*Vui lòng nhập tên size" }
            //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
            hasError = true;
        }
        setErrorMessage(tmpErrorMsg)
        return hasError;
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
                url: `${process.env.REACT_APP_API_URL}/api/BangSize/${action}`,
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
            // axios.post(`${process.env.REACT_APP_API_URL}/api/BangSize/${action}`, {
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
        return props.viewMode === 'view' ? `Chi tiết size ${props.sizeId}` : props.viewMode === 'edit' ? `Chỉnh sửa size ${props.sizeId}` : `Thêm mới size`
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
                        <label className={clsx(style.inputLabel)}>Tên size:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={50}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, TEN_SIZE: e.target.value.trim() })
                            }} type="text" name='TEN_SIZE'
                            value={inputModel.TEN_SIZE}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTEN_SIZE}</p>}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                        <div className={clsx(style.datePickerContainer, style.readOnly)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} value={props.viewMode === 'add' ? new Date() : inputModel.NGAY_TAO} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                        <input type="text" placeholder="" disabled
                            value={
                                props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : inputModel.HO_TEN_NV
                            } name='HO_TEN_NV' className={clsx(style.input)} />
                    </div>

                </div>
            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(SizeEdit);