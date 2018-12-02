spApi.customBounce = function (callback) {
    spApi.insIsUserBounced = false;

    if (typeof callback === 'function') {
        sQuery(document).on('mouseleave.ins1336', function (event) {
            if (spApi.getTotalCartAmount() === 0 && event.pageY - sQuery(window).scrollTop() <= 0 &&
                !spApi.insIsUserBounced) {
                spApi.insIsUserBounced = true;

                sQuery(document).off('mouseleave.ins1336');

                callback();
            }
        });
    }
};

spApi.customBounce(function () {
    var builderId = 1336;
    var campId = spApi.userSegments[builderId];

    var camp = spApi.getCamp(campId).camp;

    if (camp.lang === spApi.getLang()) {
        spApi.showCustomCamp(camp);
    }
});

false;