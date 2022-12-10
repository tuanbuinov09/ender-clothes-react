import React, { useEffect, useState, useRef } from 'react';
import "../ej2-grid.css";
import style from './ColorEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { XIcon, SaveIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import reactCSS from 'reactcss';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';
import { SketchPicker } from 'react-color';
function ColorEdit(props) {
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');
    // const params = useParams(); prams.cartId
    console.log(props.colorId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [inputModel, setInputModel] = useState({});
    const [flag, setFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ errorTEN_MAU: "" });


    removeSyncfusionLicenseMessage();


    // begin syncfusion react declaration
    const datePicker = useRef();
    const colorPicker = useRef();
    //chỉnh ngôn ngữ thư viện thành tiếng việt
    // loadLocaleSyncfusion();


    // end syncfusion react declaration
    useEffect(() => {

        if (!JSON.parse(localStorage.getItem('employee')).MA_NV) {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }
        setFlag(true);

    }, []);

    const getColor = async () => {
        let url = `${REACT_APP_API_URL}/api/BangMau?colorId=${props.colorId}`;
        console.log(url);
        axios.get(url).then(resp => {
            setInputModel(resp.data);
            setFlag(true);
            datePicker.current.value = resp.data.NGAY_TAO;
            colorPicker.current.value = resp.data.TEN_TIENG_ANH;
        })
    }
    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {
                getColor();

            } catch (error) {
                console.error(error);
            }
        } else {
            // setFlag(true);
            // datePicker.current.value = new Date();
            setInputModel({ ...inputModel, TEN_TIENG_ANH: '#333333' })
        }

    }, []);



    const validate = () => {
        //console.log(inputModel, categoryDropdownList.current.value, multiSelectColors.current.value, multiSelectMAUs.current.value)
        let hasError = false;
        let tmpErrorMsg = { errorTEN_MAU: "" };
        if (!inputModel.TEN_MAU) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_MAU: "*Vui lòng nhập tên màu" }
            //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
            hasError = true;
        }
        // if (!inputModel.TEN_TIENG_ANH) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorTEN_TIENG_ANH: "*Vui lòng chọn màu" }
        //     //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
        //     hasError = true;
        // }
        setErrorMessage(tmpErrorMsg)
        return hasError;
    }

    const save = () => {

        // inputModel.TEN_TIENG_ANH = colorPicker.current.value;

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
                url: `${process.env.REACT_APP_API_URL}/api/BangMau/${action}`,
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

            });
            // axios.post(`${process.env.REACT_APP_API_URL}/api/BangMau/${action}`, {
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
        return props.viewMode === 'view' ? `Chi tiết màu ${props.colorId}` : props.viewMode === 'edit' ? `Chỉnh sửa màu ${props.colorId}` : `Thêm mới màu`
    }
    L10n.load({
        'vi': {
            colorpicker: {
                'Apply': 'Áp dụng',
                'Cancel': 'Hủy',
                'ModeSwitcher': 'Đổi chế độ'
            }
        }
    });
    const styles = reactCSS({
        'default': {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: inputModel.TEN_TIENG_ANH,
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
                marginTop: '4px',
                marginLeft: '12px',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const handleChangeColor = (e) => {
        setInputModel({ ...inputModel, TEN_TIENG_ANH: e.hex })
    }

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker)
    };

    const handleClose = () => {
        setDisplayColorPicker(!displayColorPicker)
    };
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
                        <label className={clsx(style.inputLabel, style.longLabel)}>Tên Màu/ màu hiển thị:</label>
                        <div className={clsx(style.colorInput)}>
                            <input disabled={props.viewMode === 'view'}
                                maxLength={50}
                                onChange={(e) => {
                                    //console.log(e.target.value, "fired")
                                    setInputModel({ ...inputModel, TEN_MAU: e.target.value.trim() })
                                }} type="text" name='TEN_MAU'
                                value={inputModel.TEN_MAU}
                                placeholder="" className={clsx(style.input)}
                            />
                            <div className={clsx(style.colorPicker)} id='container'>
                                {/* <ColorPickerComponent id='colorPicker' onChange={() => {
                                }} ref={colorPicker} locale='vi' /> */}
                                <div>
                                    <div style={styles.swatch} onClick={handleClick}>
                                        <div style={styles.color} />
                                    </div>
                                    {displayColorPicker ? <div style={styles.popover}>
                                        <div style={styles.cover} onClick={handleClose} />
                                        <SketchPicker color={inputModel.TEN_TIENG_ANH} onChange={handleChangeColor} />
                                    </div> : null}

                                </div>
                            </div>

                        </div>

                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorTEN_MAU}</p>}
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
export default React.memo(ColorEdit);