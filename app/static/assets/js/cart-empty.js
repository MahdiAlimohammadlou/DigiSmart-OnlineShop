
async function checkCartAndRedirect() {
    if (!isCartEmpty()) {
        window.location = "/order/cart";
    }
}

$("#loginLink").click(function(event) {
    event.preventDefault();
    redirectToLogin();
    });
