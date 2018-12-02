if (typeof spApi.addToCartListener === 'undefined') {
    spApi.addToCartListener = true;

    var spAddToCartHandler = [];

    spAddToCartHandler.addCartButton = sQuery('.btn-cart').live('click', function () {
        spApi.setProductCategory();

        if (typeof (spApi.setCartTargetingRules) !== 'undefined') {
            spApi.setCartTargetingRules();
        }
    });
}

var sendAddToCartRequest = function (productId) {
    var endPoint = 'https://www.auchan.ru/pokupki/checkout/cart/add/?awacp=1';
    var data = {
        cartManager: true,
        product: productId,
        qty: 1
    };

    sQuery.ajax({
        url: endPoint,
        type: 'POST',
        data: data,
        success: function () {
            openMiniCart();
        },
        error: function () {
            openMiniCart();
        }
    });
};

var openMiniCart = function () {
    if (typeof jQuery === 'function') {
        jQuery('#header_cart_widget_block i').trigger('mouseenter');

        setTimeout(function () {
            jQuery('#header_cart_widget_block i').trigger('mouseleave');
        }, 3000);
    }
};

return {
    addToBasket: function (productId, callback) {
        sendAddToCartRequest(productId);
    }
};