var currentSessionId = JSON.parse(spApi.localStorageGet('userDateV') || '[]').pop() || '';
var lastVisitedFormUrls = JSON.parse(spApi.storageData('ins-tamamlanmamis-basvuru') || '[]');
var lastUrlFromLastSession = lastVisitedFormUrls.find(function (element) {
    return element.id !== currentSessionId;
});

sQuery('#link-button-1454703450485').attr('href', lastUrlFromLastSession.url || '#');