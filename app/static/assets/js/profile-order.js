
$(window).on('load', async function() {
    let orders = await fetchData("/api/order/orders/", "GET");
    orders.forEach(order => {
        addOrder(order);
    });
});

function addOrder(order) {
    var newRow = $('<tr>');

    newRow.append('<td class="order-code">' + order.id + '</td>');
    newRow.append('<td>' + order.formatted_order_date + '</td>');
    newRow.append('<td class="Waiting text-success">' + order.order_status + '</td>');
    newRow.append('<td class="totla"><span class="amount">' + order.total_price + '<span>تومان</span></span></td>');
    newRow.append(`<td class="detail"><a href="/account/profile-order-view?order_id=${order.id}" class="btn btn-secondary d-block">نمایش</a></td>`);

    $('#orders-tbody').append(newRow);
}