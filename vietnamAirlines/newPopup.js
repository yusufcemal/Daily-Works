var createHtml = function () {
    var beforeSelector = '#siteHeader';
    var bannerHtml = "<div class= 'ins-welcome-header'>" +
        "<div class= 'ins-header-wrapper'>" +
        "<div class = 'ins-header-text'>Chào mừng Quý khách tiếp tục đồng hành cùng Vietnam Airlines! Hãy xem thêm các ưu đãi khác!</div>" +
        "<a class='ins-confirm-button' href='https://www.vietnamairlines.com/vi/plan-book/book-flight-now/promotions'>" +
        "Chi tiết</a>" +
        "<a class= 'ins-close-button'>&#10005;</a>" +
        "</div>" +
        "</div>";

    sQuery('ins-welcome-header').remove();
    sQuery(beforeSelector).before(bannerHtml);
}

var setEvents = function () {
    var variationId = spApi.userSegments[367] || '';

    sQuery('.ins-close-button').addClass('sp-custom-' + variationId);
    sQuery('.ins-confirm-button').addClass('sp-custom-' + variationId);

    sQuery('.ins-close-button').off('click.ins').on('click.ins', function () {
        sQuery('.ins-welcome-header').remove();
    });
}

createHtml();
setEvents();