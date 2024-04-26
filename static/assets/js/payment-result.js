

let urlParams = new URLSearchParams(window.location.search);
let refId;
if (urlParams.has("ref_id")) {
    clearCartInCookie();
    refId = urlParams.get("ref_id")
}
let orderId = urlParams.get("order_id")

fetchData(`/order/api/orders/${orderId}/`, "GET").then( orderData => {
    fillOrderDetails(orderData);
    const orderItems = orderData.order_items
    orderItems.forEach(item => {
        addTableRowToTBody(item);
    });
});

function fillOrderDetails(order) {
    $("#order-id span").text(order.id);

    if (typeof refId !== 'undefined' && refId !== null) {
        $("#ref-id span").text(refId);
    } else {
        $("#ref-id").hide();
    }

    $("#date span").text(order.formatted_order_date);
    $("#total span").html(`${order.total_price}
        <span>تومان</span>
        `);


    $(".cart-subtotal .amount").html(`${order.total_price}
    <span>تومان</span>
    `);
    if (order.discount_amount != null) {
        $(".cart-discount .amount").text(order.discount_amount);
    } else {
        $(".cart-discount").hide();
    }
    $('.profile-address-info').html(`
        <li>
            <div class="profile-address-info-item location">
                <i class="mdi mdi-map-outline"></i>
                ${order.detail_address}
            </div>
        </li>
        <li>
            <div class="profile-address-info-item location">
                <i class="mdi mdi-phone"></i>
                ${order.phone_number}
            </div>
        </li>
        <li>
            <div class="profile-address-info-item location">
                <i class="mdi mdi-account"></i>
                ${order.recipient}
            </div>
        </li>
    `);
}


function addTableRowToTBody(item) {
    var newRow = $("<tr>").addClass("checkout-cart-item");
    var productNameCell = $("<td>").addClass("product-name").text(item.product_title);
    var productPriceCell = $("<td>").addClass("product-price text-info");
    var amountSpan = $("<span>").addClass("amount").text(item.total_price);
    var currencySpan = $("<span>").text(" تومان");

    productPriceCell.append(amountSpan, currencySpan);

    newRow.append(productNameCell, productPriceCell);

    $("tbody").append(newRow);
}