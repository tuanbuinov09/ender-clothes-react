import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
import style from './ReportToPrint.module.css';
import clsx from 'clsx';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import { removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { L10n } from '@syncfusion/ej2-base';
import { intToVNDCurrencyFormat } from '../../../uitilities/utilities';
import { useReactToPrint } from 'react-to-print';
function SaleReportToPrint(props) {
    // const params = useParams(); prams.cartId
    console.log(props.data);
    const [flag, setFlag] = useState(true);
    removeSyncfusionLicenseMessage();
    const grid = useRef();
    useEffect(() => {
        props.data.forEach((dat, index) => {
            dat.STT = index + 1;

            dat.TONG_TRI_GIA_STR = intToVNDCurrencyFormat(dat.TONG_TRI_GIA, true);


            dat.TONG_DOANH_THU_STR = intToVNDCurrencyFormat(dat.TONG_DOANH_THU, true);
            dat.TONG_GIA_NHAP_STR = intToVNDCurrencyFormat(dat.TONG_GIA_NHAP, true);
            dat.TONG_GIA_TRA_STR = intToVNDCurrencyFormat(dat.TONG_GIA_TRA, true);
            dat.TONG_LOI_NHUAN_STR = intToVNDCurrencyFormat(dat.TONG_LOI_NHUAN, true);

            dat.THOI_GIAN = dat.THANG;
            if (props.typeView === 'profit') {
                if (props.type === "day") {
                    dat.THOI_GIAN = dat.NGAY;
                }
                if (props.type === "month") {
                    dat.THOI_GIAN = dat.THANG;
                }
                if (props.type === "quarter") {
                    dat.THOI_GIAN = dat.QUY;
                }
                if (props.type === "year") {
                    dat.THOI_GIAN = dat.NAM;
                }
            }

        })
    }, []);

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
    const componentRef = useRef(null);

    const print = useReactToPrint({
        content: () => componentRef.current,
    });
    return (<>

        {flag ? <div className={clsx(style.modalPrintWrapper)} >

            <h1 className={clsx(style.header, style.printButtonContainer)}>
                <button onClick={() => {
                    print();
                }} className={clsx(style.checkButton, style.printButton)}>
                    <span className={clsx(style.iconSvg)}><PrintIcon /></span>In báo cáo
                </button>
                <span className={clsx(style.closeButton)} onClick={() => {
                    props.setData(null);
                }}><XIcon /></span>
            </h1>

            <div className={clsx(style.container)} ref={componentRef}>
                <div className={clsx(style.modal)}>
                    <p className={clsx(style.subtitleCompanyName)}>Công ty TNHH END_CLOTHES</p>
                    <h1 className={clsx(style.title)}>Báo cáo {props.data.TONG_GIA_NHAP ? "lợi nhuận" : "doanh thu"} theo
                        {/* nếu k có tổng giá nhập thì là xem doanh thu, xem doanh thu thì chỉ theo tháng */}
                        {!props.data.TONG_GIA_NHAP ? ' tháng' : props.type === 'quarter' ? ' quý' : props.type === 'year' ? ' năm' : props.type === 'day' ? ' ngày' : ' tháng'}</h1>
                    <p className={clsx(style.subtitle)}>Từ ngày: <span>{props.data.fromDate}</span>     tới ngày: <span>{props.data.toDate}</span></p>
                    {/* <p className={clsx(style.subtitle)}>Nhân viên xuất báo cáo: <span>{JSON.parse(localStorage.getItem('employee')).HO_TEN}</span></p> */}

                    {/* detail */}
                    <div className={clsx(style.cartDetail)}>
                        <GridComponent ref={grid}
                            // toolbar={toolbarOptions}
                            //  actionComplete={actionComplete} 
                            //  actionBegin={actionBegin}
                            locale='vi-VN'
                            // editSettings={editOptions}
                            // pageSettings={pageSettings}
                            dataSource={props.data}
                            // allowPaging={true} /*allowGrouping={true}*/
                            // allowSorting={true} allowFiltering={true}
                            // filterSettings={filterOptions}
                            // rowSelected={rowSelected}
                            gridLines='Both'
                        >
                            <ColumnsDirective>
                                <ColumnDirective field='STT' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='STT' width='70' textAlign="Center" /*isPrimaryKey={true}*/ />
                                <ColumnDirective field='THOI_GIAN' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Thời gian' width='150' textAlign="Left" /*isPrimaryKey={true}*/ />
                                <ColumnDirective field='TONG_TRI_GIA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Doanh Thu' width='180' textAlign="Right" />

                                {props.data.TONG_GIA_NHAP ? <ColumnDirective field='TONG_GIA_NHAP_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Giá nhập' width='180' textAlign="Right" /> : <></>}
                                {props.data.TONG_GIA_TRA ? <ColumnDirective field='TONG_GIA_TRA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Giá trả' width='180' textAlign="Right" /> : <></>}
                                {props.data.TONG_LOI_NHUAN ? <ColumnDirective field='TONG_LOI_NHUAN_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Lợi nhuận' width='180' textAlign="Right" /> : <></>}


                            </ColumnsDirective>


                            <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
                        </GridComponent>
                        <div className={clsx(style.totalContainer)}>
                            <div className={clsx(style.total)}>{intToVNDCurrencyFormat(props.data.TONG_DOANH_THU) + " ₫"}</div>
                            {props.data.TONG_GIA_NHAP ? <div className={clsx(style.total)}> {intToVNDCurrencyFormat(props.data.TONG_GIA_NHAP) + " ₫"}</div> : <></>}
                            {props.data.TONG_GIA_TRA ? <div className={clsx(style.total)}> {intToVNDCurrencyFormat(props.data.TONG_GIA_TRA) + " ₫"}</div> : <></>}
                            {props.data.TONG_LOI_NHUAN ? <div className={clsx(style.total)}> {intToVNDCurrencyFormat(props.data.TONG_LOI_NHUAN) + " ₫"}</div> : <></>}

                        </div>

                    </div>

                    <div className={clsx(style.saleReportFooter)}>
                        <div className={clsx(style.signContainer)}>
                            <p className={clsx(style.reportLocation)}>Thành phố Hồ Chí Minh, ngày {(new Date()).getUTCDate()} tháng {(new Date()).getUTCMonth() + 1} năm {(new Date()).getUTCFullYear()}</p>
                            <p className={clsx(style.employeeNameTitle)}>Nhân viên lập báo cáo</p>
                            <p className={clsx(style.employeeName)}>{JSON.parse(localStorage.getItem('employee')).HO_TEN}</p>
                        </div>
                    </div>
                </div>
            </div> </div> : <></>}

    </>);
}
//chỉ update lúc cần
export default React.memo(SaleReportToPrint);