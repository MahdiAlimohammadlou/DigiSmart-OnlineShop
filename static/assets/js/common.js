

$(window).on('load', async function() {
    try {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            const token = localStorage.getItem("access");
            const userInfo = await getUserProfile(token);
            await getCartFromRedis(userInfo.phone_number);
        }
        updateCartFront();
    } catch (error) {
        console.error('Error occurred:', error);
    }

    if (typeof checkCartAndRedirect === 'function') {
        checkCartAndRedirect();
    }

});


//Start account section

checkAuthentication().then(isAuthenticated => {
    let accountContainer = $("#account-container");
    if (isAuthenticated) {
        const accountLink = $('<span></span>', {
            'class': 'title-account',
            'text': 'حساب کاربری'
        });
        const accountSection = $('<div></div>', {
            'class': 'dropdown-menu',
            'html': `
                    <ul class="account-uls mb-0">
                    <li class="account-item">
                        <a href="/account/profile/" class="account-link">پنل کاربری</a>
                    </li>
                    <li class="account-item">
                        <a href="/account/profile-order/" class="account-link">سفارشات من</a>
                    </li>
                    <li class="account-item">
                        <a href="#" class="account-link">آدرس ها</a>
                    </li>
                    <li class="account-item">
                        <a onclick="logout()" class="account-link">خروج</a>
                    </li>
                    </ul>`
        });
        accountContainer.append(accountLink);
        accountContainer.append(accountSection);
    } else {
        const registerLink = $('<a></a>', {
            'html': '<span class="title-account">ثبت نام</span>'
        });
        registerLink.attr('href', '/account/register/');

        const loginLink = $('<a></a>', {
            'html': '<span class="title-account">ورود</span>'
        });
        loginLink.click(function(event) {
            event.preventDefault();
            redirectToLogin();
        });

        accountContainer.append(registerLink);
        accountContainer.append(loginLink);


    }
})

//End account section

//Start load categories
let catesUl = document.getElementById("cat-menu");
if (catesUl) {
    fetch('/api/categories')
    .then(response => response.json())
    .then(data => {
        data.forEach(category => {
            let catLi = document.createElement("li");
            if (category.is_parent == true) {
                catLi.innerHTML = `
                <a href="#" class="collapsed" type="button" data-toggle="collapse" data-target="#collapse${category.id}" aria-expanded="false" aria-controls="collapse${category.id}">
                <i class="mdi mdi-chevron-down"></i>${category.title}</a>
                <div id="collapse${category.id}" class="collapse" aria-labelledby="heading${category.id}" data-parent="#accordionExample" style="">
                     <ul data-parentCatId = "${category.id}"></ul>
                </div>`;
                catesUl.appendChild(catLi);
            } else if (category.is_sub == true) {
                parentUl =  document.querySelector(`[data-parentCatId="${category.parent}"]`);
                catLi.innerHTML = `<a href="/products/?category=${encodeURIComponent(category.title)}" class="category-level-2">${category.title}</a>`;
                parentUl.appendChild(catLi);
            } else {
                catLi.innerHTML = `<a href="/products/?category=${encodeURIComponent(category.title)}">${category.title}</a>`;
                catesUl.appendChild(catLi);
            }
        });
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات:', error);
    });
}
//End load categories


//Start Load cart
function updateCartFront() {
    $('#cart-products-ul').empty();
    const cart = getCartFromCookie();
    let totalPrice = 0;
    let totalCount = 0;
    if (!isCartEmpty()) {
        cart.forEach(product => {
        productCount = product.quantity;
        let productLi = `<li class="mini-cart-item">
                    <div class="mini-cart-item-content">
                        <a href="" class="mini-cart-item-close remove-item" data-productid=${product.id}>
                            <i class="fa fa-trash"></i>
                        </a>
                        <a href="" class="mini-cart-item-image d-block">
                            <img src="${product.image}">
                        </a>
                        <span class="product-name-card">${product.title}</span>
                        <div class="variation">
                            <span class="variation-n">تعداد : </span>
                            <p class="mb-0">${productCount}</p>
                        </div>
                        <div class="quantity"> 
                            <span class="quantity-Price-amount"> ${product.strPrice}
                                <span>تومان</span>
                            </span> 
                        </div> 
                    </div> 
                </li>`;
        totalPrice += product.totalPrice;
        totalCount += productCount;
        $('#cart-products-ul').append(productLi);
        });
    } else {
        let cartEmptyMessage = `<li class="mini-cart-item">
                    <div class="mini-cart-item-content">
                        سبد خرید شما خالی است.
                    </div> 
                </li>`;
        $('#cart-products-ul').append(cartEmptyMessage);
        totalCount = 0;
        totalPrice = 0;
    }

    let strTotalCart = totalPrice.toLocaleString('fa', { maximumFractionDigits: 0 })

    $(".total").html(`
        ${strTotalCart} <span>تومان</span>
    `);

    $("#cart-products-count").text(totalCount);

    //Remove cart button
    $(".remove-item").click(function(event) {
        event.preventDefault();
        let productId = $(this).data("productid");
        removeFromCart(productId);
}); 
}
//End load cart

//Redirect to cart
$(".redirect-to-cart").click(function(event) {
    event.preventDefault();
    if (isCartEmpty()) {
        window.location = "/order/cart-empty";
    } else {
        window.location = "/order/cart";
    }
});