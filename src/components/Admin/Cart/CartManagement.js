import React, { useEffect, useRef, useState } from 'react';
import { L10n } from '@syncfusion/ej2-base';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import { CheckIcon, ViewDetailIcon } from '../../../icons';
import axios from 'axios';
import '../ej2-grid.css'
import { removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { TooltipComponent, DialogComponent } from '@syncfusion/ej2-react-popups';
import style from './CartManagement.module.css';
import { useNavigate, Link } from "react-router-dom";
import clsx from 'clsx';
import CartDetail from '../CartDetail/CartDetail';
import SectionTitle from '../../HomePage/SectionTitle/SectionTitle'

function CartManagement(props) {
    let navigate = useNavigate();
    removeSyncfusionLicenseMessage();
    const [carts, setCarts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCart, setSelectedCart] = useState({});
    const grid = useRef();
    const dialog = useRef();
    useEffect(() => {
        try {
            axios.get(`http://localhost:22081/api/GioHang/all`).then(res => {
                const cartsFromApi = res.data;
                // console.log(cartsFromApi);
                cartsFromApi.forEach((cart) => {
                    if (cart.NGAY_TAO) {
                        let date = new Date(cart.NGAY_TAO);
                        cart.NGAY_TAO = date.toLocaleDateString('vi-VN');
                    }
                    if (cart.TRANG_THAI === 0) {
                        cart.TRANG_THAI_STR = 'Chờ duyệt';
                    }
                    if (cart.TRANG_THAI === 1) {
                        cart.TRANG_THAI_STR = 'Đã duyệt';
                    }
                    if (cart.TRANG_THAI === 2) {
                        cart.TRANG_THAI_STR = 'Đang giao hàng';
                    }
                    if (cart.TRANG_THAI === 3) {
                        cart.TRANG_THAI_STR = 'Đã hủy';
                    }
                })
                // console.log(cartsFromApi);
                setCarts(cartsFromApi);
            });

        } catch (error) {
            console.error(error);
        }
    }, []);

    let editOptions, toolbarOptions;

    // console.log(grid.current);
    {//     function actionBegin(args){
        //         if (grid.current && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
        //             const cols = grid.current.columns;
        //             for (const col of cols) {
        //                 if (col.field === "MA_SP") {
        //                     col.visible = true;
        //                 }
        //                 else if (col.field === "LUOT_XEM") {
        //                     col.visible = false;
        //                 }
        //             }
        //         }
        //     }
        //     function actionComplete(args) {
        //         if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        //             const dialog = args.dialog;
        //             dialog.showCloseIcon = false;
        //             dialog.height = 500;
        //             dialog.width = 600;
        //             // change the header of the dialog
        //             dialog.header = args.requestType === 'beginEdit' ? 'Chỉnh sửa sản phẩm ' + args.rowData['TEN_SP'] : 'Sản phẩm mới';
        //         }
        // // trả lại cột luot xem
        //         if (grid.current && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
        //             const cols = grid.current.columns;
        //             for (const col of cols) {

        //                 if (col.field === "LUOT_XEM") {
        //                     col.visible = true;
        //             }
        //         }
        //     }
        // }
        // actionBegin = actionBegin.bind(this);
        // actionComplete = actionComplete.bind(this);
    }
    editOptions = { /*allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' */ };
    let pageSettings = { pageSize: 6 };
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

    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // console.log(selectedrowindex[0] + " : " +  JSON.stringify(selectedrecords[0]));

            setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
            // console.log("selectedRowData:", selectedCart);
        }
    }

    const approve = () => {
        try {
            if (selectedCart.TRANG_THAI === 0) {
                const selectedrowindex = grid.current.getSelectedRowIndexes();
                let carts2 = [...carts];
                carts2[selectedrowindex[0]].TRANG_THAI = 1;
                carts2[selectedrowindex[0]].TRANG_THAI_STR = 'Đã duyệt';
                console.log(carts2);
                setCarts(carts2);
                //refresh grid

                grid.current.dataSource = carts;
            }
        } catch (e) {
            console.log(e);
        }

    }
    const closeDialog=()=>{
        setOpenDialog(false);
    }
    const openDialogFnc=()=>{
        setOpenDialog(true);
    }
    return (
        <div className={clsx(style.cartManagement)}>
            <SectionTitle title='Quản lý giỏ hàng'/>
            <div className={clsx(style.toolBar)}>
                {/* <button onClick={() => {
                    approve();
                }} className={clsx(style.checkButton, { [style.inActive]: selectedCart.TRANG_THAI !== 0 })}>
                    <span className={clsx(style.iconSvg)}><CheckIcon /></span>Duyệt
                </button> */}
                <button onClick={() => {
                    openDialogFnc();
                }} className={clsx(style.viewButton, { [style.inActive]: !selectedCart })}><span className={clsx(style.iconSvg)}><ViewDetailIcon /></span>Xem chi tiết</button>
            </div>

            <TooltipComponent ref={tooltip} target='.e-rowcell' beforeRender={(args) => { beforeRender(args) }}></TooltipComponent>
            <GridComponent ref={grid}
                // toolbar={toolbarOptions}
                //  actionComplete={actionComplete} 
                //  actionBegin={actionBegin}
                locale='vi-VN'
                editSettings={editOptions}
                pageSettings={pageSettings}
                dataSource={carts} allowPaging={true} /*allowGrouping={true}*/
                allowSorting={true} allowFiltering={true}
                filterSettings={filterOptions} height={300}
                rowSelected={rowSelected}
                gridLines='Both'
            >
                <ColumnsDirective>
                    <ColumnDirective field='MA_KH' headerTextAlign='Center' headerText='Mã KH' width='200' textAlign="Left" /*isPrimaryKey={true}*/ />
                    <ColumnDirective field='HO_TEN' headerTextAlign='Center' headerText='Người nhận' width='200' textAlign="Left" />
                    <ColumnDirective field='SDT' headerTextAlign='Center' headerText='SĐT' width='200' editType='dropdownedit' textAlign="Left" />
                    {/* <ColumnDirective field='MA_TL' headerTextAlign='Center' headerText='MA_TL' width='100' textAlign="Right"/> */}
                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                    <ColumnDirective field='EMAIL' headerTextAlign='Center' headerText='Email' width='200' textAlign="Left" />
                    <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' headerText='Ngày tạo' width='200' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />
                    <ColumnDirective field='DIA_CHI' headerTextAlign='Center' headerText='Địa chỉ' width='200' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR' headerTextAlign='Center' headerText='Trạng thái' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_DUYET' headerTextAlign='Center' headerText='Mã NV duyệt' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_GIAO' headerTextAlign='Center' headerText='Mã NV giao' width='200' textAlign="Left" />
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
            </GridComponent>

        {openDialog && <CartDetail cartId={selectedCart.ID_GH} closeDialog = {closeDialog}/>}
        </div>
    );
}

export default CartManagement;