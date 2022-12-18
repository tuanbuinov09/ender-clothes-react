import React, { useEffect, useRef, useState } from 'react';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import { ViewDetailIcon, PlusIcon, XIcon, EditIcon } from '../../../icons';
import axios from 'axios';
import '../ej2-grid.css'
import { removeSyncfusionLicenseMessage, loadLocaleSyncfusion, setupInterceptors, toVNDDateFormat } from '../../../uitilities/utilities';
import style from './ColorManagement.module.css';
import { useNavigate } from "react-router-dom";
import clsx from 'clsx';
import SectionTitle from '../../HomePage/SectionTitle/SectionTitle';
import { Query } from '@syncfusion/ej2-data';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation'
import ColorEdit from './ColorEdit';
import { toast } from 'react-toastify';
import { ModalConfirmDialog } from '../../ModalConfirmDialog/ModalConfirmDialog';
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';

function ColorManagement(props) {

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
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            navigate("/employee/login", true);
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

        let url = `${REACT_APP_API_URL}/api/BangMau/all`;

        console.log(url);
        axios.get(url).then(resp => {
            resp.data.forEach(item => {
                if (item.NGAY_TAO) {
                    item.NGAY_TAO = toVNDDateFormat(item.NGAY_TAO);
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
        if (!selectedRecord.MA_MAU && paramViewMode !== 'add') {
            return;
        }
        setViewMode(paramViewMode)
        setOpenDialog(true);

    }
    const toggleReRender = () => {
        setRerender(!rerender);
    }

    const deleteSize = () => {
        if (!selectedRecord.MA_MAU) {
            return;
        }
        console.log(`${process.env.REACT_APP_API_URL}/api/BangMau/delete`)
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/BangMau/delete?colorId=${selectedRecord.MA_MAU}`
                ,
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
                'Quản lý bảng màu'} />
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
                }} className={clsx(style.viewButton, style.editButton, { [style.inActive]: !selectedRecord.MA_MAU })}><span className={clsx(style.iconSvg)}><EditIcon /></span>Sửa</button>
                <button onClick={() => {
                    // deleteProduct();
                    if (!selectedRecord.TEN_MAU) {
                        return;
                    }
                    setShowConfirmDialog(true);
                    setConfirmDialogTitle('Xác nhận xóa màu ' + selectedRecord.TEN_MAU);
                }} className={clsx(style.viewButton, style.deleteButton, { [style.inActive]: !selectedRecord.MA_MAU })}><span className={clsx(style.iconSvg)}><XIcon /></span>Xóa</button>
                <button onClick={() => {
                    openDialogFnc('view');
                }} className={clsx(style.viewButton, { [style.inActive]: !selectedRecord.MA_MAU })}><span className={clsx(style.iconSvg)}><ViewDetailIcon /></span>Xem chi tiết</button>


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
                    <ColumnDirective field='MA_MAU' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mã Màu' width='200' textAlign="Left" /*isPrimaryKey={true}*/ />
                    <ColumnDirective field='TEN_MAU' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Tên Màu' width='160' textAlign="Left" />
                    <ColumnDirective field='TEN_TIENG_ANH' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Màu hiển thị' width='160' textAlign="Left" />
                    {/* <ColumnDirective field='TEN_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Thể loại' width='150' editType='dropdownedit' textAlign="Left" /> */}

                    <ColumnDirective field='NGAY_TAO' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Ngày tạo' width='150' textAlign="Left" />
                    <ColumnDirective field='MA_NV' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mã NV tạo' width='150' textAlign="Left" />
                    <ColumnDirective field='HO_TEN_NV' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Tên NV tạo' width='150' textAlign="Left" />
                    {/* <ColumnDirective field='MA_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='MA_TL' width='100' textAlign="Right"/> */}
                    {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                    {/* <ColumnDirective field='HINH_ANH'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='Hình ảnh' width='200' textAlign="Left" /> */}

                    {/* <ColumnDirective field='TEN_NV_DUYET'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV duyệt' width='160' textAlign="Left" />
                        <ColumnDirective field='TEN_NV_GIAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV giao' width='160' textAlign="Left" /> */}


                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
            </GridComponent>
            }


            {openDialog && <ColorEdit colorId={selectedRecord.MA_MAU} viewMode={viewMode} rerender={toggleReRender} closeDialog={closeDialog} />}
        </div>
    );
}

export default ColorManagement;