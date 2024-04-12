
if (isCartEmpty()) {
    window.location.href = "/order/cart-empty/"
}

checkAuthentication().then(isAuthenticated => {
    if (!isAuthenticated) {
        redirectToLogin();
    } else {
        fetchData("/account/check-user-info/", "GET").then (result => {
            if (!result.is_complete) {
                window.location.href = "/account/profile-info/"
            }
        })
    }
});

$("#discount-row").hide();

// Update address list front
async function AddressListFront() {
    addressList = await fetchData('/account/api/address', 'GET');
    if (!addressList) {
        window.location.href = "/account/profile-address-edit/"
    }
    addressList.forEach(address => {
        createAddressContainer(address);
            let firstRadioButton = $('input[name="selectAddress"]:first');
            selectedAddress = addressList.find(address => address.id == firstRadioButton.val());
            firstRadioButton.prop('checked', true);
    });
}


let addressList;
let selectedAddress;
let isUsingAnotherAddress = false;
let isDiscountApplied = false;
let discountAmount;
let discountCode;
const cart = getCartFromCookie();
AddressListFront();

$(window).on('load', async function() {
    let allStates = await fetchCitiesData("https://iran-locations-api.ir/api/v1/fa/states");
    insertStates(allStates);
});

//utils functions
function addCheckoutCartItem(item) {
    let newItem = $('<tr class="checkout-cart-item">' +
        `<td class="product-name">${item.title}</td>` +
        '<td class="product-price text-info">' +
        `<span class="amount">${item.totalPrice.toLocaleString('fa', { maximumFractionDigits: 0 })}` +
        '<span>تومان</span>' +
        '</span>' +
        '</td>' +
        '</tr>');

    $('#productTBody').append(newItem);
}


function updateorderTotalPrice(orderTotalPrice) {
    $(".origin-total").html(`${orderTotalPrice.toLocaleString('fa', { maximumFractionDigits: 0 })}
    <span>تومان</span>`);    
}


function createAddressContainer(addressData) {
    let profileStats = $('<div>').addClass('profile-stats');
    profileStats.click(function() {
        let selectedRadio = $(this).find('input[type="radio"]').prop('checked', true);
        selectedAddress = addressList.find(address => address.id == selectedRadio.val());
        let toggleBtn = $("#another-address-btn");
        let ariaExpanded = toggleBtn.attr('aria-expanded');
        toggleBtn.toggleClass('collapsed');
        if (ariaExpanded === 'true') {
            toggleBtn.attr('aria-expanded', 'false');
        }

    });
    profileStats.hover(
        function() {
            $(this).css('cursor', 'pointer');
        },
        function() {
            $(this).css('cursor', 'auto');
        }
    );
    
    let profileAddress = $('<div>').addClass('profile-address').appendTo(profileStats);
    let profileAddressItem = $('<div>').addClass('profile-address-item').appendTo(profileAddress);
    let profileAddressContent = $('<div>').addClass('profile-address-content').appendTo(profileAddressItem);
    let profileAddressInfo = $('<ul>').addClass('profile-address-info').appendTo(profileAddressContent);
    let li1 = $('<li>').appendTo(profileAddressInfo);

    $('<input>').attr({
        class : 'select-address',
        type: 'radio',
        name: 'selectAddress',
        value: addressData.id,
        style: 'width: 20px; height: 20px;'
    }).appendTo(li1);

    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-map-outline"></i>' + addressData.detail_address).appendTo(li1);
    let li2 = $('<li>').appendTo(profileAddressInfo);
    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-phone"></i>' + addressData.phone_number).appendTo(li2);
    let li4 = $('<li>').appendTo(profileAddressInfo);
    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-account"></i>' + addressData.recipient).appendTo(li4);
    $("#addressContainer").prepend(profileStats);
}

//Update factor
let orderTotalPrice = 0;
cart.forEach(item => {
    addCheckoutCartItem(item);
    orderTotalPrice += item.totalPrice;
});
updateorderTotalPrice(orderTotalPrice);


//Discount
$("#apply-discount-btn").click(function (e) { 
    e.preventDefault();

    discountCode = $.trim($('#discount-input').val());
    let discountError = $("#discount-error");
    if (isDiscountApplied) {
        discountError.text("فقط یک کد تخفیف می توانید اعمال کنید.");
        discountError.show();
    } else {
        if (discountCode == "") {
        discountError.text("کد تخفیف خالی است.");
        discountError.show();
        } else {
            fetchDiscountCode(discountCode).then(data => {
                if (data) {
                    discountError.text("");
                    discountError.hide();
                    let result;
                    if (data.discount_type == "amount") {
                        result = calculateFinalPriceWithAmountDiscount(orderTotalPrice, data.amount);
                    } else {
                        result = calculateFinalPrice(orderTotalPrice, data.percentage);
                    }
                    discountAmount = orderTotalPrice - result.numResult
                    orderTotalPrice = result.numResult;
                    $("#discount-row").show();
                    $("#discount-total").html(`${discountAmount.toLocaleString('fa', { maximumFractionDigits: 0 })}
                        <span>تومان</span>`);
                    isDiscountApplied = true;
                    alert("کد تخفیف اعمال شد.")
                } else {
                    discountError.text("کد وارد شده معتبر نیست.");
                    discountError.show();
                }
            })
        }
    } 
});

//Another Address
$("#another-address-btn").click(function (e) { 
    e.preventDefault();
    isUsingAnotherAddress = !isUsingAnotherAddress;
    if (isUsingAnotherAddress) {
        $('input[type="radio"][name="selectAddress"]').prop('checked', false);
    } else {
        let firstRadioButton = $('input[name="selectAddress"]:first');
            firstRadioButton.prop('checked', true);
    }
});

//Register Order
$("#register-order-btn").click(async function (e) {
    e.preventDefault();
    let orderData;
    if (isUsingAnotherAddress) {
        if (isValidAddress()) {
            const addressData = getFormData()
            orderData = addressData;
        }
    } else {
        orderData = selectedAddress;
    }
    orderData.total_price = orderTotalPrice;
    if (isDiscountApplied) {
        orderData.discount_amount = discountAmount;
    }
    orderData = await fetchData("/order/api/orders/", "POST", orderData)
    let orderItems = [];
    cart.forEach(item => {
        let orderItem = {
            product : item.id,
            quantity : item.quantity,
            total_price : item.totalPrice
        }
        orderItems.push(orderItem)
    });
    paymentData = {
        order_id : orderData.id,
        order_items : JSON.stringify(orderItems),
    }
    if (isDiscountApplied) {
        paymentData.discount_code = parseInt(discountCode);
    }
    paymentResult = await fetchData("/order/send-to-zarinpal/", "POST", paymentData);
    clearCartInCookie();
    window.location.href = paymentResult.zarinUrl;
});