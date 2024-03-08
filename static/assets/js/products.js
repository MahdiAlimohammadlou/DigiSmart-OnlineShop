
//Getting primary data
document.addEventListener('DOMContentLoaded', function() {

    function addOrUpdatePageParamToUrl(pathname, pageValue) {
        const urlObj = new URL(window.location.origin + pathname);
        urlObj.searchParams.set('page', pageValue);
        return urlObj.toString();
    }

    //Get url params
    var urlParams = new URLSearchParams(window.location.search);
    var page;
    if (urlParams.has("page")) {
        page = urlParams.get("page");
    }
    var apiUrl;
    var url;
    if (urlParams.has('title')) {
        let paramValue = urlParams.get('title');
        let encodedParamValue = encodeURIComponent(paramValue);
        let url = `/api/products/?title=${encodedParamValue}`;
        apiUrl = (page) ? addOrUpdatePageParamToUrl(url, page) : url;
    } else if (urlParams.has('category')) {
        let paramValue = urlParams.get('category');
        let encodedParamValue = encodeURIComponent(paramValue);
        let url = `/api/products/?category=${encodedParamValue}`;
        apiUrl = (page) ? addOrUpdatePageParamToUrl(url, page) : url;
    } else if (urlParams.has('brand')) {
        let paramValue = urlParams.get('brand');
        let encodedParamValue = encodeURIComponent(paramValue);
        let url = `/api/products/?brand=${encodedParamValue}`;
        apiUrl = (page) ? addOrUpdatePageParamToUrl(url, page) : url;
    } else {
        let url = `/api/products/`;
        apiUrl = (page) ? addOrUpdatePageParamToUrl(url, page) : url;
        console.log("done");
    }

    //Start load products
    let productsContainer = document.querySelector("#product-container");
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let results = data.results;
            results.forEach(product => {
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

                if (product.discount_percentage != null) {
                    thumbnailA.innerHTML = `
                        <div class="promotion-badge">فروش ویژه</div>
                        <div class="discount-d">
                            <span>${product.discount_percentage}%</span>
                        </div>
                        <img src="${product.images[0].image}">
                    `;
                } else {
                    thumbnailA.innerHTML = `
                        <img src="${product.images[0].image}">
                    `;
                }
            });

            let previous = data.previous
            let next = data.next
            if (previous != null) {
                $("#previous").attr('href', data.previous);
            }
            if (next != null) {
                $("#next").attr('href', data.next);
            }
            let nextUl = $("#next-li");
            
            let count = data.count
            let pageCount = Math.ceil(count / 1);
            for (let index = 1; index < pageCount; index++) {
                console.log(window.location.pathname);
                const pageNumberLi = $('<li></li>', {
                    'class': 'page-item',
                    'html': `
                            <a class="page-link" href="${addOrUpdatePageParamToUrl(window.location.pathname, index)}">${index}</a>
                            `
                });
                nextUl.insertBefore(pageNumberLi);
            }

        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات:', error);
        });
});

