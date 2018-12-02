spApi.createStickyBanner = function (config) {
    var stickyBanner = {};

    stickyBanner.init = function () {
        stickyBanner.reset();
        stickyBanner.buildHtml();
        stickyBanner.shiftTheBody();
        stickyBanner.setEvents();
    };

    stickyBanner.reset = function () {
        sQuery('.ins-sticky-banner, .ins-banner-close').remove();
        sQuery('body > .wrapper').css('margin-top', '');
        sQuery(window).off('resize.ins5301');
    };

    stickyBanner.buildHtml = function () {
        var html = '<div class = "ins-sticky-banner">' +
            '<div class = "ins-banner-logo"></div>' +
            '<div class = "ins-middle-part">' +
            '<span style="font-size : 2vh;">UNIQLO Application</span>' +
            '<span style="color: gray;font-size: 2vh">Download the app now!</span>' +
            '<span style="font-size: 1.2vh;">ดาวน์โหลด App ครั้งแรก รับทันที่คูปองส่วนลด 100 บาท*</span>' +
            '</div>' +
            '<div class = "ins-banner-button">Download</div>' +
            '</div>';

        sQuery('body').prepend(html);
        sQuery('body').prepend('<div class = "ins-banner-close">x</div>');
    };

    stickyBanner.shiftTheBody = function () {
        var bannerHeight = sQuery('.ins-sticky-banner').css('height');

        sQuery('body > .wrapper').css('margin-top', bannerHeight);
    };

    stickyBanner.setEvents = function () {
        var builderId = config.builderId;
        var variationId = spApi.userSegments[builderId];
        var clickLogClass = 'sp-custom-' + variationId + '-';

        sQuery('.ins-sticky-banner .ins-banner-button').addClass(clickLogClass + '1');
        sQuery('.ins-banner-close').addClass(clickLogClass + '2');

        sQuery('.ins-sticky-banner .ins-banner-button').off('click.ins5301').on('click.ins5301', function () {
            window.location.href = config.link || '#';
        });

        sQuery(window).off('resize.ins5301').on('resize.ins5301', function () {
            stickyBanner.init();
        });

        sQuery('.ins-banner-close').off('click.ins5301').on('click.ins5301', function () {
            stickyBanner.reset();
        });
    };

    stickyBanner.init();
};

true;