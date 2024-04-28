
updateCartPageFront();

//Start Load cart
function updateCartPageFront() {
    $('#cart-table-body').empty();
    const cart = getCartFromCookie();
    let totalPrice = 0;
    if (!isCartEmpty()) {
        cart.forEach(product => {
        productCount = product.quantity;
        var newTr = `
            <tr>
                <th scope="row" class="product-cart-name">
                    <div class="product-thumbnail-img">
                        <a href="" class="remove-item">
                            <img src="${product.image}">
                        </a>
                        <div class="product-remove" >
                            <a href="" class="remove" data-productid=${product.id}>
                                <i class="mdi mdi-close"></i>
                            </a>
                        </div>
                    </div>
                    <div class="product-title">
                        <a href="/product?product-id=${product.id}">
                            ${product.title}
                        </a>
                    </div>
                </th>
                <td class="product-cart-quantity">
                    <div class="required-number before">
                        <div class="quantity">
                            <input id="${product.id}" type="number" min="1" max="${product.inventory}" step="1" value="${product.quantity}" onchange="updateQuantity(this)">
                        </div>
                    </div>
                </td>
                <td class="product-cart-price">
                    <span class="amount">${product.strPrice}
                        <span>تومان</span>
                    </span>
                </td>
                <td class="product-cart-Total">
                    <span class="amount">${product.totalPrice.toLocaleString('fa', { maximumFractionDigits: 0 })}
                        <span>تومان</span>
                    </span>
                </td>
            </tr>
        `;
        totalPrice += product.totalPrice;
        $('#cart-table-body').append(newTr);
        });
    } else {
        window.location = "/order/cart-empty";
    }

    let strTotalCart = totalPrice.toLocaleString('fa', { maximumFractionDigits: 0 })

    $("#total-cart").html(`
        ${strTotalCart} تومان
    `);

    //Remove cart button
    $(".remove").click(function(event) {
        event.preventDefault();
        let productId = $(this).data("productid");
        removeFromCart(productId);
}); 

}
//End load cart

function updateQuantity(quantityInput) {
    let quantity = parseFloat($(quantityInput).val());
    let selectedProduct = selectProductById(parseInt(quantityInput.id));
    selectedProduct.quantity = quantity;
    selectedProduct.totalPrice = selectedProduct.numPrice * quantity;
    saveCartInfo([selectedProduct,]);
    updateBackendCart();
    updateCartPageFront();
    updateCartFront();
}