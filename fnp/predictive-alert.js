if (spApi.hasParameter('/order-summary')) {
    var productArray = [];
    var productInfo = {};

    sQuery('.product-section').each(function (index, element) {
        productInfo = {};

        productInfo.id = sQuery(this).find('[data-productid]').attr('data-productid');
        productInfo.name = sQuery(this).find('.product-name').text().trim();
        productInfo.url = '';
        productInfo.img = sQuery(this).find('.thumbnails img').attr('src');
        productInfo.quantity =
            (sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ') || []).pop() || '';
        productInfo.price = sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ')[2];
        productInfo.originalPrice = sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ')[2];
        productInfo.exchange = 'from ' + sQuery(this).find('.pro-price.delivery-detail li').text().trim().split(' ')[0] +
            ' to ' + spApi.preferredCurrency;
        productInfo.time = spApi.getTime();

        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productInfo, 'originalPrice');
        spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, productInfo, 'price');

        productArray.push(productInfo);
    });
}

console.log(productArray);