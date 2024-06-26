
//Getting primary data
document.addEventListener('DOMContentLoaded', function() {

    //Load products

    //Start get url params
    var apiUrl;
    var urlParams = new URLSearchParams(window.location.search);
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
    //End get url params

    //Utils functions
    function goToPage(url, newPage) {
        const baseUrl = window.location.origin;
        const urlObj = new URL(url, baseUrl);
        urlObj.searchParams.set('page', newPage);
        loadData(urlObj.pathname + urlObj.search);
    }
    
    let previousPage;
    //Initial data loading
    loadData(apiUrl);

    //Start Load product's data with fetch
    function loadData(apiUrl) {
        var productsContainer = $("#products-container");
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                
                let elementsToRemove = $("." + "brand-container");
                if (elementsToRemove.length > 0) {
                    elementsToRemove.remove();
                }
            
                let results = data.results;
                results.forEach(product => {

                    //manage price and discount
                    const originalPrice = product.price;
                    let discountedPrice, discountType;
                    let discount, discountUsageStatus;
                    if (product.discount) {
                        if (product.discount.is_usable) {
                            discountUsageStatus = true;
                            discountType = product.discount.discount_type;
                            switch (discountType) {
                                case "percentage":
                                    discount = product.discount.percentage + "%";
                                    discountedPrice = calculateFinalPrice(originalPrice, product.discount.percentage).stringResult
                                    break;
                                
                                case "amount":
                                    discount = product.discount.amount.toLocaleString('fa', { maximumFractionDigits: 0 }) + "-"
                                    discountedPrice = calculateFinalPriceWithAmountDiscount(originalPrice, product.discount.amount).stringResult
                                    break;
        
                                default:
                                    break;
                            }
                        }
                    }
                    //manage price and discount


                    let productContainer = $("<div>").addClass("col-lg-3 col-md-3 col-xs-12 order-1 d-block mb-3 brand-container");
                
                    let productBox = $("<section>").addClass("product-box product product-type-simple");
                    let thumb = $("<div>").addClass("thumb");
                    let thumbnailA = $("<a>").attr("href", `/product?product-id=${product.id}`).addClass("d-block").attr("id", `a-${product.id}`);
                    let title = $("<div>").addClass("title").append($("<a>").attr("href", `/product?product-id=${product.id}`).text(product.title));
                    let priceDiv;
                    if (discountUsageStatus) {
                        priceDiv = $("<div>").addClass("price").html(`
                            <span style="color: red; text-decoration: line-through;">${originalPrice}</span><br>
                            <span class="amount">${discountedPrice}<span> تومان</span></span>
                            `);

                        thumbnailA.html(`
                            <div class="promotion-badge">فروش ویژه</div>
                            <div class="discount-d">
                                <span>${discount}</span>
                            </div>
                            <img src="${product.images[0].image}">
                            `);
                    } else {
                        priceDiv = $("<div>").addClass("price").html(`
                            <span class="amount">${originalPrice}<span>تومان</span></span>
                            `);

                        thumbnailA.html(`<img src="${product.images[0].image}">`);
                    }
                
                    thumb.append(thumbnailA);
                    productBox.append(thumb, title, priceDiv);
                    productContainer.append(productBox);
                    productsContainer.append(productContainer);
                });
            
                let previous = data.previous;
                let next = data.next;
                
                $('#previous').on('click', function(event){
                    event.preventDefault();
                });
                if (previous != null) {
                    $('#previous').on('click', function(event){
                        event.preventDefault();
                        let previousUrl = new URL(previous);
                        loadData(previousUrl.pathname + previousUrl.search);
                    });
                    }
                    

                $('#next').on('click', function(event){
                    event.preventDefault();
                });
                if (next != null) {
                    $('#next').on('click', function(event){
                        event.preventDefault();
                        let nextUrl = new URL(next);
                        console.log(nextUrl.pathname + nextUrl.search);
                        loadData(nextUrl.pathname + nextUrl.search);
                    });
                    }
            
                let count = data.count;
                let pageCount = Math.ceil(count / 10);

                var apiUrlParams = new URLSearchParams(new URL(window.location.origin + apiUrl).search); 
                let currentPage = 1;       
                if (apiUrlParams.has("page")) {
                    currentPage = parseInt(apiUrlParams.get("page"));
                }
                for (let index = 1; index <= pageCount; index++) {
                    let pageNumberLi = $(`#page-item-${index}`);
                    if (pageNumberLi.length === 0) {
                        pageNumberLi = $('<li></li>', {
                            'id': `page-item-${index}`,
                            'class': 'page-item',
                            'html': `<a class="page-link" href="#" data-page-number="${index}">${index}</a>`
                        });
                        
                        pageNumberLi.find('a').on('click', function(event) {
                            event.preventDefault();
                            goToPage(apiUrl, index); 
                        });
                
                        $('#next-li').before(pageNumberLi);
                    }

                    if (index == currentPage) {
                        pageNumberLi.children('a').addClass("active");
                    }
                    if (index == previousPage && previousPage != currentPage) {
                        pageNumberLi.children('a').removeClass('active');
                    }
                }
                previousPage = currentPage;
                
            })
            .catch(error => {
                console.error('خطا در دریافت اطلاعات:', error);
            });   
    }
    //End Load product's data with fetch

    

    
});

