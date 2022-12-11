import React, { useEffect, useRef, useState } from 'react';
import { L10n } from '@syncfusion/ej2-base';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import { CheckIcon, ViewDetailIcon, PlusIcon, XIcon, EditIcon } from '../../../icons';
import axios from 'axios';
import '../ej2-grid.css'
import { removeSyncfusionLicenseMessage, loadLocaleSyncfusion, setupInterceptors, toVNDDateFormat } from '../../../uitilities/utilities';
import style from './EmployeeManagement.module.css';
import { useNavigate, Link } from "react-router-dom";
import clsx from 'clsx';
import SectionTitle from '../../HomePage/SectionTitle/SectionTitle';
import { Query } from '@syncfusion/ej2-data';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation'
import EmployeeEdit from './EmployeeEdit';
import { toast } from 'react-toastify';
import { ModalConfirmDialog } from '../../ModalConfirmDialog/ModalConfirmDialog';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function EmployeeManagement(props) {

    const [viewMode, setViewMode] = useState('add');


    props.changeHeader('employee')
    let navigate = useNavigate();
    setupInterceptors(navigate, 'employee');

    // begin syncfusion react declaration 
    const grid = useRef();
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
            setSelectedRecord(JSON.parse(JSON.stringify(selectedrecords[0])));
            // console.log("selectedRowData:", selectedRecord);
        }
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
    // end syncfusion react declaration 

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q02') {
            navigate("/employee/login", true);
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            return;
        }
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user')
        }
    }, [])

    // const notify = (message) => toast.info(message, { autoClose: true, closeDuration: 3000 });//error/info/add
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [rerender, setRerender] = useState();
    const [filterState, setFilterState] = useState(-2);

    const [isLoading, setIsLoading] = useState(false);

    const getAllSize = async () => {
        setIsLoading(true);

        let url = `${REACT_APP_API_URL}/api/NhanVien/all`;

        console.log(url);
        axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
            }
        }).then(resp => {
            resp.data.forEach(item => {
                if (item.NGAY_TAO) {
                    item.NGAY_TAO = toVNDDateFormat(item.NGAY_TAO);
                }
                if (!item.TRANG_THAI) {
                    item.TRANG_THAI_STR = 'Đã vô hiệu hóa';
                } else if (item.TRANG_THAI) {
                    item.TRANG_THAI_STR = 'Đang hoạt động';
                }
                if (item.MA_QUYEN) {
                    const tenQuyen = item.TEN_QUYEN === 'NHAN_VIEN' ? 'Nhân viên' : item.TEN_QUYEN === 'QUAN_LY' ? 'Quản lý' : item.TEN_QUYEN === 'NHAN_VIEN_GH' ? 'Nhân viên vận chuyển' : '';
                    item.QUYEN_STR = tenQuyen;
                }

            })
            setData(resp.data);
            grid.current.dataSource = resp.data;
            console.log(resp.data);
        });
    }


    useEffect(() => {
        removeSyncfusionLicenseMessage();

        try {
            getAllSize();

            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }, [rerender]);

    const closeDialog = () => {
        setOpenDialog(false);
    }
    const openDialogFnc = (paramViewMode) => {
        console.log('fired', paramViewMode)
        if (!selectedRecord.MA_NV && paramViewMode !== 'add') {
            return;
        }
        setViewMode(paramViewMode)
        setOpenDialog(true);

    }
    const toggleReRender = () => {
        setRerender(!rerender);
    }

    const deleteSize = () => {
        if (!selectedRecord.MA_NV) {
            return;
        }
        console.log(JSON.parse(localStorage.getItem('employee')).accessToken);
        console.log(`${process.env.REACT_APP_API_URL}/api/NhanVien/deactivate`)
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/NhanVien/deactivate?employeeId=${selectedRecord.MA_NV}`
                , {},
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }).then(res => {
                    const response = res.data;
                    console.log('res delete: ' + response);
                    if (response.errorDesc) {
                        toast.error(response.errorDesc);
                    } else {
                        toast.success(response.responseMessage);
                        setRerender(!rerender);
                    }
                });
        } catch (error) {
            console.error(error);
        }

    }

    // 
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState('');

    const onConfirmDelete = () => {
        deleteSize();
        setShowConfirmDialog(false);
    }
    const onDeny = () => {
        setShowConfirmDialog(false);
    }
    //
    return (
        <div className={clsx(style.cartManagement)}>
            {showConfirmDialog && <ModalConfirmDialog onConfirm={onConfirmDelete} onDeny={onDeny} title={confirmDialogTitle} />}
            <div className={clsx(style.top)}>
                {/* <ToastContainer /> */}
            </div>
            <SectionTitle title={
                'Quản lý nhân viên'} />
            <div className={clsx(style.toolBar)}>
                {/* <button onClick={() => {
                    approve();
                }} className={clsx(style.checkButton, { [style.inActive]: selectedRecord.TRANG_THAI !== 0 })}>
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
                <button onClick={() => {
                    openDialogFnc('edit');
                }} className={clsx(style.viewButton, style.editButton, { [style.inActive]: !selectedRecord })}><span className={clsx(style.iconSvg)}><EditIcon /></span>Sửa</button>
                <button onClick={() => {
                    // deleteProduct();
                    if (!selectedRecord.HO_TEN) {
                        return;
                    }
                    setShowConfirmDialog(true);
                    setConfirmDialogTitle('Xác nhận vô hiệu hóa tài khoản của nhân viên ' + selectedRecord.HO_TEN);
                }} className={clsx(style.viewButton, style.deleteButton, { [style.inActive]: !selectedRecord.TRANG_THAI })}><span className={clsx(style.iconSvg)}><XIcon /></span>Vô hiệu hóa</button>
                <button onClick={() => {
                    openDialogFnc('view');
                }} className={clsx(style.viewButton)}><span className={clsx(style.iconSvg)}><ViewDetailIcon /></span>Xem chi tiết</button>


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
                dataSource={data} allowPaging={true} /*allowGrouping={true}*/
                allowSorting={true} allowFiltering={true}
                filterSettings={filterOptions} height={315}
                rowSelected={rowSelected}
                gridLines='Both'
            >
                <ColumnsDirective>
                    <ColumnDirective field='MA_NV' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Mã nhân viên' width='200' textAlign="Left" /*isPrimaryKey={true}*/ />
                    <ColumnDirective field='HO_TEN' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Tên nhân viên' width='220' textAlign="Left" />
                    <ColumnDirective field='EMAIL' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Email' width='200' textAlign="Left" />
                    <ColumnDirective field='SDT' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Số điện thoại' width='200' textAlign="Left" />
                    <ColumnDirective field='CMND' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='CMND' width='200' textAlign="Left" />
                    <ColumnDirective field='DIA_CHI' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Địa chỉ' width='200' textAlign="Left" />
                    {/* <ColumnDirective field='TEN_TL' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Thể loại' width='150' editType='dropdownedit' textAlign="Left" /> */}
                    <ColumnDirective field='QUYEN_STR' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Quyền' width='200' textAlign="Left" />
                    <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Ngày tạo' width='150' textAlign="Left" />
                    <ColumnDirective field='TRANG_THAI_STR' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Trạng thái' width='150' textAlign="Left" />
                    {/* <ColumnDirective field='MA_NV' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Mã NV tạo' width='150' textAlign="Left" />
                    <ColumnDirective field='HO_TEN_NV' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Tên NV tạo' width='150' textAlign="Left" /> */}
                    {/* <ColumnDirective field='MA_TL' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='MA_TL' width='100' textAlign="Right"/> */}
                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                    {/* <ColumnDirective field='HINH_ANH' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='Hình ảnh' width='200' textAlign="Left" /> */}

                    {/* <ColumnDirective field='TEN_NV_DUYET' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='NV duyệt' width='160' textAlign="Left" />
                        <ColumnDirective field='TEN_NV_GIAO' headerTextAlign='Center' clipMode='EllipsisWithTooltip' headerText='NV giao' width='160' textAlign="Left" /> */}


                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
            </GridComponent>
            }


            {openDialog && <EmployeeEdit employeeId={selectedRecord.MA_NV} viewMode={viewMode} rerender={toggleReRender} closeDialog={closeDialog} />}
        </div>
    );
}

export default EmployeeManagement;