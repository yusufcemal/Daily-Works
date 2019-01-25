/*
 * 60 -> 72
 * 31 -> 35
 * 30 -> 33 
 */

// OPT - 9568 - START
function checkForThePreviousCartCount(currenctCartCount) {
    var previousCartCount = spApi.storageData('ins-previous-cart-count');

    if (previousCartCount === String(currenctCartCount)) {
        return false;
    }

    spApi.storageData('ins-previous-cart-count', JSON.stringify(currenctCartCount));

    return true;
}

sQuery(document).off('cartAmountUpdated.OPT9568').on('cartAmountUpdated.OPT9568', function () {
    var cartCount = spApi.getCartCount();

    if (checkForThePreviousCartCount(cartCount) && cartCount === 0) {
        var webPushIdsToReset = [72, 35, 33];
        var webPush = null;

        spApi.activeConversionPushes.set = [];
        spApi.activeConversionPushes.reset = [];
        spApi.activeConversionPushes.update = [];

        webPushIdsToReset.forEach(function (webPushId) {
            webPush = spApi.webPushes[webPushId] || {};

            spApi.activeConversionPushes.reset.push(webPush);
        });

        sQuery('#spWorker').pm(function () {
            var pmData = {};

            pmData.insdrSubsId = sQuery.cookie('insdrSubsId') || '';
            pmData.spUID = sQuery.cookie('spUID') || '';

            return pmData;
        }, function (pmData) {
            spApi.setConversionPushes(pmData);

            spApi.activeConversionPushes.set = [];
            spApi.activeConversionPushes.reset = [];
            spApi.activeConversionPushes.update = [];
        });
    }
});
// OPT - 9568 - END