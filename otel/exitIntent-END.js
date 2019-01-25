if (spApi.isOnMainPage()) {
    spApi.customBounce = function (variationId, callback) {
        window.insIsBounced = false;

        if (typeof callback === 'function' && !sQuery('[class*="sp-advanced-css-"]').exists() &&
            spApi.storageData('sp-camp-' + variationId) === null) {

            sQuery(document).on('mouseleave.insider', function (e) {
                if (e.pageY - sQuery(window).scrollTop() <= 0 && !window.insIsBounced) {
                    window.insIsBounced = true;

                    sQuery(document).off('mouseleave.insider');
                    
                    callback(variationId);
                }
            });
        }
    };

    var builderId = 906;
    var variationId = spApi.userSegments[builderId];

    spApi.customBounce(variationId, function (variationId) {
        spApi.showCustomCamp(spApi.getCamp(variationId).camp);

        sQuery([document.documentElement, document.body]).animate({
            scrollTop: 100
        }, 1000);
    });
}

false;