/* OPT-838, OPT-1129 - 30 start */
spApi.customConversionPushTriggerRule = function (type) {
    var langRule = spApi.getLang().split('_')[0];
    var insType = spApi.localStorageGet('ins-' + type);
    var isOnPage = spApi.hasParameter('/extras/' + langRule + '/');
    var currentValue = '';
    var seatsIndex = 1;
    var mealsIndex = 2;
    var index = '';

    if (type === 'seats') {
        index = seatsIndex;
    } else if (type === 'meals') {
        index = mealsIndex;
    }

    if (insType === null && isOnPage) {
        spApi.localStorageSet(('ins-' + type), 0);
    }

    if (insType !== null && isOnPage) {
        currentValue = sQuery('.options:visible:eq(' + index + ') .price').text();

        if (insType !== currentValue) {
            spApi.localStorageSet(('ins-' + type), currentValue);
        }
    }

    var timeDifference = 0;

    if (spApi.hasParameter('confirmReservation')) {
        var departureDateArray = sQuery('.flight[ng-repeat="flight in confirm.itinerary"] .departure:first span')
            .text().split(' ');
        var departureDate = (departureDateArray[0] || '').split('-');
        var departureUnixDate = new Date(
            (departureDate[1] + '/' + departureDate[0] + '/' + departureDate[2] + ' ' + departureDateArray[1]) || 0
        );

        timeDifference = (departureUnixDate - new Date()) / 1000 / 60 / 60;
    }

    return timeDifference;
};

spApi.webPushDynamicUrlGenerate = function (type) {
    var dynamicUrl = '';
    var utm = '?utm_source=insider&utm_medium=web_push&utm_campaign=' + type +
        '_web_push_notification&utm_term=&utm_content=insider' + type + 'push';

    if (spApi.isOnAfterPaymentPage() || spApi.hasParameter('/confirmReservation/')) {
        var currency = (spApi.hasParameter('reservationseg') > -1) ||
            (spApi.hasParameter('reservationsma') > -1) ? 'MAD' : 'AED';
        var surname = sQuery('.passenger-information-block .ps-row.ng-scope label:first').text().split(' ').pop();
        var departureDate = sQuery('.flight[ng-repeat="flight in confirm.itinerary"] .departure:first span')
            .text().split(' ')[0].split('-');

        dynamicUrl = location.origin +
            '/service-app/ibe/reservation.html' + utm + '#/modify/reservation/' +
            spApi.getLang().split('_')[0] + '/' + currency + '//' +
            spApi.getOrderId() + '/' + surname + '/' +
            (departureDate[2] || '') + '-' + (departureDate[1] || '') + '-' + (departureDate[0] || '');
    }

    return dynamicUrl;
};

if (spApi.hasParameter('service-app/ibe/reservation.html#/extras/') || spApi.isOnAfterPaymentPage() ||
    spApi.hasParameter('confirmReservation')) {
    spApi.isWebPushInitialized = false;
}
/* OPT-838, OPT-1129 - 30 end */