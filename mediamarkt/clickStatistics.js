if (spApi.isOnCartPage()) {
    var variationId = 'c210';

    var ajaxListener = function (callback) {
        var originalOpenFunction = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            originalOpenFunction.apply(this, arguments);

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        try {
                            callback(url, method);
                        } catch (error) {
                            spApi.conLog('Something is crashed, Event:' + error);
                        }
                    }
                }
            });
        };
    };

    ajaxListener(function (url, method) {
        if ((url.indexOf('/cart/service/add') > -1 || url.indexOf('koszyk/list-item/del') > -1) && method === 'POST') {
            setTimeout(function () {
                spApi.showCustomCamp(spApi.getCamp(variationId).camp);
            }, 1000);
        }
    });

    var isSmartPhoneProductExists = false;

    sQuery('.m-cartList_itemProductName > a').each(function () {
        if (this.text.indexOf('Smartfon') > -1) {
            isSmartPhoneProductExists = true;
        }
    });

    var numberOfServiceOptions = sQuery('li.m-cartService_item').length;
    var numberOfSelectedServiceOptions = sQuery('li.m-cartService_item input:checked').length * 2;

    (numberOfServiceOptions - numberOfSelectedServiceOptions > 0) && isSmartPhoneProductExists;
} else {
    false;
}