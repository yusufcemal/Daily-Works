var success = false;

if (sQuery('.m-cartService .m-cartService_customRadio').length >= 1) {
    var paidProducts = spApi.getPaidProducts();

    sQuery.each(paidProducts, function () {
        if (this.name.search('Smartfon') > -1) {
            success = true;
        }
    });
}

var numberOfProductsWithService = (sQuery('.js-add-service').length / 2);

sQuery('.js-add-service').each(function (index, element) {
    if (this.value === 'on') {
        numberOfProductsWithService--;
    }
});


success && numberOfProductsWithService > 0;