import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductEdit.module.css';
import clsx from 'clsx';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { loadLocaleSyncfusion, newInvoiceIdByDate, removeSyncfusionLicenseMessage } from '../../../uitilities/utilities';
import { useDispatch } from 'react-redux/es/exports';
import { Button } from '../../Button/Button';
import { XIcon, CheckIcon, SaveIcon, CancelIcon, PrintIcon } from '../../../icons';
import { L10n } from '@syncfusion/ej2-base';
import ToastContainer, { toast } from 'react-light-toast';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { intToVNDCurrencyFormat } from '../../../uitilities/utilities'
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';// To load the culture based first day of week
function ProductEdit(props) {
    const dispatch = useDispatch();
    // const params = useParams(); prams.cartId
    console.log(props.productId, props.viewMode);
    const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    const [cart, setCart] = useState({});
    const [flag, setFlag] = useState(false);
    const [categories, setCategories] = useState([]);
    removeSyncfusionLicenseMessage();
    const categoryDropdownList = useRef();
    const grid = useRef();
    const datePicker = useRef();
    useEffect(() => {
        try {
            axios.get('http://localhost:22081/api/TheLoai').then(res => {
                const categoriesFromAPI = res.data.filter((item) => {
                    return !!item.MA_TL_CHA
                });
                console.log(categoriesFromAPI)
                setCategories(categoriesFromAPI);
                setFlag(true);
            })
        } catch (e) {
            console.log(e);
        }
    }, [])
    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {
                // axios.get(`http://localhost:22081/api/SanPham/${props.productId}`).then(res => {
                //     const response = res.data;
                //     response.chiTietGioHang2.forEach((resp, index) => {
                //         try {
                //             resp.STT = index + 1;
                //             resp.GIA_STR = intToVNDCurrencyFormat(resp.GIA) + " ₫";
                //             resp.TRI_GIA_STR = intToVNDCurrencyFormat(resp.GIA * resp.SO_LUONG, true);//thêm true + đ
                //         } catch (e) {
                //             console.log(e)
                //         }
                //     })
                //     setCart(response);
                //     //set nhân viên đã được assign   
                //     setFlag(true);


                //     categoryDropdownList.current.value = response.MA_NV_GIAO;
                //     console.log("nvgiao old:", response.MA_NV_GIAO)

                // });
            } catch (error) {
                console.error(error);
            }
        } else {

        }



    }, []);
    let pageSettings = { pageSize: 6 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };
    // L10n.load({
    //     'vi-VN': {
    //         "grid": {
    //             "EmptyRecord": "Không có mục nào để hiển thị",
    //             "True": "Đúng",
    //             "False": "Sai",
    //             "InvalidFilterMessage": "Dữ liệu bộ lọc không hợp lệ",
    //             "GroupDropArea": "Kéo một tiêu đề cột ở đây để nhóm cột của nó",
    //             "UnGroup": "Nhấn vào đây để hủy nhóm",
    //             "GroupDisable": "Nhóm bị vô hiệu hóa cho cột này",
    //             "FilterbarTitle": "\"Lọc tiêu đề",
    //             "EmptyDataSourceError": "DataSource không được để trống khi tải ban đầu vì các cột được tạo từ dataSource trong Lưới cột AutoGenerate",
    //             "Add": "Thêm mới",
    //             "Edit": "Chỉnh sửa",
    //             "Cancel": "Hủy bỏ",
    //             "Update": "Cập nhật",
    //             "Delete": "Xóa bỏ",
    //             "Print": "In",
    //             "Pdfexport": "Xuất PDF",
    //             "Excelexport": "Xuất file Excel",
    //             "Wordexport": "Xuất từ",
    //             "Csvexport": "Xuất CSV",
    //             "Search": "Tìm kiếm",
    //             "Columnchooser": "Cột",
    //             "Save": "Lưu",
    //             "Item": "mục",
    //             "Items": "mặt hàng",
    //             "EditOperationAlert": "Không có bản ghi nào được chọn cho thao tác chỉnh sửa",
    //             "DeleteOperationAlert": "Không có bản ghi nào được chọn cho hoạt động xóa",
    //             "SaveButton": "Lưu",
    //             "OKButton": "Đồng ý",
    //             "CancelButton": "Hủy bỏ",
    //             "EditFormTitle": "Chi tiết của",
    //             "AddFormTitle": "Thêm bản ghi mới",
    //             "BatchSaveConfirm": "Bạn có chắc chắn muốn lưu các thay đổi?",
    //             "BatchSaveLostChanges": "Những thay đổi chưa được lưu sẽ bị mất. Bạn có chắc chắn muốn tiếp tục?",
    //             "ConfirmDelete": "Bạn có chắc chắn muốn xóa Bản ghi?",
    //             "CancelEdit": "Bạn có chắc chắn muốn Hủy bỏ các thay đổi?",
    //             "ChooseColumns": "Chọn cột",
    //             "SearchColumns": "cột tìm kiếm",
    //             "Matchs": "Lọc kết quả tìm thấy",
    //             "FilterButton": "OK",
    //             "ClearButton": "Hủy",
    //             "StartsWith": "Bắt đầu với",
    //             "EndsWith": "Kết thúc với",
    //             "Contains": "Bao gồm",
    //             "Equal": "Bằng",
    //             "NotEqual": "Không bằng",
    //             "LessThan": "Ít hơn",
    //             "LessThanOrEqual": "Nhỏ hơn hoặc bằng",
    //             "GreaterThan": "Lớn hơn",
    //             "GreaterThanOrEqual": "Lớn hơn hoặc bằng",
    //             "ChooseDate": "Chọn một ngày",
    //             "EnterValue": "Nhập giá trị",
    //             "Copy": "Sao chép",
    //             "Group": "Nhóm theo cột này",
    //             "Ungroup": "Ungroup theo cột này",
    //             "autoFitAll": "Tự động điều chỉnh tất cả các cột",
    //             "autoFit": "Tự động điều chỉnh cột này",
    //             "Export": "Xuất",
    //             "FirstPage": "Trang đầu",
    //             "LastPage": "Trang cuối",
    //             "PreviousPage": "Trang trước",
    //             "NextPage": "Trang tiếp theo",
    //             "SortAscending": "Sắp xếp tăng dần",
    //             "SortDescending": "Sắp xếp giảm dần",
    //             "EditRecord": "Chỉnh sửa bản ghi",
    //             "DeleteRecord": "Xóa bản ghi",
    //             "FilterMenu": "Bộ lọc",
    //             "SelectAll": "Chọn tất cả",
    //             "Blanks": "Khoảng trống",
    //             "FilterTrue": "Đúng",
    //             "FilterFalse": "Sai",
    //             "NoResult": "Lọc kết quả tìm thấy",
    //             "ClearFilter": "Bỏ lựa chọn lọc",
    //             "NumberFilter": "Bộ lọc số",
    //             "TextFilter": "Bộ lọc văn bản",
    //             "DateFilter": "Bộ lọc ngày",
    //             "DateTimeFilter": "Bộ lọc DateTime",
    //             "MatchCase": "Trường hợp phù hợp",
    //             "Between": "Giữa",
    //             "CustomFilter": "Bộ lọc tùy chỉnh",
    //             "CustomFilterPlaceHolder": "Nhập giá trị",
    //             "CustomFilterDatePlaceHolder": "Chọn một ngày",
    //             "AND": "VÀ",
    //             "OR": "HOẶC LÀ",
    //             "ShowRowsWhere": "Hiển thị các hàng trong đó:"
    //         },
    //         "pager": {
    //             "currentPageInfo": "{0} trên {1} trang",
    //             // "totalItemsInfo": "({0} dòng)",
    //             "totalItemsInfo": "Tổng số dòng: {0}",
    //             "firstPageTooltip": "Đến trang đầu tiên",
    //             "lastPageTooltip": "Đến trang cuối",
    //             "nextPageTooltip": "Chuyển đến trang tiếp theo",
    //             "previousPageTooltip": "Chuyển đến trang trước",
    //             "nextPagerTooltip": "Đi đến máy nhắn tin tiếp theo",
    //             "previousPagerTooltip": "Đi đến máy nhắn tin trước",
    //             "pagerDropDown": "Dòng hiển thị",
    //             "pagerAllDropDown": "Bản ghi",
    //             "All": "Tất cả",
    //             // "totalItemInfo": "({0} dòng)"
    //             "totalItemInfo": "{0} dòng"
    //         },
    //     }
    // });

    loadLocaleSyncfusion();
    // const finish = () => {
    //     try {
    //         axios.put(`http://localhost:22081/api/NhanVien/finish-cart`, {
    //             ID_GH: cart.ID_GH
    //         }).then(res => {
    //             const response = res.data;
    //             // console.log('res: ' + response);
    //             setCart({ ...cart, TRANG_THAI: 2, TRANG_THAI_STR: 'Đã hoàn tất' })
    //             notify("Giao đơn hàng thành công");
    //             props.rerender();
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    const save = () => {

        const selectedItem = categoryDropdownList.current.itemData;
        console.log(categoryDropdownList.current.value);
        const assignedEmpID = categoryDropdownList.current.value;
        if (!assignedEmpID) {
            notify("Hãy chọn nhân viên vận chuyển");
            return;
        }
        try {
            axios.put(`http://localhost:22081/api/GioHang/assign-delivery`, {
                ID_GH: cart.ID_GH,
                MA_NV_GIAO: assignedEmpID,
                MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV
            }).then(res => {
                const response = res.data;
                // console.log('res: ' + response);
                setCart({
                    ...cart, TRANG_THAI: 1, TRANG_THAI_STR: 'Đang giao hàng',
                    MA_NV_DUYET: JSON.parse(localStorage.getItem('employee')).MA_NV, TEN_NV_DUYET: JSON.parse(localStorage.getItem('employee')).HO_TEN
                    , MA_NV_GIAO: assignedEmpID, TEN_NV_GIAO: selectedItem.HO_TEN
                })
                notify("Đã giao cho nhân viên: " + selectedItem.HO_TEN);

                props.rerender();
            });
        } catch (error) {
            console.error(error);
        }

    }

    const cancel = () => {
        if (cart.TRANG_THAI === -1 || cart.TRANG_THAI === 1 || cart.TRANG_THAI === 2) {
            notify("Đơn hàng đã được duyệt, không thể hủy.");
            return;
        }
        try {
            axios.put(`http://localhost:22081/api/KhachHang/cancel-cart`, {
                ID_GH: cart.ID_GH
            }).then(res => {
                const response = res.data;
                // console.log('res: ' + response);
                setCart({ ...cart, TRANG_THAI: -1, TRANG_THAI_STR: 'Đã hủy' })
                notify("Hủy đơn hàng thành công");
                props.rerender();
            });
        } catch (error) {
            console.error(error);
        }

    }
    // const print = () => {
    //     const maHD = newInvoiceIdByDate();
    //     //tạo hóa đơn
    //     axios.post(`http://localhost:22081/api/HoaDon/`, {
    //         ID_GH: cart.ID_GH,
    //         MA_HD: maHD,
    //         MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV
    //     }).then(res => {
    //         setPreparePrint(true);
    //     })
    // }
    let fields = { text: 'TEN_TL', value: 'MA_TL' };
    // filtering event handler to filter a Country

    const onCategoryFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_TL', 'startswith', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(categories, query);
    };

    // const closePreparePrintDialog = () => {
    //     setPreparePrint(false);
    // }


    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết sản phẩm ${props.productId}` : props.viewMode === 'edit' ? `Chỉnh sửa sản phẩm ${props.productId}` : `Thêm mới sản phẩm`
    }

    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        flag ? <div className={clsx(style.modalWrapper)}>

            <div className={clsx(style.top)}>
                <ToastContainer />
            </div>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                    props.closeDialog();
                }}><XIcon /></span></h1>

                <h1 className={clsx(style.title)}>{getTitle()}</h1>
                <div className={clsx(style.btnCheckContainer)}>
                    {/* không duyệt nữa, assign cho nhân viên là duyệt luôn */}
                    {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ?

                        <>
                            {/* <button onClick={() => {
                        approve();
                    }} className={clsx(style.checkButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                        <span className={clsx(style.iconSvg)}><CheckIcon /></span>Duyệt
                    </button> */}
                            <button onClick={() => {
                                save();
                            }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                                <span className={clsx(style.iconSvg)}><SaveIcon /></span>Lưu
                            </button>

                        </>
                        : <></>
                        // <><button onClick={() => {
                        //     cancel();
                        // }} className={clsx(style.checkButton, style.cancelButton, { [style.inActive]: cart.TRANG_THAI !== 0 })}>
                        //     <span className={clsx(style.iconSvg)}><CancelIcon /></span>Hủy đơn hàng
                        // </button></>
                    }

                </div>

                <div className={clsx(style.cartInfo, style.form)}>
                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Tên sản phẩm:</label>
                        <input onChange={(e) => {
                            // setPassword(e.target.value.trim());
                            // handleChange("name1", e.target.value);
                        }} type="text" name='TEN_SP'
                            value={cart.TEN_SP}
                            placeholder="" className={clsx(style.input)}
                        />
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Thể loại:</label>
                        <div className={clsx(style.dropdownList, style.datePickerContainer)}>
                            <div className='control-section'>
                                <div id='filtering'>
                                    <DropDownListComponent id="category" ref={categoryDropdownList} dataSource={categories} filtering={onCategoryFiltering} filterBarPlaceholder='Tìm thể loại' allowFiltering={true} fields={fields} placeholder="Chọn thể loại cho sản phẩm" popupHeight="220px" />
                                </div>
                            </div>

                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Lượt xem:</label>
                        <input onChange={(e) => {
                            // setPassword(e.target.value.trim());
                            // handleChange("name1", e.target.value);
                        }} type="text" name='LUOT_XEM'
                            value={cart.LUOT_XEM}
                            placeholder="" className={clsx(style.input)}
                        />
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                        <div className={clsx(style.datePickerContainer)}>
                            <DatePickerComponent onChange={() => {
                            }} ref={datePicker} format={'dd/MM/yyyy'} locale='vi' />
                        </div>
                        {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                    </div>

                    <div className={clsx(style.inputGroup)}>
                        <label className={clsx(style.inputLabel)}>Mô tả:</label>
                        <textarea onChange={(e) => {
                            // setEmail(e.target.value.trim());
                            // handleChange("note", e.target.value);
                        }} type="text" placeholder="" /*value={email}*/
                            value={cart.MO_TA} name='MO_TA' className={clsx(style.input)} />
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
                        filterSettings={filterOptions} height={150}
                        // rowSelected={rowSelected}
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
                    <ColumnDirective field='DIA_CHI' headerTextAlign='Center' headerText='Địa chỉ' width='200' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR' headerTextAlign='Center' headerText='Trạng thái' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_DUYET' headerTextAlign='Center' headerText='Mã NV duyệt' width='200' textAlign="Left" />
                    <ColumnDirective field='MA_NV_GIAO' headerTextAlign='Center' headerText='Mã NV giao' width='200' textAlign="Left" /> */}
                        </ColumnsDirective>
                        <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]} />
                    </GridComponent>
                    {/* <div className={clsx(style.total)}>Tổng trị giá: {intToVNDCurrencyFormat(cart.TONG_TRI_GIA) + " ₫"}</div> */}
                </div>

            </div>
        </div> : <></>);
}
//chỉ update lúc cần
export default React.memo(ProductEdit);