var builderId = 906;
var variationId = spApi.userSegments[builderId];
var camp = spApi.getCamp(variationId).camp;
var windowWidth = sQuery(window).width();
var isCloseLocationLeft = window.navigator.platform.indexOf('Mac') >= 0 ||
    window.navigator.platform.indexOf('Linux') >= 0;
var leftLimit = windowWidth * spApi.bounceExcludeLeft / 100;
var rightLimit = windowWidth - (windowWidth * spApi.bounceExcludeRight / 100);
var isOutOnTarget = true;
var isBounced = false;

sQuery(document).on('mouseleave', function (e) {
    var condition = ((isCloseLocationLeft && (rightLimit < e.clientX || e.clientX < leftLimit) && isOutOnTarget) ||
        (!isCloseLocationLeft && (rightLimit < e.clientX || e.clientX < leftLimit) && isOutOnTarget));

    if (e.pageY - sQuery(window).scrollTop() <= 0 && !isBounced && condition) {
        isBounced = true;

        if (camp.locationisActive == 1 && spApi.getLocationIsOk(camp) && camp) {
            spApi.userBounced = true;
            spApi.showCustomCamp(camp);
        } else if (camp) {
            spApi.userBounced = true;
            spApi.showCustomCamp(camp);
        }
    }
});

false;