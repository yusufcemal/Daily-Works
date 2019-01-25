spApi.customBounce = function (callback) {
    spApi.insIsUserBounced = false;

    if (typeof callback === 'function') {
        sQuery(document).on('mouseleave.insiderCustomBounce', function (event) {
            if (event.pageY - sQuery(window).scrollTop() <= 0 && !spApi.insIsUserBounced) {
                spApi.insIsUserBounced = true;

                sQuery(document).off('mouseleave.insiderCustomBounce');

                callback();
            }
        });
    }
};

spApi.customBounce(function () {
    var builderId = 906;
    var variationId = spApi.userSegments[builderId];
    var camp = spApi.getCamp(variationId).camp;

    if (camp.lang === spApi.getLang() && spApi.isOnMainPage()) {
        spApi.showCustomCamp(camp);
    }
});

false;