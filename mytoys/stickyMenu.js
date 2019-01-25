// Rule part 
var variationId = spApi.userSegments[770] || '';
var campaign = spApi.getCamp(variationId).camp || {};

var ajaxListener = function (callback) {
    var originalOpenFunction = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        originalOpenFunction.apply(this, arguments);

        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                if (typeof callback === 'function') {
                    try {
                        callback(url, method);
                    } catch (error) {
                        spApi.conLog('Something is crashed, Event:' + error);
                    }
                }
            }
        });
    };
};

ajaxListener(function (url, method) {
    if (url.indexOf('checkout/addToBasket?id') > -1 && method === 'GET' && sQuery('.brown-line').exists()) {
        spApi.showCustomCamp(campaign);
    }
});

parseFloat(sQuery('[data-target="basketCount"]').text()) > 0 && sQuery('.brown-line').exists();

//custom js
var headerMenuElement = sQuery('.brown-line');

headerMenuElement.addClass('ins-sticky-menu sp-custom-1175-1');
sQuery('div#searchBody').addClass('ins-shift-search-bar');
sQuery('#searchBody .searchsubmit').addClass('ins-shift-search-icon');

sQuery(window).off('scroll.insBannerPositionControl').on('scroll.insBannerPositionControl', function () {
    if (sQuery(this).scrollTop() > 1000) {
        setTimeout(function () {
            if (sQuery('#backToTop').hasClass('show')) {
                headerMenuElement.addClass('ins-shift-for-back-to-top');
            }
        }, 1);
    } else {
        headerMenuElement.removeClass('ins-shift-for-back-to-top');
    }
});

//reset
sQuery('.brown-line').removeClass('ins-sticky-menu sp-custom-1175-1');
sQuery('div#searchBody').removeClass('ins-shift-search-bar');
sQuery('#searchBody .searchsubmit').removeClass('ins-shift-search-icon');

true;