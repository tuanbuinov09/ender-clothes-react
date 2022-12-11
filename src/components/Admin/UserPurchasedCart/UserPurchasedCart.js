import React, { useEffect, useRef, useState } from 'react';
import { L10n } from '@syncfusion/ej2-base';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import { CheckIcon, ViewDetailIcon } from '../../../icons';
import axios from 'axios';
import '../ej2-grid.css'
import { removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import style from './UserPurchasedCart.module.css';
import clsx from 'clsx';
import CartDetail from '../CartDetail/CartDetail';
import SectionTitle from '../../HomePage/SectionTitle/SectionTitle';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import CartDetailToPrint from '../CartDetail/CartDetailToPrint';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation'
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function UserPurchasedCart(props) {
    removeSyncfusionLicenseMessage();
    const [carts, setCarts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCart, setSelectedCart] = useState({});
    const grid = useRef();
    const [rerender, setRerender] = useState();
    const [filterState, setFilterState] = useState(-2);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        try {
            setIsLoading(true);
            console.log(`http://localhost:22081/api/KhachHang/carts?filterState=${filterState}&customerId=${JSON.parse(localStorage.getItem('user')).MA_KH}`)
            axios.get(`${REACT_APP_API_URL}/api/KhachHang/carts?filterState=${filterState}&customerId=${JSON.parse(localStorage.getItem('user')).MA_KH}`, {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                }
            }).then(res => {
                const cartsFromApi = res.data;
                // console.log(cartsFromApi);
                cartsFromApi.forEach((cart) => {
                    if (cart.NGAY_TAO) {
                        let date = new Date(cart.NGAY_TAO);
                        cart.NGAY_TAO = date.toLocaleDateString('vi-VN');
                    }
                    if (cart.NGAY_GIAO) {
                        let date = new Date(cart.NGAY_GIAO);
                        cart.NGAY_GIAO = date.toLocaleDateString('vi-VN');
                    }
                    if (cart.TRANG_THAI === 0) {
                        cart.TRANG_THAI_STR = 'Chờ duyệt';
                    }
                    if (cart.TRANG_THAI === 1) {
                        cart.TRANG_THAI_STR = 'Đang giao hàng';
                    }
                    if (cart.TRANG_THAI === 2) {
                        cart.TRANG_THAI_STR = 'Đã hoàn tất';
                    }
                    if (cart.TRANG_THAI === -1) {
                        cart.TRANG_THAI_STR = 'Đã hủy';
                    }
                })
                // console.log(cartsFromApi);
                setCarts(cartsFromApi);
                console.log(cartsFromApi);
                grid.current.dataSource = cartsFromApi;
                setIsLoading(false);
            });

        } catch (error) {
            console.error(error);
        }
    }, [filterState, rerender]);

    let editOptions, toolbarOptions;

    // console.log(grid.current);
    editOptions = { /*allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' */ };
    let pageSettings = { pageSize: 8 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };

    // toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    // toolbarOptions = ['Edit', 'Update', 'Cancel'];
    toolbarOptions = ['ColumnChooser'];
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
                "Columnchooser": "Chọn cột cần xem",
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


    const closeDialog = () => {
        setOpenDialog(false);
    }
    const openDialogFnc = () => {
        setOpenDialog(true);
    }
    const toggleReRender = () => {
        setRerender(!rerender);
    }

    const dropdownList = useRef();
    let dropdpwnData = [
        { TRANG_THAI: -2, TRANG_THAI_STR: 'Tất cả' },
        { TRANG_THAI: -1, TRANG_THAI_STR: 'Đã hủy' },
        { TRANG_THAI: 0, TRANG_THAI_STR: 'Chờ duyệt' },
        { TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao' },
        { TRANG_THAI: 2, TRANG_THAI_STR: 'Đã hoàn tất' }
    ];
    let fields = { text: 'TRANG_THAI_STR', value: 'TRANG_THAI' };

    const onFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TRANG_THAI_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(dropdpwnData, query);
    };

    const onChange = () => {
        setFilterState(dropdownList.current.value);
        console.log(filterState);
    }
    return (
        <div className={clsx(style.cartManagement)}>
            <SectionTitle title='Đơn hàng đã mua' />
            <div className={clsx(style.toolBar)}>
                {/* <button onClick={() => {
                    approve();
                }} className={clsx(style.checkButton, { [style.inActive]: selectedCart.TRANG_THAI !== 0 })}>
                    <span className={clsx(style.iconSvg)}><CheckIcon /></span>Duyệt
                </button> */}

                <div className={clsx(style.dropdownList)}>
                    <div className='control-section'>
                        <div id='filtering'>
                            <DropDownListComponent id="employeeDelivery" ref={dropdownList}
                                dataSource={dropdpwnData} filtering={onFiltering} filterBarPlaceholder='Tìm trạng thái'
                                allowFiltering={true} fields={fields} placeholder="Trạng thái" popupHeight="220px"
                                change={onChange} />
                        </div>
                    </div>

                </div>

                <button onClick={() => {
                    openDialogFnc();
                }} className={clsx(style.viewButton, { [style.inActive]: !selectedCart })}><span className={clsx(style.iconSvg)}><ViewDetailIcon /></span>Xem chi tiết</button>


            </div>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            <GridComponent ref={grid}
                toolbar={toolbarOptions}
                showColumnChooser={true}
                //  actionComplete={actionComplete} 
                //  actionBegin={actionBegin}
                locale='vi-VN'
                editSettings={editOptions}
                pageSettings={pageSettings}
                dataSource={carts} allowPaging={true} /*allowGrouping={true}*/
                allowSorting={true} allowFiltering={true}
                filterSettings={filterOptions} height={315}
                rowSelected={rowSelected}
                gridLines='Both'
            >
                <ColumnsDirective>
                    {/* <ColumnDirective field='MA_KH'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Mã KH' width='140' textAlign="Left" /> */}{/*isPrimaryKey={true}*/}
                    <ColumnDirective field='HO_TEN' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Người nhận' width='200' textAlign="Left" />
                    <ColumnDirective field='SDT' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='SĐT người nhận' width='200' editType='dropdownedit' textAlign="Left" />
                    {/* <ColumnDirective field='MA_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='MA_TL' width='100' textAlign="Right"/> */}
                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                    <ColumnDirective field='EMAIL' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Email người nhận' width='200' textAlign="Left" />
                    <ColumnDirective field='NGAY_TAO' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Ngày tạo' width='160' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />
                    <ColumnDirective field='NGAY_GIAO' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Ngày giao' width='160' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />

                    <ColumnDirective field='DIA_CHI' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Địa chỉ nhận' width='200' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Trạng thái' width='160' textAlign="Left" />
                    {/* <ColumnDirective field='MA_NV_DUYET'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Mã NV duyệt' width='160' textAlign="Left" /> */}
                    {/* <ColumnDirective field='MA_NV_GIAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Mã NV giao' width='160' textAlign="Left" /> */}
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
            </GridComponent>

            {openDialog && <CartDetail cartId={selectedCart.ID_GH} type='userViewing' rerender={toggleReRender} closeDialog={closeDialog} />}
        </div>
    );
}

export default UserPurchasedCart;