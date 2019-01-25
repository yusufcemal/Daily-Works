var partnerId = '10002171';
var language = spApi.getLang();
var currency = spApi.getCurrency();
var product = spApi.getCurrentProduct();
var endPoint = 'https://recommendation.api.useinsider.com/' + partnerId + '/' + language + '/similar/product/' +
    product.id + '?category=' + (product.cats[0] || '') + '&subCategory=' + (product.cats.pop() || '') +
    '&size=50&details=1';

new spApi.CreateRecommendationEngine({
    endPoint: endPoint,
    variationId: 65,
    insertType: 'after',
    currency: currency,
    currencyDisplay: 'RM',
    productSize: 4,
    recommendationTitle: 'View to view',
    selector: '.Customer_Reviews'
});