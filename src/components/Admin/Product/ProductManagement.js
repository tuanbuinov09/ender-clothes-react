import React, { useEffect, useRef, useState } from 'react';
import {L10n} from '@syncfusion/ej2-base'
import { ColumnDirective, ColumnsDirective, GridComponent,Inject, Page, Sort, Filter, Group, Edit, Toolbar } from '@syncfusion/ej2-react-grids';
import { data } from './datasource';
import axios from 'axios';
import '../ej2-grid.css'
function ProductManagement(props) {
    const [products, setProducts] = useState([]);
    const grid = useRef();
    useEffect(()=>{
        try{
            axios.get(`http://localhost:22081/api/SanPham/`).then(res => {
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
                   
    },[])
    var script = document.createElement("script");

    // script.src = "https://use.typekit.net/foobar.js";
    script.innerHTML=
    `
        var element = document.getElementById('js-licensing');
        element.remove();
    `
    script.async = true;

    document.body.appendChild(script);
    let editOptions, toolbarOptions;
    
    console.log(grid.current);
    function actionBegin(args){
        if (grid.current && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const cols = grid.current.columns;
            for (const col of cols) {
                if (col.field === "MA_SP") {
                    col.visible = true;
                }
                else if (col.field === "LUOT_XEM") {
                    col.visible = false;
                }
            }
        }
    }
    function actionComplete(args) {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const dialog = args.dialog;
            dialog.showCloseIcon = false;
            dialog.height = 500;
            dialog.width = 600;
            // change the header of the dialog
            dialog.header = args.requestType === 'beginEdit' ? 'Chỉnh sửa sản phẩm ' + args.rowData['TEN_SP'] : 'Sản phẩm mới';
        }
// trả lại cột luot xem
        if (grid.current && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const cols = grid.current.columns;
            for (const col of cols) {
          
                if (col.field === "LUOT_XEM") {
                    col.visible = true;
            }
        }
    }
    }
    actionBegin = actionBegin.bind(this);
    actionComplete = actionComplete.bind(this);
    editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    L10n.load({
        'vi-VN': {
            grid: {
                'SaveButton': 'Submit',
                'CancelButton': 'Discard'
            }
        }
    });
    return (
        <div>
            
        <GridComponent toolbar={toolbarOptions} ref={grid}
         actionComplete={actionComplete} 
         actionBegin={actionBegin}
         editSettings={editOptions}
         dataSource={products} allowPaging={true} /*allowGrouping={true}*/ 
         allowSorting={true} /*allowFiltering={true} */height={300}>
            <ColumnsDirective>
                <ColumnDirective field='MA_SP' headerText='Mã SP' width='100' textAlign="Right" isPrimaryKey={true}/>
                <ColumnDirective field='TEN_SP' headerText='Tên SP' width='100'/>
                <ColumnDirective field='MA_TLNavigation.TEN_TL' headerText='Thể loại' width='100' editType='dropdownedit' />
                {/* <ColumnDirective field='MA_TL' headerText='MA_TL' width='100' textAlign="Right"/> */}
                {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                <ColumnDirective field='LUOT_XEM' headerText='Lượt xem' width='100'/>
                <ColumnDirective field='NGAY_TAO' headerText='Ngày tạo' width='100' type='date' format={'dd/MM/yyyy'} editType='datepickeredit' />
                <ColumnDirective field='HINH_ANH' headerText='Hình ảnh' width='100'/>
                
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

export default ProductManagement;