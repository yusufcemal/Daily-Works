// Custom - 236
var variationId = spApi.userSegments[236];

sQuery(document).off('cartAmountUpdated.OPT8621').on('cartAmountUpdated.OPT8621', function () {
    spApi.showCustomCamp(spApi.getCamp(variationId).camp);
});

spApi.isOnCartPage();