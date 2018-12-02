spApi.customFastScrollMobile = function (config, showCampaignFallback) {
    spApi.insCustomBounced = false;

    if (typeof spApi.customFastScrollMobileListener !== 'undefined' || !spApi.isOnCategoryPage()) {
        return false;
    }

    spApi.customFastScrollMobileListener = true;

    if (typeof config.element === 'undefined') {
        spApi.conLog('Custom Fast Scroll element could not find...');

        return false;
    }

    var campId = spApi.userSegments[config.builderId];

    var triggerSpeed = 3;
    var scrollDirection = -1;
    var lastDate = new Date().getTime();
    var lastOffset = sQuery(config.element).scrollTop();

    config.element.addEventListener('scroll', function (event) {
        var delayInMs = event.timeStamp - lastDate;
        var offset = sQuery(config.element).scrollTop() - lastOffset;
        var speedPerMs = (offset / delayInMs).toFixed(2);

        if (scrollDirection * speedPerMs >= triggerSpeed) {

            if (config.cookieControl === true && spApi.storageData('sp-camp-' + campId) !== null) {
                return false;
            }

            if (spApi.insCustomBounced !== true) {
                spApi.insCustomBounced = true;

                showCampaignFallback(campId);
            }
        }

        lastDate = event.timeStamp;
        lastOffset = sQuery(config.element).scrollTop();
    });

    return false;
};

spApi.customFastScrollMobile({
        element: window,
        builderId: 562,
        cookieControl: true
    },
    function (campId) {
        var camp = spApi.getCamp(campId).camp;

        if (camp.lang === spApi.getLang()) {
            spApi.showCustomCamp(camp);
        }
    });