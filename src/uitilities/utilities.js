import moment from 'moment';
import { L10n } from '@syncfusion/ej2-base';
const intToVNDCurrencyFormat = (number, withSymbol)=>{
    let result;
    if(typeof number === 'string'){
        number.trim();
        number = parseInt(number);
    }
    result = number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + "";
    
    if(withSymbol){
        result = result.substring(0, result.length - 4) + " ₫";
    }else{
        result = result.substring(0, result.length - 4);
    }

    return result;
}

const modifyKeyword = (keyword)=>{
    let result;
    result = keyword;
    result = result.trim();
    result = result.replace(/  +/g, ' ');
    // result = removeAccent(result);
    // console.log("res:",result)
    return result;
}
const removeSyncfusionLicenseMessage=()=>{
    var script = document.createElement("script");
    script.innerHTML=
    `
        var element = document.getElementById('js-licensing');
        if(element){
            element.remove();
        }
    `
    script.async = true;
    document.body.appendChild(script);

}

const newInvoiceIdByDate=()=>{
    const date = moment().format('DDMMyyyyhhmmss');
    const res = "HD"+date;
return res;
}

const newIdByDate=(prefix)=>{
    const date = moment().format('DDMMyyyyhhmmss');
    const res = prefix + date;
return res;
}

// const removeAccent = (str) => {
// 	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
//     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
//     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
//     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
//     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
//     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
//     str = str.replace(/đ/g, "d");
//     str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
//     str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
//     str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
//     str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
//     str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
//     str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
//     str = str.replace(/Đ/g, "D");
//     // Combining Diacritical Marks
//     str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
//     str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
// 	return str;
// }
const loadLocaleSyncfusion = ()=>{
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
            datepicker: {
                placeholder: "Nhập ngày",
                today:"Hôm nay"
            },
            'multi-select': {
                'actionFailureTemplate': "Lỗi thực thi",
                'noRecordsTemplate': "Không có dữ liệu"
            }
        }
    });
}
const isValidPhone = phone => /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g.test(phone)
export {isValidPhone, newIdByDate}
export {intToVNDCurrencyFormat, modifyKeyword, removeSyncfusionLicenseMessage, newInvoiceIdByDate, loadLocaleSyncfusion}