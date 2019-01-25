sQuery('.ins-non-stop').remove();

sQuery('.flight-options').each(function () {
    var isTransferExistForFlight;

    sQuery(this).find('.options-row:visible').each(function (index) {
        isTransferExistForFlight = sQuery(this).find('[uib-tooltip-html="stop|stopType"]:visible').exists();

        if (!isTransferExistForFlight) {
            sQuery(this).find('.flight-duration').append('<span class="ins-non-stop">Non-stop</span>');
            sQuery(this).closest('.flight-options-table .options-row:visible').css('padding-bottom', '15px');
            sQuery(this).find('.button').addClass('sp-custom-' + spApi.userSegments[506] + '-' + String(index + 1));
        }
    });
});

var isTransferExistForFlight = sQuery('[uib-tooltip-html="stop|stopType"]:visible').exists();

!isTransferExistForFlight;