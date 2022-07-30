import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './CartDetail.module.css';
import clsx from 'clsx';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { Button } from '../../Button/Button';
import { XIcon } from '../../../icons';
import { L10n } from '@syncfusion/ej2-base';
function CartDetail(props) {
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.cartId);
    const [selectedSize, setSelectedSize] = useState(null);
    const [cart, setCart] = useState(null);
    const [flag, setFlag] = useState(false);
    removeSyncfusionLicenseMessage();
    const grid = useRef();
    useEffect(() => {
        console.log("call api");
        console.log(`http://localhost:22081/api/GioHang?cartId=${props.cartId}`);
        try {
            axios.get(`http://localhost:22081/api/GioHang?cartId=${props.cartId}`).then(res => {
                const response = res.data;
                setCart(response);
                setFlag(true);
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

    return (
        flag?<div className={clsx(style.modalWrapper)}>
    <div className={clsx(style.modal)}>
        <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={()=>{
            props.closeDialog();
        }}><XIcon/></span></h1>
        <h1 className={clsx(style.title)}>Chi tiết GH {props.cartId}</h1>
        <div className={clsx(style.cartInfo)}>
            <div className={clsx(style.infoGroup)}>
                <label>Mã khách hàng: </label>
                <span>{cart.MA_KH}</span>
            </div>
            <div className={clsx(style.infoGroup)}>
                <label>Tên người nhận: </label>
                <span>{cart.HO_TEN}</span>
            </div>
            <div className={clsx(style.infoGroup)}>
                <label>Số điện thoại người nhận: </label>
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
                <span>{cart.TRANG_THAI}</span>
            </div>
            <div className={clsx(style.infoGroup)}>
                <label>Nhân viên duyệt: </label>
                <span>{cart.TEN_NV_DUYET}</span>
            </div>
            <div className={clsx(style.infoGroup)}>
                <label>Nhân viên giao: </label>
                <span>{cart.TEN_NV_GIAO}</span>
            </div>
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
        <GridComponent ref={grid}
                // toolbar={toolbarOptions}
                //  actionComplete={actionComplete} 
                //  actionBegin={actionBegin}
                locale='vi-VN'
                // editSettings={editOptions}
                pageSettings={pageSettings}
                dataSource={cart.chiTietGioHang2} allowPaging={true} /*allowGrouping={true}*/
                allowSorting={true} allowFiltering={true}
                filterSettings={filterOptions} height={300}
                // rowSelected={rowSelected}
                gridLines='Both'
            >
                <ColumnsDirective>
                    <ColumnDirective field='TEN_SP' headerTextAlign='Center' headerText='Tên SP' width='200' textAlign="Left" /*isPrimaryKey={true}*/ />
                    <ColumnDirective field='TEN_SIZE' headerTextAlign='Center' headerText='Size' width='200' textAlign="Left" />
                    <ColumnDirective field='GIA' headerTextAlign='Center' headerText='Giá' width='200' textAlign="Right" />
                    <ColumnDirective field='SO_LUONG' headerTextAlign='Center' headerText='Số lượng' width='200' editType='dropdownedit' textAlign="Left" />
                    {/* <ColumnDirective field='MA_TL' headerTextAlign='Center' headerText='MA_TL' width='100' textAlign="Right"/> */}
                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                    {/* <ColumnDirective field='EMAIL' headerTextAlign='Center' headerText='Email' width='200' textAlign="Left" /> */}
                    {/*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */}
                    {/* <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' headerText='Ngày tạo' width='200' textAlign="Left"  /> 
                    <ColumnDirective field='DIA_CHI' headerTextAlign='Center' headerText='Địa chỉ' width='200' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR' headerTextAlign='Center' headerText='Trạng thái' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_DUYET' headerTextAlign='Center' headerText='Mã NV duyệt' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_GIAO' headerTextAlign='Center' headerText='Mã NV giao' width='200' textAlign="Left" /> */}
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
            </GridComponent>
    </div>
</div>:<></>);
}

export default CartDetail;