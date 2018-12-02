//spApi.isWebPushInitialized = false;
// Info -  Baggage Amount --- Seems Correct
if (spApi.hasParameter('reservation.html#/extras/baggage/')) {
    sQuery('.options-section').off('click.ins5136').on('click.ins5136', function () {
        sQuery(document).off('click.ins5136').on('click.ins5136', '.dropdown-content > div > div', function () {
            var baggageValue = sQuery('.details p span').text();

            spApi.storageData('ins-baggage', baggageValue);
        });
    });
}
// Info - Date Calculation for 24 Hours control --- 
var timeDifferenceBaggage = 0;

if (spApi.hasParameter('confirmReservation')) {
    var departureDateArray = sQuery('.flight[ng-repeat="flight in confirm.itinerary"] .departure:first span')
        .text().split(' ');
    var departureDate = (departureDateArray[0] || '').split('-');
    var departureTime = (departureDateArray[1] || '').split(':');
    var departureUnixDate =
        new Date(
            (departureDate[1] + '/' + departureDate[0] + '/' + departureDate[2] + ' ' + departureDateArray[1]) || 0
        );

    timeDifferenceBaggage = (departureUnixDate - new Date()) / 1000 / 60 / 60;
}

(spApi.localStorageGet('ins-baggage') === 'No Baggage') &&
(timeDifferenceBaggage > 24) &&
(spApi.isOnAfterPaymentPage() || spApi.hasParameter('confirmReservation'));