var lastVisitedFormUrls = JSON.parse(spApi.storageData('ins-tamamlanmamis-basvuru') || '[]');
var currentSessionId = JSON.parse(spApi.localStorageGet('userDateV') || '[]').pop() || '';

spApi.sendCustomGoal = function (builderId, goalId) {
    var goalOfCamp = spApi.personalizationCamps[builderId]['goalBuilderList'][goalId];

    if (typeof goalOfCamp === 'undefined') {
        return false;
    }

    if (goalOfCamp.type === 'rules') {
        goalOfCamp.goalList[0]['selectorString'] = 'true';

        spApi.addGoalTracking(true);
    }
};

var getUrlIndex = function (array, searchedUrl) {
    return array.findIndex(function (element) {
        return element.url === searchedUrl;
    });
};

var getSessionIndexFromLastSession = function (array, sessionId) {
    return array.findIndex(function (element) {
        return element.id !== sessionId;
    });
};

if (spApi.hasParameter('/basvuru-tamamlama/') && sQuery('#formBasvuruIcerik').exists()) {
    var currentUrl = spApi.getUrl();

    var urlIndex = getUrlIndex(lastVisitedFormUrls, currentUrl);

    if (urlIndex === -1) {
        lastVisitedFormUrls.push({
            'url': currentUrl,
            'id': currentSessionId
        });
    } else {
        lastVisitedFormUrls.splice(urlIndex, 1);
        lastVisitedFormUrls.push({
            'url': currentUrl,
            'id': currentSessionId
        });
    }

    spApi.storageData('ins-tamamlanmamis-basvuru', JSON.stringify(lastVisitedFormUrls), {
        expires: 30
    });
}

var referrerUrlIndex = getUrlIndex(lastVisitedFormUrls, document.referrer);

if (spApi.isOnAfterPaymentPage() && spApi.storageData('ins-tamamlanmamis-basvuru') !== null) {
    lastVisitedFormUrls.pop();

    spApi.storageData('ins-tamamlanmamis-basvuru', JSON.stringify(lastVisitedFormUrls), {
        expires: 30
    });

    spApi.conLog('OPT-2038 - lastVisitedFormUrls', lastVisitedFormUrls);

    if ((JSON.parse(spApi.storageData('sp-camp-181') || '[]')['step1-displayed'] === true && referrerUrlIndex > -1) ||
        spApi.userSegments[95] === '179' && referrerUrlIndex > -1) {
        spApi.sendCustomGoal(95, 24);
    }
}

(lastVisitedFormUrls.length > 0) && (!spApi.hasParameter('/basvuru-tamamlama/')) &&
getSessionIndexFromLastSession(lastVisitedFormUrls, currentSessionId) > -1;