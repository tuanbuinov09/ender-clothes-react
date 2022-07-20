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

const modifyKeyword = (keyWord)=>{
    let result;
    // result = keyWord.trim();
    result=keyWord;
    result = result.replace(/  +/g, ' ');
    return result;
}
export {intToVNDCurrencyFormat, modifyKeyword}