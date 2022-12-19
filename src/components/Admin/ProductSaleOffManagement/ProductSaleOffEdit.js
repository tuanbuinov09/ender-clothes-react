import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductSaleOffEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';

import { DateDiff, intToVNDCurrencyFormat, loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { XIcon, CheckIcon, SaveIcon, PrintIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent, DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
import { isFulfilled } from '@reduxjs/toolkit';
function ProductSaleOffEdit(props) {
    let navigate = useNavigate();
    setupInterceptors(navigate, 'employee');
    //const params = useParams(); prams.cartId
    console.log(props.saleOffId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [flag, setFlag] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsAndPercentages, setProductsAndPercentages] = useState([]);
    const [filterState, setFilterState] = useState(2);// 2 is state of cart that is completed, in this return product view, we only need completed one

    const [errorMessage, setErrorMessage] = useState({ errorNGAY_AP_DUNG: '', errorTEN_SP_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [saleOffEntity, setSaleOffEntity] = useState({ MA_NV: "", GHI_CHU: "", NGAY_TAO: "", THOI_GIAN: 0, NGAY_AP_DUNG: new Date(), chiTietPhieuTra: [] });

    removeSyncfusionLicenseMessage();

    const customerDropDownList = useRef();
    const datePicker = useRef();
    const dateTimePicker = useRef();
    const grid = useRef()
    let editOptions, toolbarOptions;

    editOptions = { /*allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' */ };

    //vì không thể set sẵn các sản phẩm đã chọn trên trang khác của grid, nên khi chỉnh sửa, xem chi tiết k phân trang
    let pageSettings = { pageSize: props.viewMode === 'add' ? 8 : 10000 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };
    let selectionSettings = {
        type: 'Multiple',
        // checkboxMode: 'ResetOnRowClick'
        persistSelection: true //sang trang khác k bị mất selection
    }
    let tooltip;
    const beforeRender = (args) => {
        // event triggered before render the tooltip on target element.
        tooltip.current.content = args.target.closest("td").innerText;
    }
    beforeRender.bind(this);
    // toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    // toolbarOptions = ['Edit', 'Update', 'Cancel'];
    toolbarOptions = ['ColumnChooser'];


    // const onChangeCustomer = (e) => {
    //     setIsLoading(true);
    //     let tmpErrorMsg = { errorTEN_SP_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
    //     setErrorMessage(tmpErrorMsg);
    //     axios.get(`${process.env.REACT_APP_API_URL}/api/KhachHang/carts?filterState=${filterState}&customerId=${customerDropDownList.current.value}`).then(res => {
    //         res.data.forEach(item => {
    //             if (item.NGAY_TAO) {
    //                 let date = new Date(item.NGAY_TAO);
    //                 item.NGAY_TAO = date.toLocaleDateString('vi-VN');
    //             }
    //             if (item.NGAY_GIAO) {

    //                 item.NGAY_GIAO_TYPE_DATE = new Date(item.NGAY_GIAO);
    //                 // console.log(item.ID_DH, Math.abs(DateDiff.inDays(new Date(), item.NGAY_GIAO_TYPE_DATE)))

    //                 let date = new Date(item.NGAY_GIAO);
    //                 item.NGAY_GIAO = date.toLocaleDateString('vi-VN');
    //             }

    //             if (item.TRANG_THAI === 0) {
    //                 item.TRANG_THAI_STR = 'Chờ duyệt';
    //             }
    //             if (item.TRANG_THAI === 1) {
    //                 item.TRANG_THAI_STR = 'Đang giao hàng';
    //             }
    //             if (item.TRANG_THAI === 2) {
    //                 item.TRANG_THAI_STR = 'Đã hoàn tất';
    //             }
    //             if (item.TRANG_THAI === -1) {
    //                 item.TRANG_THAI_STR = 'Đã hủy';
    //             }
    //         })
    //         setProducts(res.data);

    //         setIsLoading(false);
    //     })
    // }


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
                productsFromAPI.forEach((product) => {
                    if (product.NGAY_TAO) {
                        let date = new Date(product.NGAY_TAO);
                        product.NGAY_TAO = date.toLocaleDateString('vi-VN');
                        console.log(new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date))
                        product.NGAY_TAO = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date)
                    }
                    if (product.SIZE_STR) {
                        product.SIZE_STR = product.SIZE_STR.substr(1)
                    }
                    if (product.GIA_STR) {
                        let gias = product.GIA_STR.split(' - ');
                        console.log(gias)
                        product.GIA_MIN = gias[0];
                        //nếu sản phẩm có giá cao thấp
                        if (gias[1]) {
                            product.GIA_MAX = gias[1];
                            product.GIA_STR = intToVNDCurrencyFormat(Number.parseInt(gias[0])) + ' - ' + intToVNDCurrencyFormat(Number.parseInt(gias[1]), true);

                        } else {
                            product.GIA_STR = intToVNDCurrencyFormat(Number.parseInt(gias[0]), true);

                        }
                    }
                })
                // console.log(productsFromAPI);
                setProducts(productsFromAPI);
                console.log(productsFromAPI);
                setFlag(true);
                grid.current.dataSource = productsFromAPI;
                setIsLoading(false);

                if (props.viewMode === 'add') {
                    // console.log(datePicker)
                    datePicker.current.value = new Date();
                    dateTimePicker.current.value = new Date();
                } else {
                    setIsLoading(true);
                    let url = `${process.env.REACT_APP_API_URL}/api/KhuyenMai/?saleOffId=${props.saleOffId}`;
                    axios.get(url).then(res => {
                        console.log(res.data)
                        const saleOffEntityFromApi = res.data

                        datePicker.current.value = saleOffEntityFromApi.NGAY_TAO;
                        dateTimePicker.current.value = saleOffEntityFromApi.NGAY_AP_DUNG;

                        setSaleOffEntity(saleOffEntityFromApi)

                        let tmpErrorMsg = { errorTEN_SP_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
                        setErrorMessage(tmpErrorMsg);

                        let a = saleOffEntityFromApi.chiTietKhuyenMai.map(item => {
                            const productInPdAndPercentage = productsAndPercentages.find(product => {
                                return product.MA_SP === item.MA_SP
                            })
                            if (productInPdAndPercentage) {
                                return {
                                    ...item, PHAN_TRAM_GIAM: productInPdAndPercentage.PHAN_TRAM_GIAM,
                                    errorPHAN_TRAM_GIAM: '', GIA_SAU_GIAM_STR: productInPdAndPercentage.GIA_SAU_GIAM_STR
                                }
                            }
                            return { ...item, errorPHAN_TRAM_GIAM: '' }

                        })

                        a.forEach(item => {
                            const product = productsFromAPI.find(prd => {
                                return prd.MA_SP === item.MA_SP
                            })
                            item.TEN_SP = product.TEN_SP
                        })

                        setProductsAndPercentages(a)

                        let gridData = grid.current.dataSource;
                        console.log(gridData, 'gridData')

                        let selectedIndexes = gridData.map((item, index) => {
                            const product = a.find(prd => {
                                return prd.MA_SP === item.MA_SP
                            })
                            if (product) {
                                return index
                            }
                        })
                        selectedIndexes = selectedIndexes.filter(item => {
                            return item !== undefined
                        })
                        console.log(selectedIndexes, 'selected rowindexés')
                        grid.current.selectRows(selectedIndexes);

                        //
                        setIsLoading(false);
                        return;

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
        let tmpErrorMsg = { errorTEN_SP_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorPHAN_TRAM_GIAM_ALL: "" };

        // if (!customerDropDownList.current.value) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng chọn khách hàng cần trả hàng" }
        //     hasError = true;
        // }
        // console.log(selectedrecords[0], Math.abs(DateDiff.inDays(new Date(), selectedrecords[0].NGAY_GIAO_TYPE_DATE)) - 1)
        if (!dateTimePicker.current) {
            tmpErrorMsg = { ...tmpErrorMsg, errorNGAY_AP_DUNG: "*Ngày - giờ không đúng định dạng" }
            hasError = true;
        } else {
            try {
                const daysDiffer = DateDiff.inSeconds(new Date(), dateTimePicker.current.value);
                console.log(daysDiffer, dateTimePicker.current)
                if (daysDiffer < 0) {
                    tmpErrorMsg = { ...tmpErrorMsg, errorNGAY_AP_DUNG: "*Ngày - giờ áp dụng không hợp lệ" }
                    hasError = true;
                }
            } catch (e) {
                tmpErrorMsg = { ...tmpErrorMsg, errorNGAY_AP_DUNG: "*Ngày - giờ không đúng định dạng" }
                hasError = true;
            }

        }

        if (saleOffEntity.THOI_GIAN <= 0) {
            tmpErrorMsg = { ...tmpErrorMsg, errorTHOI_GIAN: "*Thời gian áp dụng phải lớn hơn 0" }
            hasError = true;
        }

        if (productsAndPercentages.length <= 0) {
            // toast.error('Bạn chưa chọn sản phẩm cần giảm giá nào')
            hasError = true;
            tmpErrorMsg = { ...tmpErrorMsg, errorSAN_PHAM_ALL: '*Bạn chưa chọn sản phẩm cần giảm giá nào' }
        }


        // let item = productsAndPercentages.some(item => {
        //     return item.PHAN_TRAM_GIAM > 0;
        // })
        // if (!item) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP_ALL: "*Tổng số lượng nhập của phiếu phải lớn hơn 0" }
        //     hasError = true;
        // }

        // if (!item) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorPHAN_TRAM_GIAM_ALL: "*Tổng phần trăm giảm của phiếu phải lớn hơn 0, những sản phẩm phần trăm giảm bằng 0 sẽ không được lưu" }
        //     hasError = true;
        // }

        productsAndPercentages.forEach(item => {
            //console.log('zzzzzz', item)
            item.errorPHAN_TRAM_GIAM = '';
            if (item.PHAN_TRAM_GIAM <= 0) {
                item.errorPHAN_TRAM_GIAM = '*Phần trăm giảm phải lớn 0'
                hasError = true;
            }

            if (!item.PHAN_TRAM_GIAM) {
                item.PHAN_TRAM_GIAM = 0;
            }

            // if (item.PHAN_TRAM_GIAM > (item.SO_LUONG - item.SL_DA_TRA)) {
            //     item.errorPHAN_TRAM_GIAM = '*Tổng số lượng muốn trả và đã trả không được vượt quá số lượng đã mua'
            //     hasError = true;
            // }

        })
        // console.log('herreeeeeeee', tmpErrorMsg)
        setErrorMessage(tmpErrorMsg)

        return hasError
    }
    const addHoursToDate = (date, hours) => {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

    const save = () => {
        if (validate()) {
            return;
        }

        let data = productsAndPercentages.filter(item => {
            return item.PHAN_TRAM_GIAM > 0;
        })

        console.log(dateTimePicker.current.value);
        // console.log("data to send: ", data)
        if (props.viewMode === 'add') {
            let _saleOffEntity = {

                MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
                GHI_CHU: saleOffEntity.GHI_CHU,
                THOI_GIAN: saleOffEntity.THOI_GIAN,
                //k rõ lý do ngày bị trừ 7 tiếng khi truyền xuống back-end., trên front end log ra vẫn đúng, nên cộng thêm 7h
                NGAY_AP_DUNG: addHoursToDate(dateTimePicker.current.value, 7),
                //NGAY_TAO: datePicker.current.value,
                chiTietKhuyenMai: data
            }


            setSaleOffEntity(_saleOffEntity)

            console.log('pass', _saleOffEntity, `${process.env.REACT_APP_API_URL}/api/KhuyenMai/add-sale-off`)
            try {
                axios.post(`${process.env.REACT_APP_API_URL}/api/KhuyenMai/add-sale-off`, _saleOffEntity,
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                        }
                    }
                ).then(res => {
                    const response = res.data;
                    console.log('res: ' + response.errorDesc)
                    if (response.errorDesc !== '') {
                        toast.error(response.responseMessage)
                        return
                    }
                    toast.success("Thêm đợt khuyến mãi thành công");
                    props.rerender();
                });
            } catch (error) {
                console.error(error);
            }
        }
        if (props.viewMode === 'edit') {
            let _saleOffEntity = {
                MA_KM: saleOffEntity.MA_KM,
                MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
                GHI_CHU: saleOffEntity.GHI_CHU,
                THOI_GIAN: saleOffEntity.THOI_GIAN,
                //k rõ lý do ngày bị trừ 7 tiếng khi truyền xuống back-end., trên front end log ra vẫn đúng, nên cộng thêm 7h
                NGAY_AP_DUNG: addHoursToDate(dateTimePicker.current.value, 7),
                //NGAY_TAO: datePicker.current.value,
                chiTietKhuyenMai: data
            }


            setSaleOffEntity(_saleOffEntity)

            console.log('pass', _saleOffEntity, `${process.env.REACT_APP_API_URL}/api/KhuyenMai/edit-sale-off`)
            try {
                axios.put(`${process.env.REACT_APP_API_URL}/api/KhuyenMai/edit-sale-off`, _saleOffEntity,
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                        }
                    }
                ).then(res => {
                    const response = res.data;
                    console.log('res: ' + response.errorDesc);
                    if (response.errorDesc !== '') {
                        toast.error(response.responseMessage);
                        return
                    }
                    toast.success("Sửa đợt khuyến mãi thành công");
                    props.rerender();
                });
            } catch (error) {
                console.error(error);
            }
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
        return props.viewMode === 'view' ? `Chi tiết đợt khuyến mãi ${props.saleOffId}` : props.viewMode === 'edit' ? `Chỉnh sửa đợt khuyến mãi ${props.saleOffId}` : `Thêm mới đợt khuyến mãi`
    }

    //nhập số lượng muốn trả
    const onChangePercentage = (MA_SP, percent) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productsAndPercentages.map((item, i) => {
            console.log(item.GIA_MAX)
            if (item.MA_SP === MA_SP) {
                if (item.GIA_MAX) {
                    item.GIA_SAU_GIAM_STR = intToVNDCurrencyFormat(Number.parseInt(item.GIA_MIN - item.GIA_MIN * percent / 100)) + ' - ' + intToVNDCurrencyFormat(Number.parseInt(item.GIA_MAX - item.GIA_MAX * percent / 100), true);

                } else {
                    item.GIA_SAU_GIAM_STR = intToVNDCurrencyFormat(Number.parseInt(item.GIA_MIN - item.GIA_MIN * percent / 100), true);

                }
                return { ...item, PHAN_TRAM_GIAM: percent };
            } else {
                return item;
            }
        });

        setProductsAndPercentages(newArray);

    }

    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
        }
    }

    const selectProducts = () => {
        setErrorMessage({ ...errorMessage, errorSAN_PHAM_ALL: '' })
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            console.log('selected records: ', selectedrecords)

            let a = selectedrecords.map(item => {
                const productInPdAndPercentage = productsAndPercentages.find(product => {
                    return product.MA_SP === item.MA_SP
                })
                if (productInPdAndPercentage) {
                    return {
                        ...item, PHAN_TRAM_GIAM: productInPdAndPercentage.PHAN_TRAM_GIAM,
                        errorPHAN_TRAM_GIAM: '', GIA_SAU_GIAM_STR: productInPdAndPercentage.GIA_SAU_GIAM_STR
                    }
                }
                return { ...item, PHAN_TRAM_GIAM: 0, errorPHAN_TRAM_GIAM: '', GIA_SAU_GIAM_STR: item.GIA_STR }

            })

            setProductsAndPercentages(a)
            // setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
            // console.log(selectedrecords[0], Math.abs(DateDiff.inDays(new Date(), selectedrecords[0].NGAY_GIAO_TYPE_DATE)) - 1)

            // const daysDiffer = Math.abs(DateDiff.inDays(new Date(), selectedrecords[0].NGAY_GIAO_TYPE_DATE)) - 1;

            // if (daysDiffer > 5) {
            //     // notify('Đơn hàng giao từ hơn 5 ngày trước không thể thực hiện trả');
            //     toast.error('Đơn hàng giao từ hơn 5 ngày trước không thể thực hiện trả')
            //     return;
            // }
            // try {
            //     axios.get(`${process.env.REACT_APP_API_URL}/api/GioHang/for-return?cartId=${selectedrecords[0].ID_DH}`).then(res => {
            //         const response = res.data;
            //         console.log('res: ' + response);
            //         response.chiTietGioHang2.forEach(item => {
            //             if (!item.SL_DA_TRA) {
            //                 item.SL_DA_TRA = 0;
            //             }
            //         })

            //         setProductsAndPercentages(response.chiTietGioHang2)

            //     });
            // } catch (error) {
            //     console.error(error);
            // }

        }
    }

    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        <>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            flag ? <div className={clsx(style.modalWrapper)}>

                {/* <ToastContainer /> */}
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


                        {/* <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
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
                    </div> */}
                        <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                            <label className={clsx(style.inputLabel)}>Ngày - giờ áp dụng:</label>
                            <div className={clsx(style.datePickerContainer)}>
                                <DateTimePickerComponent onChange={() => {
                                }} ref={dateTimePicker} format={'dd/MM/yyyy - hh:mm a'} timeFormat={'hh:mm a'} locale='vi' />
                            </div>
                            {<p className={clsx(style.errorMessage)}>{errorMessage.errorNGAY_AP_DUNG}</p>}
                        </div>
                        <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                            <label className={clsx(style.inputLabel)}>Thời gian KM (ngày):</label>
                            <input maxLength={1000} onChange={(e) => {
                                console.log(e.target.value)
                                setSaleOffEntity({ ...saleOffEntity, THOI_GIAN: e.target.value })
                            }} type="number" placeholder=""
                                value={saleOffEntity.THOI_GIAN} name='THOI_GIAN' className={clsx(style.input)}
                                //disable scroll increase
                                onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            />
                            {<p className={clsx(style.errorMessage)}>{errorMessage.errorTHOI_GIAN}</p>}
                        </div>

                        <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                            <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                            <textarea maxLength={1000} onChange={(e) => {
                                console.log(e.target.value)
                                setSaleOffEntity({ ...saleOffEntity, GHI_CHU: e.target.value })
                            }} type="text" placeholder=""
                                value={saleOffEntity.GHI_CHU} name='GHI_CHU' className={clsx(style.input)} />
                            {<p className={clsx(style.errorMessage)}>{errorMessage.errorGHI_CHU}</p>}
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
                            <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                            <input type="text" placeholder="" disabled
                                value={
                                    props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : saleOffEntity.HO_TEN_NV
                                } name='HO_TEN_NV' className={clsx(style.input)} />
                        </div>

                        {products.length > 0 ?
                            <>
                                <div className={clsx(style.toolBar)}>
                                    <button onClick={() => {
                                        selectProducts();
                                    }} className={clsx(style.checkButton, style.saveButton, style.selectButton, { [style.inActive]: props.viewMode === 'view' })}><span className={clsx(style.iconSvg)}><CheckIcon /></span>Chọn</button>
                                </div>
                                <div className={clsx(style.customerCarts)}>
                                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorSAN_PHAM_ALL}</p>}
                                    {<GridComponent ref={grid}
                                        toolbar={toolbarOptions}
                                        showColumnChooser={true}
                                        //  actionComplete={actionComplete} 
                                        //  actionBegin={actionBegin}
                                        locale='vi-VN'
                                        editSettings={editOptions}
                                        pageSettings={pageSettings}
                                        dataSource={products} allowPaging={true} /*allowGrouping={true}*/
                                        allowSorting={true} allowFiltering={true}
                                        filterSettings={filterOptions} height={315}
                                        rowSelected={rowSelected}
                                        gridLines='Both'
                                        selectionSettings={selectionSettings}
                                    >
                                        <ColumnsDirective>
                                            <ColumnDirective type='checkbox' width='50' />
                                            <ColumnDirective field='MA_SP' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mã SP' width='200' textAlign="Left" isPrimaryKey={true} />
                                            <ColumnDirective field='TEN_SP' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Tên SP' width='200' textAlign="Left" />
                                            <ColumnDirective field='TEN_TL' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Thể loại' width='150' editType='dropdownedit' textAlign="Left" />
                                            <ColumnDirective field='SIZE_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Size/ Màu' width='200' textAlign="Left" />
                                            <ColumnDirective field='GIA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Giá' width='200' textAlign="Left" />
                                            <ColumnDirective field='NGAY_TAO' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Ngày tạo' width='150' textAlign="Left" />
                                            <ColumnDirective field='LUOT_XEM' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Lượt xem' width='150' textAlign="Left" />
                                            {/* <ColumnDirective field='MA_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='MA_TL' width='100' textAlign="Right"/> */}
                                            {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                                            <ColumnDirective field='HINH_ANH' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Hình ảnh' width='200' textAlign="Left" />
                                            <ColumnDirective field='MO_TA' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mô tả' width='150' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />

                                            {/* <ColumnDirective field='TEN_NV_DUYET'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV duyệt' width='160' textAlign="Left" />
                        <ColumnDirective field='TEN_NV_GIAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV giao' width='160' textAlign="Left" /> */}


                                        </ColumnsDirective>
                                        <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
                                    </GridComponent>
                                    }</div></>
                            : <></>

                        }
                        {productsAndPercentages.length > 0 ?
                            <>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                    <label className={clsx(style.inputLabel)}>Mã SP</label>

                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                    <label className={clsx(style.inputLabel)}>Tên sản phẩm</label>
                                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorTEN_SP_ALL}</p>}
                                </div>
                                {/* <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width20)}>
                                <label className={clsx(style.inputLabel)}>Giá hiện tại</label>

                            </div> */}
                                <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                    <label className={clsx(style.inputLabel)}>
                                        {props.viewMode === 'view' ? 'Phần trăm giảm' : 'Phần trăm giảm'}
                                    </label>
                                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorPHAN_TRAM_GIAM_ALL}</p>}
                                </div>

                                {/* <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width20)}>
                                <label className={clsx(style.inputLabel)} title={`Giá trị này có thể không chính xác khi đợt khuyến mãi bắt đầu`}>
                                    {props.viewMode === 'view' ? 'Giá sau giảm (?)' : 'Giá sau giảm (?)'}
                                </label>
                                {<p className={clsx(style.errorMessage)}>{errorMessage.errorGIA_SAU_GIAM_ALL}</p>}
                            </div> */}
                            </>
                            : <></>}

                        {
                            productsAndPercentages.map((item, index) => {
                                return (
                                    <div key={index} className={clsx(style.quantityInputContainer)}>
                                        <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                            <input disabled onChange={(e) => {

                                            }} type="text" name='MA_SP'
                                                value={`${item.MA_SP}`}
                                                placeholder="" className={clsx(style.input)}
                                            // title={`${item.TEN_SP} - ${item.TEN_MAU}/ ${item.TEN_SIZE}`}
                                            />

                                        </div>
                                        <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                            <input disabled onChange={(e) => {
                                                // console.log(e.target.value)
                                                // onChangePercentage(item.MA_CT_SP, e.target.value);
                                            }} type="text"
                                                value={productsAndPercentages[index].TEN_SP}
                                                placeholder="" className={clsx(style.input)}
                                                min={0}
                                            />
                                            {<p className={clsx(style.errorMessage)}>{item.errorTEN_SP}</p>}
                                        </div>
                                        {/* <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width20)}>
                                        <input disabled onChange={(e) => {
                                            // console.log(e.target.value)
                                            // onChangePrice(item.MA_CT_SP, e.target.value);
                                        }} type="text"
                                            value={productsAndPercentages[index].GIA_STR}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorGIA_STR}</p>}
                                    </div> */}

                                        <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width33)}>
                                            <input onChange={(e) => {
                                                console.log(e.target.value)
                                                onChangePercentage(item.MA_SP, e.target.value);
                                            }} type="number" name='PHAN_TRAM_GIAM'
                                                value={productsAndPercentages[index].PHAN_TRAM_GIAM}
                                                placeholder="" className={clsx(style.input)}
                                                min={0} max={100}
                                                disabled={props.viewMode === 'view' ? true : false}
                                                //disable scroll increase
                                                onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                            />
                                            {<p className={clsx(style.errorMessage)}>{item.errorPHAN_TRAM_GIAM}</p>}
                                        </div>

                                        {/* <div className={clsx(style.inputGroup, style.quantityInputGroup, style.width20)}>
                                        <input disabled onChange={(e) => {
                                            // console.log(e.target.value)
                                            // onChangePrice(item.MA_CT_SP, e.target.value);
                                        }} type="text"
                                            value={productsAndPercentages[index].GIA_SAU_GIAM_STR}
                                            placeholder="" className={clsx(style.input)}
                                            min={0}
                                            //disable scroll increase
                                            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                        />
                                        {<p className={clsx(style.errorMessage)}>{item.errorGIA_SAU_GIAM_STR}</p>}
                                    </div> */}
                                    </div>
                                )
                            })
                        }

                        {/* {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHITIET}</p>} */}

                        {/* detail */}
                    </div>

                </div>
            </div> : <></></>);
}
//chỉ update lúc cần
export default React.memo(ProductSaleOffEdit);