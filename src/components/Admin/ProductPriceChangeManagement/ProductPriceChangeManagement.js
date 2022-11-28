import React, { useEffect, useRef, useState } from 'react';
import { L10n } from '@syncfusion/ej2-base';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import { CheckIcon, ViewDetailIcon, PlusIcon, XIcon, EditIcon } from '../../../icons';
import axios from 'axios';
import '../ej2-grid.css'
import { removeSyncfusionLicenseMessage, loadLocaleSyncfusion, intToVNDCurrencyFormat } from '../../../uitilities/utilities';
import style from './ProductPriceChangeManagement.module.css';
import { useNavigate, Link } from "react-router-dom";
import clsx from 'clsx';
import SectionTitle from '../../HomePage/SectionTitle/SectionTitle';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation'
import ProductPriceChangeEdit from './ProductPriceChangeEdit';
import { toast } from 'react-toastify';

function ProductPriceChangeManagement(props) {
    let navigate = useNavigate();

    const [viewMode, setViewMode] = useState('add');
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            navigate("/employee/login", true);
        }
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user');
        }
    }, [])

    props.changeHeader('employee');

    // const notify = (message) => toast.info(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    const [carts, setCarts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImport, setSelectedImport] = useState({});
    const grid = useRef();
    const [rerender, setRerender] = useState();
    const [filterState, setFilterState] = useState(-2);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        removeSyncfusionLicenseMessage();

        try {
            setIsLoading(true);
            let url = `${process.env.REACT_APP_API_URL}/api/ThayDoiGia/all?top=`;

            console.log(url)
            axios.get(url).then(res => {
                const thayDoiGiaFromAPI = res.data;
                // console.log(thayDoiGiaFromAPI);
                thayDoiGiaFromAPI.forEach((phieuNhap) => {
                    if (phieuNhap.NGAY_THAY_DOI) {
                        let date = new Date(phieuNhap.NGAY_THAY_DOI);
                        phieuNhap.NGAY_THAY_DOI = date.toLocaleDateString('vi-VN');
                        console.log(new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date))
                        phieuNhap.NGAY_THAY_DOI = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date)
                    }

                    if (phieuNhap.GIA) {
                        phieuNhap.GIA = intToVNDCurrencyFormat(phieuNhap.GIA, true);
                    }
                    if (phieuNhap.GIA_THAY_DOI) {
                        phieuNhap.GIA_THAY_DOI = intToVNDCurrencyFormat(phieuNhap.GIA_THAY_DOI, true);
                    }

                    if (phieuNhap.TRANG_THAI === 0) {
                        phieuNhap.TRANG_THAI_STR = 'Chờ duyệt';
                    }
                    if (phieuNhap.TRANG_THAI === 1) {
                        phieuNhap.TRANG_THAI_STR = 'Đang giao hàng';
                    }
                    if (phieuNhap.TRANG_THAI === 2) {
                        phieuNhap.TRANG_THAI_STR = 'Đã hoàn tất';
                    }
                    if (phieuNhap.TRANG_THAI === -1) {
                        phieuNhap.TRANG_THAI_STR = 'Đã hủy';
                    }
                })
                // console.log(thayDoiGiaFromAPI);
                setCarts(thayDoiGiaFromAPI);
                console.log(thayDoiGiaFromAPI);
                grid.current.dataSource = thayDoiGiaFromAPI;
                setIsLoading(false);
            });

        } catch (error) {
            console.error(error);
        }
    }, [filterState, rerender]);

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
    loadLocaleSyncfusion();

    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // console.log(selectedrowindex[0] + " : " +  JSON.stringify(selectedrecords[0]));

            setSelectedImport(JSON.parse(JSON.stringify(selectedrecords[0])));
            // console.log("selectedRowData:", selectedImport);
        }
    }

    const closeDialog = () => {
        setOpenDialog(false);
    }
    const openDialogFnc = (paramViewMode) => {
        console.log('fired', paramViewMode)
        if (!selectedImport.MA_PN && paramViewMode !== 'add') {
            return;
        }
        setViewMode(paramViewMode)
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
        query = (e.text !== '') ? query.where('TRANG_THAI_STR', 'startswith', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(dropdpwnData, query);
    };

    const onChange = () => {
        setFilterState(dropdownList.current.value);
        console.log(filterState);
    }
    // const deleteProduct = () => {
    //     if (!selectedImport.MA_SP) {
    //         return;
    //     }
    //     console.log(`${process.env.REACT_APP_API_URL}/api/SanPham/delete`)
    //     try {
    //         axios.delete(`${process.env.REACT_APP_API_URL}/api/SanPham/delete?productId=${selectedImport.MA_SP}`
    //         ).then(res => {
    //             const response = res.data;
    //             console.log('res delete: ' + response);


    //             if (response.errorDesc) {
    //                 notify(response.errorDesc);
    //             } else {
    //                 notify(response.responseMessage);
    //                 setRerender(!rerender);
    //             }
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }
    return (
        <div className={clsx(style.cartManagement)}>
            <div className={clsx(style.top)}>
                {/* <ToastContainer /> */}
            </div>
            <SectionTitle title={
                'Quản lý thay đổi giá'} />
            <div className={clsx(style.toolBar)}>
                {/* <button onClick={() => {
                    approve();
                }} className={clsx(style.checkButton, { [style.inActive]: selectedImport.TRANG_THAI !== 0 })}>
                    <span className={clsx(style.iconSvg)}><CheckIcon /></span>Duyệt
                </button> */}
                {/* {((JSON.parse(localStorage.getItem('employee'))).MA_QUYEN === 'Q04') ?//Q04; quyền nhân viên giao hàng
                    <></>
                    : <div className={clsx(style.dropdownList)}>
                        <div className='control-section'>
                            <div id='filtering'>
                                <DropDownListComponent id="employeeDelivery" ref={dropdownList}
                                    dataSource={dropdpwnData} filtering={onFiltering} filterBarPlaceholder='Tìm trạng thái'
                                    allowFiltering={true} fields={fields} placeholder="Trạng thái" popupHeight="220px"
                                    change={onChange} />
                            </div>
                        </div>

                    </div>
                } */}
                <button onClick={() => {
                    openDialogFnc('add');
                }} className={clsx(style.viewButton, style.addButton)}><span className={clsx(style.iconSvg)}><PlusIcon /></span>Thêm</button>
                {/* <button onClick={() => {
                    openDialogFnc('edit');
                }} className={clsx(style.viewButton, style.editButton, { [style.inActive]: !selectedImport })}><span className={clsx(style.iconSvg)}><EditIcon /></span>Sửa</button> */}
                {/* <button onClick={() => {
                    deleteProduct();
                }} className={clsx(style.viewButton, style.deleteButton, { [style.inActive]: !selectedImport })}><span className={clsx(style.iconSvg)}><XIcon /></span>Xóa</button> */}
                <button onClick={() => {
                    openDialogFnc('view');
                }} className={clsx(style.viewButton, { [style.inActive]: !selectedImport })}><span className={clsx(style.iconSvg)}><ViewDetailIcon /></span>Xem chi tiết</button>


            </div>

            {/* <TooltipComponent ref={tooltip} target='.e-rowcell' beforeRender={(args) => { beforeRender(args) }}></TooltipComponent> */}

            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}
            {<GridComponent ref={grid}
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
                    <ColumnDirective field='MA_SP' headerTextAlign='Center' headerText='Mã SP' width='200' textAlign="Left" /*isPrimaryKey={true}*/ />
                    <ColumnDirective field='TEN_SP' headerTextAlign='Center' headerText='Tên SP' width='200' textAlign="Left" />
                    <ColumnDirective field='TEN_MAU' headerTextAlign='Center' headerText='Màu' width='120' textAlign="Left" />
                    <ColumnDirective field='TEN_SIZE' headerTextAlign='Center' headerText='Size' width='120' textAlign="Left" />
                    <ColumnDirective field='GIA' headerTextAlign='Center' headerText='Giá trước thay đổi' width='250' editType='dropdownedit' textAlign="Left" />
                    <ColumnDirective field='GIA_THAY_DOI' headerTextAlign='Center' headerText='Giá sau thay đổi' width='250' textAlign="Left" />

                    <ColumnDirective field='NGAY_THAY_DOI' headerTextAlign='Center' headerText='Ngày thay đổi' width='200' textAlign="Left" />
                    {/* <ColumnDirective field='GHI_CHU' headerTextAlign='Center' headerText='Ghi chú' width='150' textAlign="Left" /> */}
                    <ColumnDirective field='MA_NV' headerTextAlign='Center' headerText='Mã NV tạo' width='150' textAlign="Left" />
                    <ColumnDirective field='HO_TEN_NV' headerTextAlign='Center' headerText='Họ tên NV tạo' width='150' textAlign="Left" />

                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
            </GridComponent>
            }


            {openDialog && <ProductPriceChangeEdit importId={selectedImport.MA_PN} viewMode={viewMode} rerender={toggleReRender} closeDialog={closeDialog} />}
        </div>
    );
}

export default ProductPriceChangeManagement;