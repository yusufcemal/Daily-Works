if (typeof spApi.addToCartListener === 'undefined') {
    var spAddToCartHandler = {};

    spApi.addToCartListener = true;
    spAddToCartHandler.addCartButton = sQuery('').live('click', function () {
        spApi.setProductCategory();
        if (typeof (spApi.setCartTargetingRules) !== 'undefined') {
            spApi.setCartTargetingRules();
        }
    });
}

var sendAjax = function (productId) {
    var endPoint = 'http://www.barcin.com/sepetim';

    sQuery.ajax({
        url: endPoint,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;',
        data: {
            barcode: productId
        },

        success: function () {
            spApi.conLog('spAddToCart : ', 'in success');
            
            location.reload();
        },
        
        error: function () {
            spApi.conLog('spAddToCart', 'in error');
        }
    });
};

return {
    addToBasket: function (productId, callback) {
        (sendAjax || function () {}).call(this, productId);
    }
};