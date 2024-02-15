
//Getting primary data
document.addEventListener('DOMContentLoaded', function() {
    //Get url params
    var urlParams = new URLSearchParams(window.location.search);
    let apiUrl;
    if (urlParams.has('title')) {
        let paramValue = urlParams.get('title');
        let encodedParamValue = encodeURIComponent(paramValue);
        apiUrl = `/api/products/?title=${encodedParamValue}`;
    } else if (urlParams.has('category')) {
        let paramValue = urlParams.get('category');
        let encodedParamValue = encodeURIComponent(paramValue);
        apiUrl = `/api/products/?category=${encodedParamValue}`;
    } else if (urlParams.has('brand')) {
        let paramValue = urlParams.get('brand');
        let encodedParamValue = encodeURIComponent(paramValue);
        apiUrl = `/api/products/?brand=${encodedParamValue}`;
    } else {
        apiUrl = `/api/products/`;
    }

    //Start load products
    let productsContainer = document.querySelector("#product-container");
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                let productContainer = document.createElement("div");
                productContainer.className = "col-lg-3";
                productContainer.classList.add("col-md-3", "col-xs-12", "order-1", "d-block", "mb-3");
                productContainer.innerHTML = `
                <section class="product-box product product-type-simple">
                    <div class="thumb">
                        <a id="a-${product.id}" href="/product/?product-id=${product.id}" class="d-block">
                        </a>
                    </div>
                    <div class="title">
                    <a href="/product/?product-id=${product.id}">${product.title}</a>
                    </div>
                    <div class="price">
                        <span class="amount">${parseFloat(product.price).toLocaleString('fa', { maximumFractionDigits: 0 })}
                            <span>تومان</span>
                        </span>
                    </div>
                </section>
                `;
                productsContainer.appendChild(productContainer);
                let thumbnailA = document.querySelector(`#a-${product.id}`);
                console.log("Hello",thumbnailA);
                if (product.discount_percentage != null) {
                    thumbnailA.innerHTML = `
                        <div class="promotion-badge">فروش ویژه</div>
                        
                        <div class="discount-d">
                            <span>${product.discount_percentage}%</span>
                        </div>
                        <img src="${product.images[0].image}">
                    `;
                } else {
                    console.log(product.images[0].image);
                    thumbnailA.innerHTML = `
                        <img src="${product.images[0].image}">
                    `;
                }
                console.log(productContainer);
            });
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات:', error);
        });


});

