var adjustPrice = function (price) {
    var length = price.length;
    var indexOfComma = price.indexOf('.');
    var i = length;

    if (indexOfComma !== -1) {
        price = price.replace(' ', ',');
        i = indexOfComma;
    }

    var arrayPrice = price.split('');
    var counter = 0;

    for (var j = i; j > 0; j--) {
        if (counter === 3) {
            arrayPrice.splice(j, 0, ' ');
            counter = 0;
        }

        counter++;
    }

    return arrayPrice.join('');
};

sQuery('.ins-versus-product-price').each(function (index, element) {
    sQuery(this).text(adjustPrice(sQuery(this).text().replace(' ₽', '')) + ' ₽');
    sQuery('.ins-versus-product-old-price').eq(index).
    text(adjustPrice(sQuery('.ins-versus-product-old-price').eq(index).text().replace(' ₽', '')) + ' ₽');
});