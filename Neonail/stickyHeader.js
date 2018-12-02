(function (stickyBanner) {
    stickyBanner.originalMarginTop = Number((sQuery('body > .shift').css('marginTop') || '').replace('px', ''));

    stickyBanner.init = function () {
        stickyBanner.reset();
        stickyBanner.buildHtml();
        stickyBanner.changeTheHeaderCss();
        stickyBanner.setEvents();
    };

    stickyBanner.reset = function () {
        sQuery('.ins-header-sticky-banner').remove();
    };

    stickyBanner.buildHtml = function () {
        sQuery('header').prepend(
            '<div class = "ins-header-wrapper">' +
                '<div class = "ins-header-sticky-banner"></div>' +
            '</div>'
        );
    };

    stickyBanner.changeTheHeaderCss = function () {
        var bannerHeight = Number((sQuery('header#SiteHeader').css('height') || '').replace('px', ''));
        var shiftAmount = stickyBanner.originalMarginTop + bannerHeight;

        sQuery('body > .shift').css('marginTop', shiftAmount + 'px');
        sQuery('.ins-header-wrapper').css('top', bannerHeight + 'px');
    };

    stickyBanner.setEvents = function () {
        var resizeTimer;

        sQuery(window).off('resize.ins6456').on('resize.ins6456', function () {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function () {
                stickyBanner.changeTheHeaderCss();
            }, 250);
        });
    };

    stickyBanner.init();
}({}));