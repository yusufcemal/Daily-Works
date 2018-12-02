(function (banner) {
    banner.init = function () {
        banner.reset();
        banner.buildHtml();
        banner.setEvents();
    };

    banner.reset = function () {
        sQuery('.ins-sticky-bottom-wrapper').remove();
    };

    banner.buildHtml = function () {
        sQuery('body').prepend('<div class = "ins-sticky-bottom-wrapper"><div class = "ins-banner-image"></div></div>');
    };

    banner.setEvents = function () {
        var oldScrollPosition = 0;
        var currentScrollPosition = 0;
        var isHideLocked = true;

        sQuery(window).off('scroll.ins5341').on('scroll.ins5341', function () {
            currentScrollPosition = sQuery(this).scrollTop();

            if (currentScrollPosition > oldScrollPosition) {
                sQuery('.ins-sticky-bottom-wrapper').show();

                isHideLocked = false;

                setTimeout(function () {
                    isHideLocked = true;
                }, 1500);
            } else {
                if (isHideLocked) {
                    sQuery('.ins-sticky-bottom-wrapper').hide();
                }
            }

            oldScrollPosition = currentScrollPosition;
        });
    };

    banner.init();
}({}));