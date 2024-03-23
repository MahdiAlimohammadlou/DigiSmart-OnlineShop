
$(window).on('load' , function() {
    if (!isCartEmpty()) {
        window.location = "/order/cart/";
    }
})