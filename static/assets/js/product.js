//Getting primary data

// product-img-----------------------------
function product_image_gallery() {
    $("#gallery-slider").owlCarousel({
    rtl: true,
    margin: 10,
    nav: true,
    navText: ['<i class="fa fa-angle-right"></i>', '<i class="fa fa-angle-left"></i>'],
    dots: false,
    responsiveClass: true,
    responsive: {
        0: {
            items: 4,
            slideBy: 1
        }
    }
    });

    $('.back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800, 'easeInExpo');
    });

    if ($("#img-product-zoom").length) {
        $("#img-product-zoom").ezPlus({
            zoomType: "inner",
            containLensZoom: true,
            gallery: 'gallery_01f',
            cursor: "crosshair",
            galleryActiveClass: "active",
            responsive: true,
            imageCrossfade: true,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500
        });
    }


    var $customEvents = $('#custom-events');
    $customEvents.lightGallery();
     
    var colours = ['#21171A', '#81575E', '#9C5043', '#8F655D'];
    $customEvents.on('onBeforeSlide.lg', function(event, prevIndex, index){
        $('.lg-outer').css('background-color', colours[index])
    });
}
// product-img-----------------------------


//    quantity-selector--------------------
function setupQuantitySpinner() {
    jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');

    jQuery('.quantity').each(function() {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min'),
            max = input.attr('max');

        btnUp.click(function() {
            var oldValue = parseFloat(input.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

        btnDown.click(function() {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });
    });
}
//    quantity-selector--------------------


//Variables
var productId, productTitle,
     productPrice, productImages,
     finalPrice;


document.addEventListener('DOMContentLoaded', async function() {
    //Get url params
    var urlParams = new URLSearchParams(window.location.search);
    let apiUrl;
    if (urlParams.has('product-id')) {
        let paramValue = urlParams.get('product-id');
        let encodedParamValue = encodeURIComponent(paramValue);
        apiUrl = `/api/products/${encodedParamValue}`;
    }


    //Start load product
    await fetch(apiUrl)
        .then(response => response.json())
        .then(product => {
            $("#quantity").attr("max", product.inventory);
            setupQuantitySpinner();
            productId = product.id; productTitle = product.title;
            productPrice = product.price; productImages = product.images;
            let discountType = product.discount_type;
            if (discountType == "percentage") {
                finalPrice = calculateFinalPrice(productPrice, product.discount_percentage);
            } else {finalPrice = calculateFinalPriceWithAmountDiscount(productPrice, product.discount_amount)}
            document.querySelector("#product-title").textContent = productTitle;
            $("#product-price").html(
                `${finalPrice.stringResult}
                <span>تومان</span>`
                );
            document.getElementById("img-product-zoom").src = productImages[0].image;
            document.getElementById("img-product-zoom").dataset.zoomImage = productImages[0].image;
            let imageGallery = $("#gallery-slider");
            if (productImages.length > 1) {
                for (let index = 0; index < productImages.length; index++) {
                let image = productImages[index].image;
                let imageLi = $('<li></li>', {
                    'class': 'item',
                    'html': `
                    <a href="#" class="elevatezoom-gallery active" data-update=""
                    data-image="${image}"
                    data-zoom-image="${image}">
                    <img src="${image}" width="100"/></a>
                            `
                });
                imageGallery.append(imageLi);
                }
            }
            
            product_image_gallery();
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات:', error);
        });   
});

//Add cart button
$("#addCart").on("click", function (event) {
    event.preventDefault();
    let quantity = parseInt($("#quantity").val());
    let product = {
        id : productId,
        title : productTitle,
        image : productImages[0].image,
        numPrice : finalPrice.numResult,
        strPrice : finalPrice.stringResult,
        quantity : quantity,
        totalPrice : finalPrice.numResult * quantity  
    };
    saveCartInfo([product,]);
    updateCartFront();
});