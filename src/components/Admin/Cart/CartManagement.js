import React, { useEffect, useRef, useState } from 'react';
import {L10n} from '@syncfusion/ej2-base'
import { ColumnDirective, ColumnsDirective, GridComponent,Inject, Page, Sort, Filter, Group, Edit, Toolbar } from '@syncfusion/ej2-react-grids';
import { data } from './datasource';
import axios from 'axios';
import '../ej2-grid.css'

function CartManagement(props) {
    const [products, setProducts] = useState([]);
    const grid = useRef();
    useEffect(()=>{
        try{
            axios.get(`http://localhost:22081/api/GioHang/`).then(res => {
                const productsFromApi = res.data;
                 console.log(productsFromApi);
                 setProducts(productsFromApi);
            });
            // let client = new SanPhamClient(undefined, axios);
            // let result2 = client.newArrivals("0","10");
            // console.log("1: ", result);
            // console.log("2: ", result2);
            
                    }catch(error){
            console.error(error);
                    }
                   
    },[]);
    var script = document.createElement("script");
    script.innerHTML=
    `
        var element = document.getElementById('js-licensing');
        element.remove();
    `
    // script.async = true;
    document.body.appendChild(script);

    let editOptions, toolbarOptions;
    
    console.log(grid.current);
//     function actionBegin(args){
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
    editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    let pageSettings = { pageSize: 6 };
    let filterOptions = {
        // type: 'Menu' // default là input
    };
    toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    L10n.load({
        'en-US': {
            grid: {
                'SaveButton': 'Thêm',
                'CancelButton': 'Hủy'
            }
        }
    });
    // grid.locale='vi-VN';
    return (
        <div>
            
        <GridComponent toolbar={toolbarOptions} ref={grid}
        //  actionComplete={actionComplete} 
        //  actionBegin={actionBegin}
         editSettings={editOptions}
         pageSettings={pageSettings}
         dataSource={products} allowPaging={true} /*allowGrouping={true}*/ 
         allowSorting={true} allowFiltering={true}
         filterSettings={filterOptions} height={300}>
            <ColumnsDirective>
                <ColumnDirective field='MA_KH' headerTextAlign='Center' headerText='Mã KH' width='100' textAlign="Right" /*isPrimaryKey={true}*//>
                <ColumnDirective field='HO_TEN' headerTextAlign='Center' headerText='Người nhận' width='100'/>
                <ColumnDirective field='SDT' headerTextAlign='Center' headerText='SĐT' width='100' editType='dropdownedit' />
                {/* <ColumnDirective field='MA_TL' headerTextAlign='Center' headerText='MA_TL' width='100' textAlign="Right"/> */}
                {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                <ColumnDirective field='EMAIL' headerTextAlign='Center' headerText='Email' width='100'/>
                <ColumnDirective field='NGAY_TAO' headerTextAlign='Center' headerText='Ngày tạo' width='100' type='date' format={'dd/MM/yyyy'} editType='datepickeredit' />
                <ColumnDirective field='DIA_CHI' headerTextAlign='Center' headerText='Địa chỉ' width='100'/>
                <ColumnDirective field='TRANG_THAI' headerTextAlign='Center' headerText='Trạng thái' width='100'/>
                <ColumnDirective field='MA_NV_DUYET' headerTextAlign='Center' headerText='Mã NV duyệt' width='100'/>
                <ColumnDirective field='MA_NV_GIAO' headerTextAlign='Center' headerText='Mã NV giao' width='100'/>
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar]}/>
        </GridComponent>
{/* <script>
var element = document.getElementById('js-licensing');
console.log(element)

        element.remove();
</script> */}
        </div>
    );
}

export default CartManagement;