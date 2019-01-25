function formPrice (str) {
    return parseFloat((str || '').replace(/[^0-9.]/g, '') || 0);
}

var total = 0;

if (spApi.isOnCartPage()) {
    total = formPrice(sQuery('.row.cartgrid .webprice:last').text()) || Number(sQuery('#grandTotal').text() || '0');
} else {
    total = parseFloat(sQuery.cookie('total-cart-amount') || '') || 0;
}

return spApi.getExchangeRate(spApi.getCurrency(), spApi.preferredCurrency, total);