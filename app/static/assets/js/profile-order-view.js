
let urlParams = new URLSearchParams(window.location.search);
let orderId = urlParams.get("order_id")

fetchData(`/api/order/orders/${orderId}/`, "GET").then( orderData => {
    fillOrderDetails(orderData);
    const orderItems = orderData.order_items
    orderItems.forEach(item => {
        addTableRowToTBody(item);
    });
});

function fillOrderDetails(order) {

    $("#order-total-amount").html(`${order.total_price}
        <span>تومان</span>
        `);

    if (order.discount_amount != null) {
        $("#order-discount-amount span").text(order.discount_amount);
    } else {
        $("#order-discount-amount").hide();
    }

    $("#item-count").text(order.order_items.length);

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