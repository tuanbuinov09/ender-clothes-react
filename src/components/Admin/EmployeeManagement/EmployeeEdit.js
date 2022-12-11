import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './EmployeeEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors, isValidPhone } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { XIcon, SaveIcon, CheckIcon, } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { Query } from '@syncfusion/ej2-data';
import { ModalConfirmDialog } from '../../ModalConfirmDialog/ModalConfirmDialog';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function EmployeeEdit(props) {
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.employeeId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [inputModel, setInputModel] = useState({ EMAIL: '', SDT: '', CMND: '', MAT_KHAU: '' });
    const [flag, setFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ errorHO_TEN: "" });
    const [roles, setRoles] = useState([]);

    removeSyncfusionLicenseMessage();
    //chỉnh ngôn ngữ thư viện thành tiếng việt
    loadLocaleSyncfusion();

    // begin syncfusion react declaration
    const datePicker = useRef();
    const dropdownList = useRef();

    let fields = { text: 'QUYEN_STR', value: 'MA_QUYEN' };
    // filtering event handler to filter a Country

    const onFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('QUYEN_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(roles, query);
    };
    const handleSelectRole = (e) => {
        setInputModel({ ...inputModel, MA_QUYEN: dropdownList.current.value });
    }
    // end syncfusion react declaration
    useEffect(() => {
        // console.log(JSON.parse(localStorage.getItem('employee')).MA_NV);

        if (!JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q02') {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }

        try {
            axios.get(`${REACT_APP_API_URL}/api/Quyen/all`).then(res => {
                const response = res.data;
                console.log("role:", response);
                response.forEach((role) => {
                    const tenQuyen = role.TEN_QUYEN === 'NHAN_VIEN' ? 'Nhân viên' : role.TEN_QUYEN === 'QUAN_LY' ? 'Quản lý' : role.TEN_QUYEN === 'NHAN_VIEN_GH' ? 'Nhân viên vận chuyển' : '';
                    role.QUYEN_STR = /*role.MA_QUYEN + ' - '*/ '' + tenQuyen;
                })
                const index = response.findIndex(item => {
                    return item.MA_QUYEN === 'Q03'; //bỏ quyền khách hàng ra
                });
                response.splice(index, 1);

                setRoles(response);
                if (props.viewMode === 'add') {
                    dropdownList.current.value = 'Q01';
                }

                //đưa vào đây để tránh trường hợp quyền set null do chưa có data trong dropdown
                if (props.viewMode === 'view' || props.viewMode === 'edit') {
                    try {
                        getEmployee();

                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    //maật khẩu mặc định 123456, set cả dưới asp.net core
                    setInputModel({ ...inputModel, TRANG_THAI_STR: 'Đang hoạt động', TRANG_THAI: true, MAT_KHAU: '123456' });

                    setFlag(true);
                    // datePicker.current.value = new Date();
                }
            });
        } catch (error) {
            console.error(error);
        }

        setFlag(true);

    }, []);

    const getEmployee = async () => {
        let url = `${REACT_APP_API_URL}/api/NhanVien?employeeId=${props.employeeId}`;
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
            //này chỉ là mật khẩu để hiện thị, mật khẩu chỉ được thay đổi bằng nút resetPassword
            resp.data.MAT_KHAU = '123456';
            dropdownList.current.value = resp.data.MA_QUYEN;
            setInputModel(resp.data);
            setFlag(true);
            datePicker.current.value = resp.data.NGAY_TAO;
        })
    }
    useEffect(() => {


    }, []);


    const checkExisting = async (email, phone, cmnd) => {
        const action = props.viewMode === 'add' ? 'add' : props.viewMode === 'edit' ? 'edit' : '';
        let res1 = await axios.post(`${REACT_APP_API_URL}/api/NhanVien/validate-${action}`, {
            SDT: phone,
            EMAIL: email,
            CMND: cmnd,
            MA_NV: inputModel.MA_NV
        },
            {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                }
            }).then(res => {
                const userInfoFromRes = res.data;
                console.log(userInfoFromRes);
                return userInfoFromRes;
            });
        return res1;
    }

    const validate = async () => {
        //console.log(inputModel, categoryDropdownList.current.value, multiSelectColors.current.value, multiSelectSizes.current.value)
        let hasError = false;
        let validateResult;
        await checkExisting(inputModel.EMAIL, inputModel.SDT, inputModel.CMND).then(res => {
            validateResult = res;
        });
        console.log(validateResult)
        let tmpErrorMsg = {};
        if (!inputModel.HO_TEN) {
            tmpErrorMsg = { ...tmpErrorMsg, errorHO_TEN: "*Vui lòng nhập tên" }
            //setErrorMessage({...errorMessage, errorName: "Vui lòng nhập tên người nhận"});
            hasError = true;
        }
        if (!inputModel.SDT) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSDT: "*Vui lòng nhập số điện thoại" }
            //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại"});
            hasError = true;
        } else if (!isValidPhone(inputModel.SDT)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSDT: "*Vui lòng nhập số điện thoại hợp lệ" }
            console.log("fail phone")
            //setErrorMessage({...errorMessage, errorPhone: "Vui lòng nhập số điện thoại hợp lệ"});
            hasError = true;
        } else if (validateResult.SDT === '1') {
            tmpErrorMsg = { ...tmpErrorMsg, errorSDT: "*Số điện thoại đã được sử dụng" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        }
        if (!inputModel.EMAIL) {
            tmpErrorMsg = { ...tmpErrorMsg, errorEMAIL: "*Vui lòng nhập email" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email người nhận"});
            hasError = true;
        } else if (!inputModel.EMAIL.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorEMAIL: "*Vui lòng nhập email hợp lệ" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        } else if (validateResult.EMAIL === '1') {
            tmpErrorMsg = { ...tmpErrorMsg, errorEMAIL: "*Email đã được sử dụng" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        }
        if (!inputModel.CMND) {
            tmpErrorMsg = { ...tmpErrorMsg, errorCMND: "*Vui lòng nhập CMND" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email người nhận"});
            hasError = true;
        } else if (!inputModel.CMND.match(/^\d+$/)) {
            tmpErrorMsg = { ...tmpErrorMsg, errorCMND: "*Vui lòng nhập CMND hợp lệ" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        } else if (validateResult.CMND === '1') {
            tmpErrorMsg = { ...tmpErrorMsg, errorCMND: "*CMND đã được sử dụng" }
            //setErrorMessage({...errorMessage, errorEmail: "Vui lòng nhập email hợp lệ"});
            hasError = true;
        }
        if (!inputModel.DIA_CHI) {
            tmpErrorMsg = { ...tmpErrorMsg, errorDIA_CHI: "*Vui lòng nhập địa chỉ" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        // console.log(inputModel.MAT_KHAU.length)
        if (!inputModel.MAT_KHAU) {
            console.log("no pass");
            tmpErrorMsg = { ...tmpErrorMsg, errorMAT_KHAU: "*Vui lòng nhập mật khẩu" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        } else if (!(inputModel.MAT_KHAU.length >= 6)) {
            console.log("pass < 6")
            tmpErrorMsg = { ...tmpErrorMsg, errorMAT_KHAU: "*Vui lòng nhập mật khẩu ít nhất 6 ký tự" }
            // setErrorMessage({...errorMessage, errorAddress: "Vui lòng nhập địa chỉ người nhận"});
            hasError = true;
        }
        setErrorMessage(tmpErrorMsg);
        return hasError;
    }
    const activate = () => {

        console.log(JSON.parse(localStorage.getItem('employee')).accessToken);
        console.log(`${process.env.REACT_APP_API_URL}/api/NhanVien/activate`)
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/NhanVien/activate?employeeId=${props.employeeId}`
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
    const resetPassword = () => {

        console.log(JSON.parse(localStorage.getItem('employee')).accessToken);
        console.log(`${process.env.REACT_APP_API_URL}/api/NhanVien/reset-password`)
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/NhanVien/reset-password?employeeId=${props.employeeId}`
                , {},
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    console.log('res reset password: ' + response);
                    if (response.errorDesc) {
                        toast.error(response.errorDesc);
                    } else {
                        toast.success(response.responseMessage);
                        props.rerender();
                    }
                });
        } catch (error) {
            console.error(error);
        }

    }
    const save = async () => {
        const validateResult = await validate();
        console.log(validateResult)
        if (validateResult) {
            return;
        }
        console.log(validate());
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
                url: `${process.env.REACT_APP_API_URL}/api/NhanVien/${action}`,
                data: {
                    ...inputModel,
                    // //mã nhân viên
                    // MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
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
            // axios.post(`${process.env.REACT_APP_API_URL}/api/NhanVien/${action}`, {
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
        return props.viewMode === 'view' ? `Chi tiết nhân viên ${props.employeeId}` : props.viewMode === 'edit' ? `Chỉnh sửa nhân viên ${props.employeeId}` : `Thêm mới nhân viên`
    }
    // 
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState('');

    const onConfirmResetPassword = () => {
        resetPassword();
        setShowConfirmDialog(false);
    }
    const onDeny = () => {
        setShowConfirmDialog(false);
    }
    //
    console.log('rerender, inputModel: ', inputModel)

    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>
            {showConfirmDialog && <ModalConfirmDialog onConfirm={onConfirmResetPassword} onDeny={onDeny} title={confirmDialogTitle} />}
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
                    <button onClick={() => {
                        if (!inputModel.MA_NV) {
                            return;
                        }
                        setShowConfirmDialog(true);
                        setConfirmDialogTitle('Xác nhận reset mật khẩu tài khoản nhân viên ' + inputModel.HO_TEN);
                    }} className={clsx(style.checkButton, style.saveButton, style.resetPasswordButton)} title='Phục hồi mật khẩu thành 123456'>
                        <span className={clsx(style.iconSvg)}><CheckIcon /></span>Reset mật khẩu
                    </button>
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
                        <label className={clsx(style.inputLabel)}>Tên nhân viên:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={60}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, HO_TEN: e.target.value })
                            }} type="text" name='HO_TEN'
                            value={inputModel.HO_TEN}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorHO_TEN}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Email:</label>
                        <input disabled={props.viewMode === 'view' || props.viewMode === 'edit'}
                            maxLength={50}
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
                            maxLength={15}
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
                        <label className={clsx(style.inputLabel)}>CMND:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={15}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, CMND: e.target.value.trim() })
                            }} type="text" name='CMND'
                            value={inputModel.CMND}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorCMND}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                        <input disabled={props.viewMode === 'view'}
                            maxLength={200}
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, DIA_CHI: e.target.value })
                            }} type="text" name='DIA_CHI'
                            value={inputModel.DIA_CHI}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorDIA_CHI}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Quyền:</label>
                        <div className={clsx(style.datePickerContainer, { [style.readOnly]: props.viewMode === 'view' })}>
                            <DropDownListComponent id="roleList" ref={dropdownList} dataSource={roles} filtering={onFiltering} filterBarPlaceholder='Tìm quyền' allowFiltering={true} fields={fields} placeholder="Chọn quyền" popupHeight="220px" onChange={handleSelectRole} />
                        </div>
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorQUYEN}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Mật khẩu:</label>
                        <input disabled
                            title='Mật khẩu mặc định khi tạo mới nhân viên là 123456'
                            onChange={(e) => {
                                //console.log(e.target.value, "fired")
                                setInputModel({ ...inputModel, MAT_KHAU: e.target.value.trim() })
                            }} type="password" name='MAT_KHAU'
                            value={inputModel.MAT_KHAU}
                            placeholder="" className={clsx(style.input)}
                        />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorMAT_KHAU}</p>}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                        <div className={clsx(style.datePickerContainer, style.readOnly)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} value={props.viewMode === 'add' ? new Date() : inputModel.NGAY_TAO} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Trạng thái:</label>
                        <input disabled
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
export default React.memo(EmployeeEdit);