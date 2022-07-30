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

export {intToVNDCurrencyFormat, modifyKeyword, removeSyncfusionLicenseMessage}