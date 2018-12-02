var sendAddToCartRequest = function (productId) {
    if (typeof $ === 'function') {
        var addToCartEndpoint = '/cart/addToMiniCart';
        var payload = {
            variant_id: productId,
            quantity: 1
        };
        var modalInfoElement = $('.modal .status-info');
        var modalElement = $('.modal');

        if (!modalElement.hasClass('in')) {
            $('.basket-popover').popover('show');
        } else {
            modalInfoElement.animate({
                opacity: 0
            }, 100);
        }

        clearTimeout(globalTimeout);

        $.ajax({
            url: addToCartEndpoint,
            dataType: 'json',
            data: payload,
            method: 'POST',
            cache: false,
            success: function (response) {
                if (typeof json_cart === 'undefined') {
                    var json_cart;
                }

                json_cart = null;

                $('.basket-products-count').html(response.product_count || 0);

                if ((response.product_count || 0) > 0) {
                    $('#basket-popover-wrapper .basket').removeClass('empty');
                }

                if (modalElement.hasClass('in')) {
                    modalInfoElement.animate({
                        opacity: 1
                    }, 100);

                    modalInfoElement.fadeIn().html('<div class="alert alert-success text-center">' +
                        (response.message || {}) + '. <a href="' + basketURL + '">Zobacz koszyk (' +
                        (response.product_count || 0) + ')</a></div>');

                    $('.modal.in').animate({
                        scrollTop: 0
                    });
                } else {
                    generateBasketPopoverContent(getBasketPopoverContent(response.cart || {}), (response.cart || {}));

                    json_cart = response.cart || {};

                    setTimeout(function () {
                        $('body, html').animate({
                            scrollTop: 0
                        }, 500);

                        basketScroll = $('.products-list [data-id=' + payload.variant_id + ']').index() / 2;

                        basketScrollTo(basketScroll);
                    }, 300);

                    globalTimeout = setTimeout(function () {
                        if (!$('#basket-popover-wrapper').is(':hover') && basket_clicked === false) {
                            $('.basket-popover').popover('hide');
                        }
                    }, 5000);
                }
            },
            error: function (response) {
                if (modalElement.hasClass('in')) {
                    modalInfoElement.animate({
                        opacity: 1
                    }, 100);

                    modalInfoElement.fadeIn().html('<div class="alert alert-danger text-center">' +
                        (response.message || {}) + '</div>');

                    $('.modal.in').animate({
                        scrollTop: 0
                    });
                } else {
                    modalElement.modal('hide');

                    $('#fail-info').find('.modal-message').html((response.message || {})).modal('show');
                }
            }
        });
    }
};

return {
    addToBasket: function (productId) {
        sendAddToCartRequest(productId);
    }
};