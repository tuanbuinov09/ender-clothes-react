import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductReturnEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';

import { DateDiff, intToVNDCurrencyFormat, loadLocaleSyncfusion, removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { XIcon, CheckIcon, SaveIcon, PrintIcon } from '../../../icons';
import ToastContainer, { toast } from 'react-light-toast';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
function ProductReturnEdit(props) {
    let navigate = useNavigate();
    //const params = useParams(); prams.cartId
    console.log(props.returnId, props.viewMode);
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [flag, setFlag] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [customerCarts, setCustomerCarts] = useState([]);
    const [cartDetailAndReturnDetail, setCartDetailAndReturnDetail] = useState([]);
    const [filterState, setFilterState] = useState(2);// 2 is state of cart that is completed, in this return product view, we only need completed one

    const [errorMessage, setErrorMessage] = useState({ errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [productReturnEntity, setProductReturnEntity] = useState({ MA_NV: "", GHI_CHU: "", NGAY_TAO: "", chiTietPhieuTra: [] });

    removeSyncfusionLicenseMessage();

    const customerDropDownList = useRef();
    const datePicker = useRef();
    const grid = useRef()
    let editOptions, toolbarOptions;

    editOptions = { /*allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' */ };
    let pageSettings = { pageSize: 8 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };
    let tooltip;
    const beforeRender = (args) => {
        // event triggered before render the tooltip on target element.
        tooltip.current.content = args.target.closest("td").innerText;
    }
    beforeRender.bind(this);
    // toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    // toolbarOptions = ['Edit', 'Update', 'Cancel'];
    toolbarOptions = ['ColumnChooser'];


    const onChangeCustomer = (e) => {
        setIsLoading(true);
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        setErrorMessage(tmpErrorMsg);
        axios.get(`${process.env.REACT_APP_API_URL}/api/KhachHang/carts?filterState=${filterState}&customerId=${customerDropDownList.current.value}`).then(res => {
            res.data.forEach(item => {
                if (item.NGAY_TAO) {
                    let date = new Date(item.NGAY_TAO);
                    item.NGAY_TAO = date.toLocaleDateString('vi-VN');
                }
                if (item.NGAY_GIAO) {

                    item.NGAY_GIAO_TYPE_DATE = new Date(item.NGAY_GIAO);
                    // console.log(item.ID_GH, Math.abs(DateDiff.inDays(new Date(), item.NGAY_GIAO_TYPE_DATE)))

                    let date = new Date(item.NGAY_GIAO);
                    item.NGAY_GIAO = date.toLocaleDateString('vi-VN');
                }

                if (item.TRANG_THAI === 0) {
                    item.TRANG_THAI_STR = 'Chờ duyệt';
                }
                if (item.TRANG_THAI === 1) {
                    item.TRANG_THAI_STR = 'Đang giao hàng';
                }
                if (item.TRANG_THAI === 2) {
                    item.TRANG_THAI_STR = 'Đã hoàn tất';
                }
                if (item.TRANG_THAI === -1) {
                    item.TRANG_THAI_STR = 'Đã hủy';
                }
            })
            setCustomerCarts(res.data);

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

            let url = `${process.env.REACT_APP_API_URL}/api/KhachHang/all-has-purchased`;

            console.log(url)
            axios.get(url).then(res => {
                const customerFromApi = res.data;
                // console.log(customerFromApi);
                customerFromApi.forEach((item) => {
                    // if (item.NGAY_TAO) {
                    //     let date = new Date(item.NGAY_TAO);
                    //     item.NGAY_TAO = date.toLocaleDateString('vi-VN');
                    // }
                    // if (item.SIZE_STR) {
                    //     item.SIZE_STR = item.SIZE_STR.substr(1)
                    // }
                    let a = item.SDT + ' - ' + item.HO_TEN;
                    console.log(a)
                    item.HO_TEN_STR = a;

                })
                console.log(customerFromApi);

                setCustomers(customerFromApi);

                setIsLoading(false);
                // console.log(customersFromAPI);
                // grid.current.dataSource = customersFromAPI;
                setFlag(true);


                if (props.viewMode === 'add') {
                    console.log(datePicker)
                    datePicker.current.value = new Date();
                } else {
                    setIsLoading(true);
                    let url = `${process.env.REACT_APP_API_URL}/api/TraHang/?returnId=${props.returnId}`;
                    axios.get(url).then(res => {
                        console.log(res.data)
                        const productReturnEntityFromApi = res.data
                        setProductReturnEntity(productReturnEntityFromApi)
                        datePicker.current.value = productReturnEntityFromApi.NGAY_TAO;

                        customerDropDownList.current.value = productReturnEntityFromApi.MA_KH;

                        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
                        setErrorMessage(tmpErrorMsg);
                        axios.get(`${process.env.REACT_APP_API_URL}/api/KhachHang/carts?filterState=${filterState}&customerId=${productReturnEntityFromApi.MA_KH}`).then(res => {
                            res.data.forEach(item => {
                                if (item.NGAY_TAO) {
                                    let date = new Date(item.NGAY_TAO);
                                    item.NGAY_TAO = date.toLocaleDateString('vi-VN');
                                }
                                if (item.NGAY_GIAO) {

                                    item.NGAY_GIAO_TYPE_DATE = new Date(item.NGAY_GIAO);
                                    // console.log(item.ID_GH, Math.abs(DateDiff.inDays(new Date(), item.NGAY_GIAO_TYPE_DATE)))

                                    let date = new Date(item.NGAY_GIAO);
                                    item.NGAY_GIAO = date.toLocaleDateString('vi-VN');
                                }

                                if (item.TRANG_THAI === 0) {
                                    item.TRANG_THAI_STR = 'Chờ duyệt';
                                }
                                if (item.TRANG_THAI === 1) {
                                    item.TRANG_THAI_STR = 'Đang giao hàng';
                                }
                                if (item.TRANG_THAI === 2) {
                                    item.TRANG_THAI_STR = 'Đã hoàn tất';
                                }
                                if (item.TRANG_THAI === -1) {
                                    item.TRANG_THAI_STR = 'Đã hủy';
                                }
                            })
                            res.data = res.data.filter(item => {
                                return item.ID_GH === productReturnEntityFromApi.ID_GH
                            })
                            // console.log(a);
                            setCustomerCarts(res.data);

                            try {
                                axios.get(`${process.env.REACT_APP_API_URL}/api/GioHang/for-return?cartId=${productReturnEntityFromApi.ID_GH}`).then(res => {
                                    const response = res.data;
                                    console.log('res: ' + response);
                                    response.chiTietGioHang2.forEach(item => {
                                        if (!item.SL_DA_TRA) {
                                            item.SL_DA_TRA = 0;
                                        }
                                        let oneReturnDetail = productReturnEntityFromApi.chiTietPhieuTra.find(itemFromAPI => {
                                            return itemFromAPI.MA_CT_SP === item.MA_CT_SP
                                        })
                                        if (oneReturnDetail) {
                                            item.SL_TRA = oneReturnDetail.SL_TRA
                                        }
                                    })

                                    setCartDetailAndReturnDetail(response.chiTietGioHang2)

                                });
                            } catch (error) {
                                console.error(error);
                            }

                            // setProductReturnEntity({ ...productReturnEntity, chiTietPhieuNhap: a })
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

            } catch (error) {
                console.error(error);
            }
        } else {

        }

    }, []);



    loadLocaleSyncfusion();

    const validate = () => {
        let hasError = false;
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorSL_TRA_ALL: "" };

        if (!customerDropDownList.current.value) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng chọn khách hàng cần trả hàng" }
            hasError = true;
        }

        let item = cartDetailAndReturnDetail.some(item => {
            return item.SL_TRA > 0;
        })
        // if (!item) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorSO_LUONG_ALL: "*Tổng số lượng nhập của phiếu phải lớn hơn 0" }
        //     hasError = true;
        // }
        if (!item) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSL_TRA_ALL: "*Tổng số lượng muốn trả của phiếu phải lớn hơn 0" }
            hasError = true;
        }
        cartDetailAndReturnDetail.forEach(item => {
            //console.log('zzzzzz', item)
            item.errorSL_TRA = '';
            if (item.SL_TRA < 0) {
                item.errorSL_TRA = '*Số lượng muốn trả phải lớn hơn hoặc bằng 0'
                hasError = true;
            }
            if (!item.SL_TRA) {
                item.SL_TRA = 0;
            }

            if (item.SL_TRA > (item.SO_LUONG - item.SL_DA_TRA)) {
                item.errorSL_TRA = '*Tổng số lượng muốn trả và đã trả không được vượt quá số lượng đã mua'
                hasError = true;
            }

        })

        setErrorMessage(tmpErrorMsg)

        return hasError
    }


    const save = () => {
        if (validate()) {
            return;
        }

        let data = cartDetailAndReturnDetail.filter(item => {
            return item.SL_TRA > 0;
        })
        // console.log("data to send: ", data)

        let _productReturnEntity = {

            MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
            GHI_CHU: productReturnEntity.GHI_CHU,
            // NGAY_TAO: datePicker,
            chiTietPhieuTra: data
        }
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            _productReturnEntity.ID_GH = selectedrecords[0].ID_GH;
        } else {
            toast.error('Bạn chưa chọn đơn cần trả')
        }
        setProductReturnEntity(_productReturnEntity)

        console.log('pass', _productReturnEntity, `${process.env.REACT_APP_API_URL}/api/TraHang/add-product-return`)
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/TraHang/add-product-return`, _productReturnEntity
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                if (response.errorDesc)
                    // notify(response.responseMessage);
                    toast.error(response.responseMessage)

                //cập nhật lại số lượng đã trả, tránh trường hợp ấn lưu 2 lần
                let newArr = cartDetailAndReturnDetail.map(item => {
                    if (item.SL_TRA > 0) {
                        item.SL_DA_TRA = Number.parseInt(item.SL_DA_TRA + item.SL_TRA);
                    }
                    return item
                })

                setCartDetailAndReturnDetail(newArr);

                toast.success("Thêm phiếu trả thành công");
                props.rerender();
            });
        } catch (error) {
            console.error(error);
        }

    }

    let customerDropDownFields = { text: 'HO_TEN_STR', value: 'MA_KH' };
    // filtering event handler to filter a Country

    const onProductFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('HO_TEN_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(customers, query);
    };


    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết phiếu trả ${props.returnId}` : props.viewMode === 'edit' ? `Chỉnh sửa phiếu trả ${props.returnId}` : `Thêm mới phiếu trả`
    }

    // const getTotalPrice = () => {
    //     return customerCarts.reduce((total, item) => {
    //         return total = total + (item.SO_LUONG * item.GIA)
    //     }, 0)
    // }
    // const getTotalQuantity = () => {
    //     return customerCarts.reduce((total, item) => {
    //         return total = total + (item.SO_LUONG)
    //     }, 0)
    // }

    //nhập số lượng muốn trả
    const onChangeQuantity = (MA_CT_SP, quantity) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = cartDetailAndReturnDetail.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, SL_TRA: quantity };
            } else {
                return item;
            }
        });
        setCartDetailAndReturnDetail(newArray);

    }
    // const onChangePrice = (MA_CT_SP, price) => {
    //     // console.log(MA_CT_SP, quantity)
    //     const newArray = customerCarts.map((item, i) => {
    //         if (item.MA_CT_SP === MA_CT_SP) {
    //             return { ...item, GIA: price };
    //         } else {
    //             return item;
    //         }
    //     });
    //     setCustomerCarts(newArray);

    // }
    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
        }
    }

    const selectCart = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
            console.log(selectedrecords[0], Math.abs(DateDiff.inDays(new Date(), selectedrecords[0].NGAY_GIAO_TYPE_DATE)) - 1)

            const daysDiffer = Math.abs(DateDiff.inDays(new Date(), selectedrecords[0].NGAY_GIAO_TYPE_DATE)) - 1;

            if (daysDiffer > 5) {
                // notify('Đơn hàng giao từ hơn 5 ngày trước không thể thực hiện trả');
                toast.error('Đơn hàng giao từ hơn 5 ngày trước không thể thực hiện trả')
                return;
            }
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/api/GioHang/for-return?cartId=${selectedrecords[0].ID_GH}`).then(res => {
                    const response = res.data;
                    console.log('res: ' + response);
                    response.chiTietGioHang2.forEach(item => {
                        if (!item.SL_DA_TRA) {
                            item.SL_DA_TRA = 0;
                        }
                    })

                    setCartDetailAndReturnDetail(response.chiTietGioHang2)

                });
            } catch (error) {
                console.error(error);
            }

        }
    }

    // console.log('rerender, product: ', product)
    console.log('rerender input": ', customerCarts)
    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            <ToastContainer />
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
                        <label className={clsx(style.inputLabel)}>Khách hàng:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <DropDownListComponent id="customers" ref={customerDropDownList} dataSource={customers}
                                        filtering={onProductFiltering} filterBarPlaceholder='Tìm khách hàng' allowFiltering={true}
                                        fields={customerDropDownFields} placeholder="Chọn khách hàng cần trả hàng" popupHeight="220px"
                                        onChange={onChangeCustomer} />
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

                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                        <textarea maxLength={1000} onChange={(e) => {
                            console.log(e.target.value)
                            setProductReturnEntity({ ...productReturnEntity, GHI_CHU: e.target.value })
                        }} type="text" placeholder=""
                            value={productReturnEntity.GHI_CHU} name='GHI_CHU' className={clsx(style.input)} />
                        {<p className={clsx(style.errorMessage)}>{errorMessage.errorGHI_CHU}</p>}
                    </div>

                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                        <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                        <input type="text" placeholder="" disabled
                            value={
                                props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : productReturnEntity.HO_TEN_NV
                            } name='HO_TEN_NV' className={clsx(style.input)} />
                    </div>

                    {customerCarts.length > 0 ?
                        <>
                            <div className={clsx(style.toolBar)}>
                                <button onClick={() => {
                                    selectCart();
                                }} className={clsx(style.checkButton, style.saveButton, style.selectButton, { [style.inActive]: props.viewMode === 'view' })}><span className={clsx(style.iconSvg)}><CheckIcon /></span>Chọn</button>
                            </div>
                            <div className={clsx(style.customerCarts)}>

                                <GridComponent ref={grid}
                                    toolbar={toolbarOptions}
                                    showColumnChooser={true}
                                    //  actionComplete={actionComplete} 
                                    //  actionBegin={actionBegin}
                                    locale='vi-VN'
                                    editSettings={editOptions}
                                    pageSettings={pageSettings}
                                    dataSource={customerCarts} allowPaging={true} /*allowGrouping={true}*/
                                    allowSorting={true} allowFiltering={true}
                                    filterSettings={filterOptions} height={props.viewMode === 'add' ? 180 : 54}
                                    rowSelected={rowSelected}
                                    gridLines='Both'
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective field='MA_KH' headerTextAlign='Center' headerText='Mã KH' width='140' textAlign="Left" /*isPrimaryKey={true}*/ />
                                        <ColumnDirective field='HO_TEN_KH' headerTextAlign='Center' headerText='Tên KH' width='200' textAlign="Left" />
                                        <ColumnDirective field='SDT_KH' headerTextAlign='Center' headerText='SĐT KH' width='160' textAlign="Left" />
                                        <ColumnDirective field='EMAIL_KH' headerTextAlign='Center' headerText='Email KH' width='200' textAlign="Left" />

                                        {/* <ColumnDirective field='HO_TEN' headerTextAlign='Center' headerText='Người nhận' width='200' textAlign="Left" /> */}
                                        {/* <ColumnDirective field='SDT' headerTextAlign='Center' headerText='SĐT người nhận' width='200' editType='dropdownedit' textAlign="Left" /> */}

                                        {/* <ColumnDirective field='EMAIL' headerTextAlign='Center' headerText='Email người nhận' width='200' textAlign="Left" /> */}
                                        <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' headerText='Ngày tạo' width='160' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />
                                        <ColumnDirective field='NGAY_GIAO' headerTextAlign='Center' headerText='Ngày giao' width='160' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />
                                        <ColumnDirective field='DIA_CHI' headerTextAlign='Center' headerText='Địa chỉ nhận' width='200' textAlign="Left" />
                                        <ColumnDirective field='TRANG_THAI_STR' headerTextAlign='Center' headerText='Trạng thái' width='160' textAlign="Left" />


                                        <ColumnDirective field='TEN_NV_DUYET' headerTextAlign='Center' headerText='NV duyệt' width='160' textAlign="Left" />
                                        <ColumnDirective field='TEN_NV_GIAO' headerTextAlign='Center' headerText='NV giao' width='160' textAlign="Left" />


                                    </ColumnsDirective>
                                    <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
                                </GridComponent></div></>
                        : <></>

                    }
                    {cartDetailAndReturnDetail.length > 0 ?
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>SP - Màu /size</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số lượng đã mua</label>
                                {<p className={clsx(style.errorMessage)}>{errorMessage.errorSO_LUONG_ALL}</p>}
                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số lượng đã trả</label>

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                <label className={clsx(style.inputLabel)}>
                                    {props.viewMode === 'view' ? 'Số lượng trả' : 'Số lượng muốn trả'}
                                </label>
                                {<p className={clsx(style.errorMessage)}>{errorMessage.errorSL_TRA_ALL}</p>}
                            </div>
                        </>
                        : <></>}

                    {
                        cartDetailAndReturnDetail.map((item, index) => {
                            return (
                                <div key={index} className={clsx(style.quantityInputContainer)}>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        <input disabled onChange={(e) => {

                                        }} type="text" name='MAU_SIZE'
                                            value={`${item.TEN_SP} - ${item.TEN_MAU}/ ${item.TEN_SIZE}`}
                                            placeholder="" className={clsx(style.input)}
                                            title={`${item.TEN_SP} - ${item.TEN_MAU}/ ${item.TEN_SIZE}`}
                                        />

                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        <input disabled onChange={(e) => {
                                            // console.log(e.target.value)
                                            // onChangeQuantity(item.MA_CT_SP, e.target.value);
                                        }} type="number"
                                            value={cartDetailAndReturnDetail[index].SO_LUONG}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorSO_LUONG}</p>}
                                    </div>
                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        <input disabled onChange={(e) => {
                                            // console.log(e.target.value)
                                            // onChangePrice(item.MA_CT_SP, e.target.value);
                                        }} type="number"
                                            value={cartDetailAndReturnDetail[index].SL_DA_TRA}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorSL_DA_TRA}</p>}
                                    </div>

                                    <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                        <input onChange={(e) => {
                                            console.log(e.target.value)
                                            onChangeQuantity(item.MA_CT_SP, e.target.value);
                                        }} type="number" name='SL_TRA'
                                            value={cartDetailAndReturnDetail[index].SL_TRA}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            disabled={props.viewMode === 'view' ? true : false}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorSL_TRA}</p>}
                                    </div>
                                </div>
                            )
                        })
                    }

                    {customerCarts.length > 0 ?
                        // <div className={clsx(style.detailFileUploadsContainer)}>
                        <>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.totalLabel)}>Tổng số lượng: {getTotalQuantity()}</label> */}
                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                            </div>
                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                {/* <label className={clsx(style.totalLabel)}>Tổng giá nhập: {intToVNDCurrencyFormat(getTotalPrice(), true)}</label> */}

                            </div></>
                        // </div>
                        : <></>}
                    {/* {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHITIET}</p>} */}

                    {/* detail */}
                </div>

            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(ProductReturnEdit);