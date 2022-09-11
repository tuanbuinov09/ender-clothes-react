import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
import style from './CartDetail.module.css';
import clsx from 'clsx';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { Button } from '../../Button/Button';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import { L10n } from '@syncfusion/ej2-base';
import ToastContainer, { toast } from 'react-light-toast';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { intToVNDCurrencyFormat } from '../../../uitilities/utilities';
import { useReactToPrint } from 'react-to-print';
function CartDetailToPrint(props) {
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.cartId);
    const [cart, setCart] = useState({});
    const [flag, setFlag] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [invoiceId, setInvoiceId] = useState();
    removeSyncfusionLicenseMessage();
    const dropdownList = useRef();
    const grid = useRef();
    useEffect(() => {

        console.log(`http://localhost:22081/api/GioHang?cartId=${props.cartId}`);
        try {
            axios.get(`http://localhost:22081/api/NhanVien/delivering`).then(res => {
                const response = res.data;
                console.log("emp:", response);
                response.forEach((emp) => {
                    emp.HO_TEN_STR = emp.HO_TEN + ', Đang giao: ' + emp.SO_GH_NV_DANG_GIAO
                })
                setEmployees(response);

            });
        } catch (error) {
            console.error(error);
        }
        console.log(`http://localhost:22081/api/GioHang?cartId=${props.cartId}`);
        try {
            axios.get(`http://localhost:22081/api/HoaDon?cartId=${props.cartId}`).then(res => {
                const response = res.data;
                setInvoiceId(response.MA_HD);
            });
        } catch (error) {
            console.error(error);
        }
        try {
            axios.get(`http://localhost:22081/api/GioHang?cartId=${props.cartId}`).then(res => {
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
                dropdownList.current.value = response.MA_NV_GIAO;
                console.log("nvgiao old:", response.MA_NV_GIAO)

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

    //--------- const approve = () => {
    //     try {
    //         axios.put(`http://localhost:22081/api/GioHang/approve`, {
    //             ID_GH: cart.ID_GH,
    //             MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV
    //         }).then(res => {
    //             const response = res.data;
    //             // console.log('res: ' + response);
    //             setCart({ ...cart, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao', MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN })
    //             notify("Duyệt thành công");
    //             props.rerender();
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }

    let fields = { text: 'HO_TEN_STR', value: 'MA_NV' };
    // filtering event handler to filter a Country

    const onFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('HO_TEN_STR', 'startswith', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(employees, query);
    };

    const componentRef = useRef(null);

    const print = useReactToPrint({
        content: () => componentRef.current,
    });
    return (<>

        {flag ? <div className={clsx(style.modalPrintWrapper)}>

            <h1 className={clsx(style.header, style.printButtonContainer)}>
                <button onClick={() => {
                    print();
                }} className={clsx(style.checkButton, style.printButton, { [style.inActive]: cart.TRANG_THAI === -1 })}>
                    <span className={clsx(style.iconSvg)}><PrintIcon /></span>In hóa đơn
                </button>
                <span className={clsx(style.closeButton)} onClick={() => {
                    props.closePreparePrintDialog();
                }}><XIcon /></span></h1>

            <div className={clsx(style.container)} ref={componentRef}>
                <div className={clsx(style.modal)}>
                    <h1 className={clsx(style.title)}>{invoiceId}</h1>
                    <p className={clsx(style.subtitle)}>Nhân viên xuất hóa đơn: <span>{JSON.parse(localStorage.getItem('employee')).HO_TEN}</span></p>
                    <p >Ngày xuất hóa đơn: <span>{(new Date()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // second: '2-digit',
                    })}</span></p>
                    <div className={clsx(style.cartInfo)}>
                        {/* khách hàng đang coi thì k cần mã */}
                        {/* {props.type !== 'userViewing' ? <> */}
                        <div className={clsx(style.infoGroup)}>
                            <label>Mã khách hàng: </label>
                            <span>{cart.MA_KH}</span>
                        </div>
                        <div className={clsx(style.infoGroup)}>
                            <label>Tên khách hàng: </label>
                            <span>{cart.HO_TEN_KH}</span>
                        </div>
                        {/* </> : <></>
                        } */}

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
                        {/* <div className={clsx(style.infoGroup)}>
                        <label>Trạng thái đơn hàng: </label>
                        <span>{
                            cart.TRANG_THAI === -1 ? 'Đã hủy'
                                : cart.TRANG_THAI === 0 ? 'Chờ duyệt'
                                    : cart.TRANG_THAI === 1 ? 'Đang giao'
                                        : cart.TRANG_THAI === 2 ? 'Đã hoàn tất'
                                           :''}
                        </span>
                    </div> */}
                        {props.type !== 'userViewing' ? <div className={clsx(style.w100)}><div className={clsx(style.infoGroup, style.infoEmployee)}>
                            <label>Nhân viên duyệt: </label>
                            <span>{cart.TEN_NV_DUYET}</span>
                        </div>
                            <div className={clsx(style.infoGroup, style.infoEmployee, style.infoEmployeeDelivery)}>
                                <label>Nhân viên giao: </label>
                                {/* <span>{cart.TEN_NV_GIAO}</span> */}
                                <div className={clsx(style.dropdownList)}>
                                    <div className='control-section'>
                                        <div id='filtering'>
                                            <DropDownListComponent id="employeeDelivery" ref={dropdownList} dataSource={employees} filtering={onFiltering} filterBarPlaceholder='Tìm nhân viên' allowFiltering={true} fields={fields} placeholder="Chọn nhân viên" popupHeight="220px" />
                                        </div>
                                    </div>

                                </div>
                            </div></div>
                            : cart.TRANG_THAI === 2 || cart.TRANG_THAI === 3 ? <>
                                {/* <div className={clsx(style.infoGroup, style.infoEmployee, style.infoEmployeeDelivery1)}>
                                    <div className={clsx(style.infoGroup, style.infoEmployee)}>
                                        <label>Nhân viên giao: </label>
                                        <span>{cart.TEN_NV_GIAO}</span>
                                    </div>
                                    <div className={clsx(style.infoGroup, style.infoEmployee)}>
                                        <label className={clsx()}>SĐT nhân viên giao: </label>
                                        <span>{cart.SDT_NV_GIAO}</span>
                                    </div>

                                </div> */}
                            </> : <></>}

                    </div>
                    {/* detail */}
                    <div className={clsx(style.cartDetail)}>
                        <GridComponent ref={grid}
                            // toolbar={toolbarOptions}
                            //  actionComplete={actionComplete} 
                            //  actionBegin={actionBegin}
                            locale='vi-VN'
                            // editSettings={editOptions}
                            // pageSettings={pageSettings}
                            dataSource={cart.chiTietGioHang2}
                            // allowPaging={true} /*allowGrouping={true}*/
                            // allowSorting={true} allowFiltering={true}
                            // filterSettings={filterOptions}
                            // rowSelected={rowSelected}
                            allowSelection={false}
                            gridLines='Both'
                        >
                            <ColumnsDirective>
                                <ColumnDirective field='STT' headerTextAlign='Center' headerText='STT' width='70' textAlign="Center" /*isPrimaryKey={true}*/ />
                                <ColumnDirective field='TEN_SP' headerTextAlign='Center' headerText='Tên SP' width='220' textAlign="Left" /*isPrimaryKey={true}*/ />
                                <ColumnDirective field='TEN_SIZE' headerTextAlign='Center' headerText='Size' width='100' textAlign="Left" />
                                <ColumnDirective field='GIA_STR' headerTextAlign='Center' headerText='Giá' width='150' textAlign="Right" />
                                <ColumnDirective field='SO_LUONG' headerTextAlign='Center' headerText='Số lượng' width='120' editType='dropdownedit' textAlign="Right" />
                                <ColumnDirective field='TRI_GIA_STR' headerTextAlign='Center' headerText='Trị giá' width='170' textAlign="Right" />
                                {/* <ColumnDirective field='MA_TL' headerTextAlign='Center' headerText='MA_TL' width='100' textAlign="Right"/> */}
                                {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                                {/* <ColumnDirective field='EMAIL' headerTextAlign='Center' headerText='Email' width='200' textAlign="Left" /> */}
                                {/*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */}
                                {/* <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' headerText='Ngày tạo' width='200' textAlign="Left"  /> 
                    */}
                            </ColumnsDirective>
                            <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
                        </GridComponent>
                        <div className={clsx(style.total)}>Tổng trị giá: {intToVNDCurrencyFormat(cart.TONG_TRI_GIA) + " ₫"}</div>
                    </div>

                </div>
            </div> </div> : <></>}

    </>);
}
//chỉ update lúc cần
export default React.memo(CartDetailToPrint);