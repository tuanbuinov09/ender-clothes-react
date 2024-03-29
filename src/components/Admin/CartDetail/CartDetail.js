import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import style from './CartDetail.module.css';
import clsx from 'clsx';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { newInvoiceIdByDate, removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { Button } from '../../Button/Button';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import { L10n } from '@syncfusion/ej2-base';
import { toast } from 'react-toastify';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { intToVNDCurrencyFormat, setupInterceptors } from '../../../uitilities/utilities'
import CartDetailToPrint from './CartDetailToPrint';
import { useReactToPrint } from 'react-to-print';
import { ModalConfirmDialog } from '../../ModalConfirmDialog/ModalConfirmDialog';

function CartDetail(props) {
    const dispatch = useDispatch();

    let navigate = useNavigate();
    setupInterceptors(navigate, props.type !== 'userViewing' ? 'employee' : 'user');

    // const params = useParams(); prams.cartId
    console.log(props.cartId);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    const [cart, setCart] = useState({});
    const [flag, setFlag] = useState(false);
    const [preparePrint, setPreparePrint] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    removeSyncfusionLicenseMessage();
    const dropdownList = useRef();
    const grid = useRef();
    useEffect(() => {

        console.log(`http://localhost:22081/api/DonHang?cartId=${props.cartId}`);
        try {
            axios.get(`http://localhost:22081/api/NhanVien/delivering`).then(res => {
                const response = res.data;
                console.log("emp:", response);
                response.forEach((emp) => {
                    emp.HO_TEN_STR = emp.HO_TEN + ', Đang giao: ' + emp.SO_GH_NV_DANG_GIAO
                })
                setEmployees(response);
                try {
                    setIsLoading(true);
                    axios.get(`http://localhost:22081/api/DonHang?cartId=${props.cartId}`).then(res => {
                        const response = res.data;
                        response.chiTietGioHang2.forEach((resp, index) => {
                            try {
                                resp.STT = index + 1;
                                resp.GIA_STR = intToVNDCurrencyFormat(resp.GIA) + " ₫";
                                resp.TRI_GIA_STR = intToVNDCurrencyFormat(resp.GIA * resp.SO_LUONG, true);//thêm true + đ
                            } catch (e) {
                                console.log(e)
                            }
                        })
                        setCart(response);
                        //set nhân viên đã được assign   
                        setFlag(true);
                        if (props.type !== 'userViewing') {
                            dropdownList.current.value = response.MA_NV_GIAO;

                        }
                        console.log("nvgiao old:", response.MA_NV_GIAO)
                        setIsLoading(false);

                    });
                } catch (error) {
                    console.error(error);
                }
            });
        } catch (error) {
            console.error(error);
        }




    }, []);
    let pageSettings = { pageSize: 6 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };
    L10n.load({
        'vi-VN': {
            "grid": {
                "EmptyRecord": "Không có mục nào để hiển thị",
                "True": "Đúng",
                "False": "Sai",
                "InvalidFilterMessage": "Dữ liệu bộ lọc không hợp lệ",
                "GroupDropArea": "Kéo một tiêu đề cột ở đây để nhóm cột của nó",
                "UnGroup": "Nhấn vào đây để hủy nhóm",
                "GroupDisable": "Nhóm bị vô hiệu hóa cho cột này",
                "FilterbarTitle": "\"Lọc tiêu đề",
                "EmptyDataSourceError": "DataSource không được để trống khi tải ban đầu vì các cột được tạo từ dataSource trong Lưới cột AutoGenerate",
                "Add": "Thêm mới",
                "Edit": "Chỉnh sửa",
                "Cancel": "Hủy bỏ",
                "Update": "Cập nhật",
                "Delete": "Xóa bỏ",
                "Print": "In",
                "Pdfexport": "Xuất PDF",
                "Excelexport": "Xuất file Excel",
                "Wordexport": "Xuất từ",
                "Csvexport": "Xuất CSV",
                "Search": "Tìm kiếm",
                "Columnchooser": "Cột",
                "Save": "Lưu",
                "Item": "mục",
                "Items": "mặt hàng",
                "EditOperationAlert": "Không có bản ghi nào được chọn cho thao tác chỉnh sửa",
                "DeleteOperationAlert": "Không có bản ghi nào được chọn cho hoạt động xóa",
                "SaveButton": "Lưu",
                "OKButton": "Đồng ý",
                "CancelButton": "Hủy bỏ",
                "EditFormTitle": "Chi tiết của",
                "AddFormTitle": "Thêm bản ghi mới",
                "BatchSaveConfirm": "Bạn có chắc chắn muốn lưu các thay đổi?",
                "BatchSaveLostChanges": "Những thay đổi chưa được lưu sẽ bị mất. Bạn có chắc chắn muốn tiếp tục?",
                "ConfirmDelete": "Bạn có chắc chắn muốn xóa Bản ghi?",
                "CancelEdit": "Bạn có chắc chắn muốn Hủy bỏ các thay đổi?",
                "ChooseColumns": "Chọn cột",
                "SearchColumns": "cột tìm kiếm",
                "Matchs": "Lọc kết quả tìm thấy",
                "FilterButton": "OK",
                "ClearButton": "Hủy",
                "StartsWith": "Bắt đầu với",
                "EndsWith": "Kết thúc với",
                "Contains": "Bao gồm",
                "Equal": "Bằng",
                "NotEqual": "Không bằng",
                "LessThan": "Ít hơn",
                "LessThanOrEqual": "Nhỏ hơn hoặc bằng",
                "GreaterThan": "Lớn hơn",
                "GreaterThanOrEqual": "Lớn hơn hoặc bằng",
                "ChooseDate": "Chọn một ngày",
                "EnterValue": "Nhập giá trị",
                "Copy": "Sao chép",
                "Group": "Nhóm theo cột này",
                "Ungroup": "Ungroup theo cột này",
                "autoFitAll": "Tự động điều chỉnh tất cả các cột",
                "autoFit": "Tự động điều chỉnh cột này",
                "Export": "Xuất",
                "FirstPage": "Trang đầu",
                "LastPage": "Trang cuối",
                "PreviousPage": "Trang trước",
                "NextPage": "Trang tiếp theo",
                "SortAscending": "Sắp xếp tăng dần",
                "SortDescending": "Sắp xếp giảm dần",
                "EditRecord": "Chỉnh sửa bản ghi",
                "DeleteRecord": "Xóa bản ghi",
                "FilterMenu": "Bộ lọc",
                "SelectAll": "Chọn tất cả",
                "Blanks": "Khoảng trống",
                "FilterTrue": "Đúng",
                "FilterFalse": "Sai",
                "NoResult": "Lọc kết quả tìm thấy",
                "ClearFilter": "Bỏ lựa chọn lọc",
                "NumberFilter": "Bộ lọc số",
                "TextFilter": "Bộ lọc văn bản",
                "DateFilter": "Bộ lọc ngày",
                "DateTimeFilter": "Bộ lọc DateTime",
                "MatchCase": "Trường hợp phù hợp",
                "Between": "Giữa",
                "CustomFilter": "Bộ lọc tùy chỉnh",
                "CustomFilterPlaceHolder": "Nhập giá trị",
                "CustomFilterDatePlaceHolder": "Chọn một ngày",
                "AND": "VÀ",
                "OR": "HOẶC LÀ",
                "ShowRowsWhere": "Hiển thị các hàng trong đó:"
            },
            "pager": {
                "currentPageInfo": "{0} trên {1} trang",
                // "totalItemsInfo": "({0} dòng)",
                "totalItemsInfo": "Tổng số dòng: {0}",
                "firstPageTooltip": "Đến trang đầu tiên",
                "lastPageTooltip": "Đến trang cuối",
                "nextPageTooltip": "Chuyển đến trang tiếp theo",
                "previousPageTooltip": "Chuyển đến trang trước",
                "nextPagerTooltip": "Đi đến máy nhắn tin tiếp theo",
                "previousPagerTooltip": "Đi đến máy nhắn tin trước",
                "pagerDropDown": "Dòng hiển thị",
                "pagerAllDropDown": "Bản ghi",
                "All": "Tất cả",
                // "totalItemInfo": "({0} dòng)"
                "totalItemInfo": "{0} dòng"
            },
        }
    });

    const finish = () => {
        try {
            axios.put(`http://localhost:22081/api/NhanVien/finish-cart`, {
                ID_DH: cart.ID_DH
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    // console.log('res: ' + response);
                    setCart({ ...cart, TRANG_THAI: 2, TRANG_THAI_STR: 'Đã hoàn tất' })
                    toast.success("Giao đơn hàng thành công");
                    props.rerender();
                });
        } catch (error) {
            console.error(error);
        }
    }
    const save = () => {
        // if (!cart.MA_NV_DUYET) {
        //     notify("Hãy duyệt trước khi giao cho nhân viên vận chuyển");
        //     return;
        // }

        // console.log(dropdownList.current);
        const selectedItem = dropdownList.current.itemData;
        console.log(dropdownList.current.value);
        const assignedEmpID = dropdownList.current.value;
        if (!assignedEmpID) {
            console.log("here")
            toast.error("Hãy chọn nhân viên vận chuyển");
            return;
        }
        try {
            axios.put(`http://localhost:22081/api/DonHang/assign-delivery`, {
                ID_DH: cart.ID_DH,
                MA_NV_GIAO: assignedEmpID,
                MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    // console.log('res: ' + response);
                    setCart({
                        ...cart, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao hàng',
                        MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN
                        , MA_NV_GIAO: assignedEmpID, TEN_NV_GIAO: selectedItem.HO_TEN
                    })
                    toast.success("Đã giao cho nhân viên: " + selectedItem.HO_TEN);

                    props.rerender();
                });
        } catch (error) {
            console.error(error);
        }

    }

    const cancel = () => {

        if (props.type === "userViewing" && cart.TRANG_THAI !== 0) {
            toast.info("Đơn hàng đã được duyệt hoặc đã được hoàn tất, không thể hủy.");
            return;
        }
        const accessToken = props.type === "userViewing" ? JSON.parse(localStorage.getItem('user')).accessToken : JSON.parse(localStorage.getItem('employee')).accessToken;
        try {
            axios.put(`http://localhost:22081/api/KhachHang/cancel-cart`, {
                ID_DH: cart.ID_DH
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    if (response.errorDesc) {
                        setCart({ ...cart, TRANG_THAI: -1, TRANG_THAI_STR: 'Đã hủy' });
                        toast.error("Đơn hàng đã được hủy trước đó");
                        props.rerender();
                        return;
                    }
                    // console.log('res: ' + response);
                    setCart({ ...cart, TRANG_THAI: -1, TRANG_THAI_STR: 'Đã hủy' });
                    toast.success("Hủy đơn hàng thành công");
                    props.rerender();
                });
        } catch (error) {
            console.error(error);
        }

    }
    const print = () => {
        // const maHD = newInvoiceIdByDate();
        //tạo hóa đơn
        // axios.post(`http://localhost:22081/api/HoaDon/`, {
        //     ID_DH: cart.ID_DH,
        //     MA_HD: maHD,
        //     MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
        // },
        //     {
        //         headers: {
        //             Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
        //         }
        //     }).then(res => {
        //         setPreparePrint(true);
        //     })
        setPreparePrint(true);
    }
    let fields = { text: 'HO_TEN_STR', value: 'MA_NV' };
    // filtering event handler to filter a Country

    const onFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('HO_TEN_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(employees, query);
    };

    const closePreparePrintDialog = () => {
        setPreparePrint(false);
    }
    // 
    const [showConfirmDialogSave, setShowConfirmDialogSave] = useState(false);
    const [showConfirmDialogCancel, setShowConfirmDialogCancel] = useState(false);
    const [showConfirmDialogFinish, setShowConfirmDialogFinish] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState('');

    const onConfirmSave = () => {
        save();
        setShowConfirmDialogSave(false);
    }
    const onDenySave = () => {
        setShowConfirmDialogSave(false);
    }

    const onConfirmFinish = () => {
        finish();
        setShowConfirmDialogFinish(false);
    }
    const onDenyFinish = () => {
        setShowConfirmDialogFinish(false);
    }

    const onConfirmCancel = () => {
        cancel();
        setShowConfirmDialogCancel(false);
    }
    const onDenyCancel = () => {
        setShowConfirmDialogCancel(false);
    }
    //
    return (
        <>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            {preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> :
                flag ? <div className={clsx(style.modalWrapper)}>

                    {showConfirmDialogSave && <ModalConfirmDialog onConfirm={onConfirmSave} onDeny={onDenySave} title={confirmDialogTitle} />}
                    {showConfirmDialogFinish && <ModalConfirmDialog onConfirm={onConfirmFinish} onDeny={onDenyFinish} title={confirmDialogTitle} />}
                    {showConfirmDialogCancel && <ModalConfirmDialog onConfirm={onConfirmCancel} onDeny={onDenyCancel} title={confirmDialogTitle} />}

                    <div className={clsx(style.top)}>
                        {/* <ToastContainer /> */}
                    </div>
                    <div className={clsx(style.modal)}>
                        <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                            props.closeDialog();
                        }}><XIcon /></span></h1>

                        <h1 className={clsx(style.title)}>Chi tiết ĐH {props.cartId}</h1>
                        <div className={clsx(style.btnCheckContainer)}>
                            {/* không duyệt nữa, assign cho nhân viên là duyệt luôn */}
                            {props.type !== 'userViewing' && localStorage.getItem('employee') && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ?

                                <>
                                    {/* <button onClick={() => {
                                    approve();
                                }} className={clsx(style.checkButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                                    <span className={clsx(style.iconSvg)}><CheckIcon /></span>Duyệt
                                </button> */}
                                    <button onClick={() => {
                                        // save();
                                        setShowConfirmDialogSave(true);
                                        setConfirmDialogTitle('Xác nhận duyệt đơn hàng');
                                    }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                                        <span className={clsx(style.iconSvg)}><SaveIcon /></span>Phân NV giao hàng
                                    </button>
                                    <button onClick={() => {
                                        print();
                                    }} className={clsx(style.checkButton, style.printButton, { [style.inActive]: cart.TRANG_THAI === -1 || cart.TRANG_THAI === 0 })}>
                                        <span className={clsx(style.iconSvg)}><PrintIcon /></span>In hóa đơn
                                    </button>
                                    {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q02' ?

                                        <>
                                            <button onClick={() => {
                                                // finish();
                                                setShowConfirmDialogFinish(true);
                                                setConfirmDialogTitle('Xác nhận hoàn tất đơn hàng');
                                            }} className={clsx(style.checkButton, style.saveButton, style.finishButton, { [style.inActive]: cart.TRANG_THAI !== 1 })}>
                                                <span className={clsx(style.iconSvg)}><CheckIcon /></span>Hoàn tất
                                            </button>
                                            <button onClick={() => {
                                                // cancel();
                                                setShowConfirmDialogCancel(true);
                                                setConfirmDialogTitle('Xác nhận hủy đơn hàng');
                                            }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: !(cart.TRANG_THAI === 1 || cart.TRANG_THAI === 0) })}>
                                                <span className={clsx(style.iconSvg)}><CancelIcon /></span>Hủy đơn hàng
                                            </button>
                                        </> : <></>}

                                    {/* <><button onClick={() => {
                                    cancel();
                                }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: cart.TRANG_THAI === -1 })}>
                                    <span className={clsx(style.iconSvg)}><CancelIcon /></span>Hủy đơn hàng
                                </button></> */}
                                </>
                                : props.type !== "userViewing" && JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04' ? <>
                                    <button onClick={() => {
                                        // finish();
                                        setShowConfirmDialogFinish(true);
                                        setConfirmDialogTitle('Xác nhận hoàn tất đơn hàng');
                                    }} className={clsx(style.checkButton, style.saveButton, style.finishButton, { [style.inActive]: cart.TRANG_THAI !== 1 })}>
                                        <span className={clsx(style.iconSvg)}><CheckIcon /></span>Hoàn tất
                                    </button>
                                    <button onClick={() => {
                                        // cancel();
                                        setShowConfirmDialogCancel(true);
                                        setConfirmDialogTitle('Xác nhận hủy đơn hàng');
                                    }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: !(cart.TRANG_THAI === 1 || cart.TRANG_THAI === 0) })}>
                                        <span className={clsx(style.iconSvg)}><CancelIcon /></span>Hủy đơn hàng
                                    </button>
                                </> :
                                    <><button onClick={() => {
                                        // cancel();
                                        setShowConfirmDialogCancel(true);
                                        setConfirmDialogTitle('Xác nhận hủy đơn hàng');
                                    }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                                        <span className={clsx(style.iconSvg)}><CancelIcon /></span>Hủy đơn hàng
                                    </button></>
                            }

                        </div>

                        <div className={clsx(style.cartInfo)}>
                            {/* khách hàng đang coi thì k cần mã */}
                            {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ? <><div className={clsx(style.infoGroup)}>
                                <label>Mã khách hàng: </label>
                                <span>{cart.MA_KH}</span>
                            </div>
                                <div className={clsx(style.infoGroup)}>
                                    <label>Tên khách hàng: </label>
                                    <span>{cart.HO_TEN_KH}</span>
                                </div>
                            </> : <></>
                            }

                            <div className={clsx(style.infoGroup)}>
                                <label>Tên người nhận: </label>
                                <span>{cart.HO_TEN}</span>
                            </div>
                            <div className={clsx(style.infoGroup)}>
                                <label>SĐT người nhận: </label>
                                <span>{cart.SDT}</span>
                            </div>
                            <div className={clsx(style.infoGroup)}>
                                <label>Email: </label>
                                <span>{cart.EMAIL}</span>
                            </div>
                            <div className={clsx(style.infoGroup)}>
                                <label>Địa chỉ: </label>
                                <span>{cart.DIA_CHI}</span>
                            </div>
                            <div className={clsx(style.infoGroup)}>
                                <label>Trạng thái đơn hàng: </label>
                                <span>{
                                    cart.TRANG_THAI === -1 ? 'Đã hủy'
                                        : cart.TRANG_THAI === 0 ? 'Chờ duyệt'
                                            : cart.TRANG_THAI === 1 ? 'Đang giao'
                                                : cart.TRANG_THAI === 2 ? 'Đã hoàn tất'
                                                    : ''}
                                </span>
                            </div>
                            {props.type !== 'userViewing' ?
                                <div className={clsx(style.w100)}>
                                    <div className={clsx(style.infoGroup, style.infoEmployee)}>
                                        <label>Nhân viên duyệt: </label>
                                        <span>{cart.TEN_NV_DUYET}</span>
                                    </div>
                                    <div className={clsx(style.infoGroup, style.infoEmployee, style.infoEmployeeDelivery, { [style.disabled]: JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04' })}>
                                        <label>Nhân viên giao: </label>
                                        {/* <span>{cart.TEN_NV_GIAO}</span> */}
                                        <div className={clsx(style.dropdownList)}>
                                            <div className='control-section'>
                                                <div id='filtering'>
                                                    <DropDownListComponent id="employeeDelivery" ref={dropdownList} dataSource={employees} filtering={onFiltering} filterBarPlaceholder='Tìm nhân viên' allowFiltering={true} fields={fields} placeholder="Chọn nhân viên" popupHeight="220px" />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                : cart.TRANG_THAI === 1 || cart.TRANG_THAI === 2 ? <>
                                    <div className={clsx(style.infoGroup, style.infoEmployee, style.infoEmployeeDelivery1)}>
                                        <div className={clsx(style.infoGroup, style.infoEmployee)}>
                                            <label>Nhân viên giao: </label>
                                            <span>{cart.TEN_NV_GIAO}</span>
                                        </div>
                                        <div className={clsx(style.infoGroup, style.infoEmployee)}>
                                            <label className={clsx()}>SĐT nhân viên giao: </label>
                                            <span>{cart.SDT_NV_GIAO}</span>
                                        </div>

                                    </div>
                                </> : <></>}

                        </div>
                        {/* <div className={clsx(style.buttonWrapper)}>
            <div onClick={() => {
            
            }} >
                <Button text="ĐỒNG Ý" className={clsx(style.buttonConfirm)} />
            </div>
            <div onClick={() => {
            }} >
                <Button text="HỦY" className={clsx(style.buttonCancek)} />
            </div>

        </div> */}
                        {/* detail */}
                        <div className={clsx(style.cartDetail)}>
                            <GridComponent ref={grid}
                                // toolbar={toolbarOptions}
                                //  actionComplete={actionComplete} 
                                //  actionBegin={actionBegin}
                                locale='vi-VN'
                                // editSettings={editOptions}
                                pageSettings={pageSettings}
                                dataSource={cart.chiTietGioHang2} allowPaging={true} /*allowGrouping={true}*/
                                allowSorting={true} allowFiltering={true}
                                filterSettings={filterOptions} height={230}
                                // rowSelected={rowSelected}
                                gridLines='Both'
                            >
                                <ColumnsDirective>
                                    <ColumnDirective field='STT' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='STT' width='90' textAlign="Center" /*isPrimaryKey={true}*/ />
                                    <ColumnDirective field='TEN_SP' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Tên SP' width='220' textAlign="Left" /*isPrimaryKey={true}*/ />
                                    <ColumnDirective field='TEN_MAU' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Màu' width='120' textAlign="Left" />
                                    <ColumnDirective field='TEN_SIZE' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Size' width='100' textAlign="Left" />
                                    <ColumnDirective field='GIA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Giá' width='130' textAlign="Right" />
                                    <ColumnDirective field='SO_LUONG' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Số lượng' width='120' editType='dropdownedit' textAlign="Right" />
                                    <ColumnDirective field='TRI_GIA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Trị giá' width='170' textAlign="Right" />
                                    {/* <ColumnDirective field='MA_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='MA_TL' width='100' textAlign="Right"/> */}
                                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                                    {/* <ColumnDirective field='EMAIL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Email' width='200' textAlign="Left" /> */}
                                    {/*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */}
                                    {/* <ColumnDirective field='NGAY_TAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Ngày tạo' width='200' textAlign="Left"  /> 
                    <ColumnDirective field='DIA_CHI'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Địa chỉ' width='200' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Trạng thái' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_DUYET'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Mã NV duyệt' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_GIAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Mã NV giao' width='200' textAlign="Left" /> */}
                                </ColumnsDirective>
                                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
                            </GridComponent>
                            <div className={clsx(style.total)}>Tổng trị giá: {intToVNDCurrencyFormat(cart.TONG_TRI_GIA) + " ₫"}</div>
                        </div>

                    </div>
                </div> : <></>}</>);
}
//chỉ update lúc cần
export default React.memo(CartDetail);