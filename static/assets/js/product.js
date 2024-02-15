//Getting primary data
document.addEventListener('DOMContentLoaded', async function() {
    //Get url params
    var urlParams = new URLSearchParams(window.location.search);
    let apiUrl;
    if (urlParams.has('product-id')) {
        let paramValue = urlParams.get('product-id');
        let encodedParamValue = encodeURIComponent(paramValue);
        apiUrl = `/api/products/${encodedParamValue}`;
    }

    //Start load products
    let productsContainer = document.querySelector("#product-container");
    await fetch(apiUrl)
        .then(response => response.json())
        .then(product => {
            document.querySelector("#product-title").textContent = product.title;
            document.querySelector("#product-price").textContent = parseFloat(product.price).toLocaleString('fa', { maximumFractionDigits: 0 });
            document.getElementById("img-product-zoom").src = product.images[0].image;
            document.getElementById("img-product-zoom").dataset.zoomImage = product.images[0].image;
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات:', error);
        });
        
});