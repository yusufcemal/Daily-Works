if (!spApi.hasParameter('/order-summary')) {
    var paidProductList = [];
    var cartList = [];

    function formPrice(str) {
        /* parseFloat'a uygun parse etmek icin */
        return parseFloat((str || '').replace(/[^0-9.]/g, '') || 0);
    }

    /**
     * Geliştirici Notu: Ürün ID değerleri ekrana basılmıyor.
     * Bu nedenle Angular elementinin scopeuna erişerek alıyoruz.
     */
    if (typeof angular !== 'undefined' && sQuery('#cartSummaryId:first').exists()) {
        var ngElement = angular.element(sQuery('#cartSummaryId:first'));

        if (typeof ngElement !== 'undefined' && typeof ngElement.injector === 'function' &&
            typeof ngElement.injector().invoke === 'function') {

            var ngRootScope = ngElement.injector().invoke(function ($rootScope) {
                return $rootScope;
            }) || {};

            if (typeof ngRootScope.cart !== 'undefined' && typeof ngRootScope.cart.items !== 'undefined') {
                cartList = ngRootScope.cart.items;
            }
        }
    }

    sQuery('#cartSummaryId:first li > div.row.cartgrid').each(function (key, val) {
        var quantity = parseInt(sQuery('.viewitemquantity:first', val).text()) || 1;

        var productObj = {
            id: (cartList[key] || {}).productId || '',
            name: sQuery('.p-name', val).text().trim(),
            price: formPrice(sQuery('.webprice', val).text().trim()) / quantity,
            originalPrice: formPrice(sQuery('.webprice', val).text().trim()) / quantity,
            img: sQuery('.u-photo', val).prop('src') || '',
            url: '', // Geliştirici Notu: URL sayfada bulunamadı
            quantity: quantity,
            exchange: 'from ' + spApi.getCurrency() + ' to ' + spApi.preferredCurrency,
            time: spApi.getTime()
        };

        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productObj, 'originalPrice');
        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productObj, 'price');

        paidProductList.push(productObj);
    });
} else {
    // OPT - 8091 - START
    var productArray = [];
    var productInfo = {};

    sQuery('.product-section').each(function (index, element) {
        productInfo = {};

        productInfo.id = sQuery(this).find('[data-productid]').attr('data-productid') || '';
        productInfo.name = sQuery(this).find('.product-name').text().trim();
        productInfo.url = ''; // There is no url source on order summary page!
        productInfo.img = sQuery(this).find('.thumbnails img').attr('src') || '';
        productInfo.quantity =
            (sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ') || []).pop() || '';
        productInfo.price = (sQuery(this).find('.pro-price.delivery-detail li')
            .text().trim().split(' ') || [])[2] || '';
        productInfo.originalPrice = (sQuery(this).find('.pro-price.delivery-detail li')
            .text().trim().split(' ') || [])[2] || '';
        productInfo.exchange = 'from ' +
            (sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ') || [])[0] +
            ' to ' + spApi.preferredCurrency;
        productInfo.time = spApi.getTime();

        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productInfo, 'originalPrice');
        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productInfo, 'price');

        productArray.push(productInfo);
    });
    // OPT - 8091 - START
}

return productArray || paidProductList || spApi.getCartProductStorage();
