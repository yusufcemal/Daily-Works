var variationId = spApi.userSegments[909];
var clickLogClass = 'sp-custom-' + variationId + '-1';

var reset = function () {
    var deletedElements = '[modal-name="modal-sure-back-money"],' +
        '.page-header ul.list-inline:visible, .page-header a[href="#price-box-wrapper"],' +
        '#like-heart, .tripad_rating_fil.pull-left, a.ins-comment-link, div.ins-comment-icon';

    sQuery(deletedElements).remove();
    sQuery('.page-header .box-review').removeClass('ins-box-review');
};

var addHtml = function () {
    sQuery('.page-header .box-review').addClass('ins-box-review');

    sQuery('.ins-box-review').after('<a class = "ins-comment-link ' + clickLogClass + 
    '" href="#cus_rate">Xem danh gia cua khach</a>' + '<div class = "ins-comment-icon"><div>');
};

reset();
addHtml();