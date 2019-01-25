//Mobile Experiment - 238
var variationId = spApi.userSegments[238];

sQuery(document).off('cartAmountUpdated.OPT8621').on('cartAmountUpdated.OPT8621', function () {
    spApi.showCustomCamp(spApi.getCamp(variationId).camp);
});

spApi.isOnCartPage();