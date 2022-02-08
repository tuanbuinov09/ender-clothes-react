const searchOpen = document.getElementsByClassName("search-open")[0];
const searchWrapper = document.getElementsByClassName("side-bar-container")[0];
const searchBox = document.getElementsByClassName("search-box")[0];
const main = document.getElementsByClassName("main")[0];

const bagOpen = document.getElementsByClassName("shopping-bag-open")[0];
const bagBox = document.getElementsByClassName("bag-box")[0];
const bagClose = document.getElementsByClassName("bag-close")[0];

searchOpen.addEventListener("click", function () {
    searchWrapper.style.backgroundColor = "#33333380";
    searchWrapper.style.width = "100%";
    main.style.marginLeft = "-400px";
    searchBox.style.right = "0";
});
const searchClose = document.getElementsByClassName("search-close")[0];
searchClose.addEventListener("click", function () {
    if (searchWrapper.style.backgroundColor != null) {
        main.style.marginLeft = "0";
        searchBox.style.right = "-100%";
        searchWrapper.style.backgroundColor = null;
    }
    const s = setTimeout(function () { searchWrapper.style.width = "0"; }, 300);
});

bagOpen.addEventListener("click", function () {
    searchWrapper.style.backgroundColor = "#33333380";
    searchWrapper.style.width = "100%";
    main.style.marginLeft = "-400px";
    bagBox.style.right = "0";
});
bagClose.addEventListener("click", function () {
    if (searchWrapper.style.backgroundColor != null) {
        main.style.marginLeft = "0";
        bagBox.style.right = "-100%";
        searchWrapper.style.backgroundColor = null;
    }
    const s = setTimeout(function () { searchWrapper.style.width = "0"; }, 300);
});
const navOpen = document.getElementsByClassName("submenu-container")[0];
navOpen.addEventListener("click", function () {
    console.log(1)
    if ($('.submenu').hasClass("translateX-0")) {
        $('.nav__item i').toggleClass("rotate--90deg");
        $('.header__nav-list .nav__item:not(:first-child)').toggleClass("translateY-calc-52x5px");
        $('.submenu').toggleClass("translateX-0");
        return;
    }
    $('.nav__item i').toggleClass("rotate--90deg");
    $('.header__nav-list .nav__item:not(:first-child)').toggleClass("translateY-calc-52x5px");
    $('.submenu').toggleClass("translateX-0");
});
var mobileMenuisHidden = true;
$('.mobile-menu-button').click(function () {
    $(this).toggleClass("active");
    if (mobileMenuisHidden) {
        $(".header__nav-list").css({
            left: 0
        });
        // $(".main").css({
        //     marginLeft: "100%"
        // });
        mobileMenuisHidden = false;
        searchWrapper.style.backgroundColor = "#33333380";
        searchWrapper.style.width = "100%";
        return;
    } else {
        $(".header__nav-list").css({
            left: "-100%"
        });
        // $(".main").css({
        //     marginLeft: "0px"
        // });
        mobileMenuisHidden = true;
        searchWrapper.style.backgroundColor = null;
        const s = setTimeout(function () { searchWrapper.style.width = "0"; }, 300);
    }
});
function closeMenu() {
    $(".header__nav-list").css({
        left: "-100%"
    });
    // $(".main").css({
    //     marginLeft: "0px"
    // });

    mobileMenuisHidden = true;
    searchWrapper.style.backgroundColor = null;
    const s = setTimeout(function () { searchWrapper.style.width = "0"; }, 300);
    $(".mobile-menu-button").toggleClass("active");
}
var headerLiTags = document.querySelectorAll(".header__nav-list li");
// console.log(headerLiTags)
for (var i = 0; i < headerLiTags.length; i++) {
    const item = headerLiTags[i];
    item.addEventListener("click", function () {
        console.log(item.classList.contains('submenu-container'))
        if (!item.classList.contains("submenu-container")) {
            closeMenu();
        }
    });
}

$(window).resize(function () {
    searchWrapper.style.backgroundColor = null;
    searchWrapper.style.width = "0";
});

var items = document.getElementsByClassName("item");

for (var i = 0; i < items.length - 2; i++) {
    var addToCart = document.createElement("div");
    addToCart.classList.add("add-to-cart-button");
    addToCart.innerHTML = `Add to cart`;
    var item = items[i];
    item.append(addToCart);
}


function removeFromCart(e){
    e.preventDefault();
    var addButton = e.target;
    var parent = addButton.parentNode.parentNode;
    parent.remove();
    updateBagCount();
}


function fncaddToCart(e) {
    e.preventDefault();
    var addButton = e.target;
    var parent = addButton.parentNode;
    console.log(parent);
    var src = parent.querySelector(".item__img-container img").src;
    var productName = parent.querySelector(".item__label").textContent;
    var productNames = document.querySelector(".cart-list").querySelectorAll(".item__label");
    console.log(productNames);
    for(var i=0; i<productNames.length;i++){
        if(productName === productNames[i].textContent){
            var item = productNames[i].parentNode;
            item.querySelector(".quantity-field").value = parseInt(item.querySelector(".quantity-field").value) +1;
            updateBagCount();
            return;
        }
    }
    var price = parent.querySelector(".item__price").textContent;
    var div = document.createElement("div");
    div.classList.add("cart-list__item");
    div.innerHTML = `<a href="#" class="item__img-container">
    <img src="${src}" alt="item">
    </a>
    <div class="item__detail">
        <a href="#" class="item__label">${productName}</a>
        <p class="item__price">${price}</p>
        <div class="input-group">
            <input type="button" value="-" class="button-minus" data-field="quantity">
            <input type="number" step="1" max="" min="1" value="1" name="quantity" class="quantity-field">
            <input type="button" value="+" class="button-plus" data-field="quantity">
        </div>
        <a href="#" class="btn--danger">Remove</a>
    </div>`;
    div.querySelector(".button-plus").addEventListener("click", function (e) {
        incrementValue(e);
    })
    div.querySelector(".button-minus").addEventListener("click", function (e) {
        decrementValue(e);
    })
    div.querySelector(".btn--danger").addEventListener("click", function (e) {
        removeFromCart(e);
    })
    div.querySelector(".quantity-field").addEventListener("focusout", function (e) {
        updateBagCount();
    })
    
    document.querySelector(".cart-list").append(div);
    // addPlusMinusEvent();

    updateBagCount();
}


var addToCartButtons = document.querySelectorAll(".add-to-cart-button");
for (var i = 0; i < addToCartButtons.length; i++) {
    var addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", function (e) {
        fncaddToCart(e);
    });
}


function updateBagCount() {
    var cartList = document.querySelector(".cart-list");
    var quantityFields = cartList.querySelectorAll(".quantity-field");
    var totalItems = 0;
    for (var i = 0; i < quantityFields.length; i++) {
        totalItems = totalItems + parseInt(quantityFields[i].value);
    }
    var bagCount = document.querySelector(".bag__count");
    bagCount.textContent = totalItems;
}
updateBagCount();

function incrementValue(e) {
    e.preventDefault();
    var plusButton = e.target;
    var quantity = plusButton.parentNode.querySelector(".quantity-field");
    console.log(plusButton.parentNode)
    var currentVal = parseInt(quantity.value);
    if (!isNaN(currentVal)) {
        quantity.value = currentVal + 1;
    } else {
        quantity.value = 1;
    }
    updateBagCount();
}

function decrementValue(e) {
    e.preventDefault();
    var plusButton = e.target;
    var quantity = plusButton.parentNode.querySelector(".quantity-field");
    var currentVal = parseInt(quantity.value);
    if (!isNaN(currentVal) && currentVal > 1) {
        quantity.value = currentVal - 1;
    } else {
        quantity.value = 1;
    }
    updateBagCount();
}
// function addPlusMinusEvent() {
//     var plusButtons = document.querySelectorAll(".input-group .button-plus");
//     for (var i = 0; i < plusButtons.length; i++) {
//         plusButtons[i].addEventListener("click", function (e) {
//             incrementValue(e);
//         })
//     }
//     var minusButtons = document.querySelectorAll(".input-group .button-minus");
//     for (var i = 0; i < minusButtons.length; i++) {
//         minusButtons[i].addEventListener("click", function (e) {
//             decrementValue(e);
//         })
//     }
// }
// addPlusMinusEvent();


// function incrementValue(e) {
//     e.preventDefault();
//     var fieldName = $(e.target).data('field');
//     var parent = $(e.target).closest('div');
//     var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

//     if (!isNaN(currentVal)) {
//         parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
//     } else {
//         parent.find('input[name=' + fieldName + ']').val(0);
//     }
// }

// function decrementValue(e) {
//     e.preventDefault();
//     var fieldName = $(e.target).data('field');
//     var parent = $(e.target).closest('div');
//     var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

//     if (!isNaN(currentVal) && currentVal > 0) {
//         parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
//     } else {
//         parent.find('input[name=' + fieldName + ']').val(0);
//     }
// }

// $('.input-group').on('click', '.button-plus', function (e) {
//     incrementValue(e);
// });

// $('.input-group').on('click', '.button-minus', function (e) {
//     decrementValue(e);
// });






// const a = document.querySelectorAll(".main a");
// // console.log(a);
// for(var i=12; i<a.length; i++){
//     const aNoImg = a[i];
//     if(aNoImg.classList.length<2&&aNoImg.innerText!= ""){
//         aNoImg.innerText = "Anh Yêu Em";
//     }
// }
// const h1 = document.querySelectorAll(".main h1, h2, h3");
// for(var i=0; i<h1.length; i++){
//     let item = h1[i];
//     item.innerText = "ANH YÊU EM"
// }