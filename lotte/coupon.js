(function (coupon) {
    coupon.text = 'DUNGDI';
    coupon.variationId = (spApi.userSegments[562] || 'Development');
    coupon.customClass = 'sp-custom-' + coupon.variationId + '-1';

    coupon.init = function () {
        coupon.reset();
        coupon.createHtml();
        coupon.setEvents();
    };

    coupon.reset = function () {
        sQuery('.ins-coupon-wrapper').remove();
    };

    coupon.createHtml = function () {
        var html =
            '<div class = "ins-coupon-wrapper">' +
            '<div class = "ins-coupon-text ' + coupon.customClass + '">DUNGDI</div>' +
            '<div class = "ins-coupon-close ' + coupon.customClass + '"></div>' +
            '</div>';

        sQuery('body').prepend(html);
    };

    coupon.setEvents = function () {
        sQuery('.ins-coupon-wrapper .ins-coupon-text').off('click.ins-' + coupon.variationId)
            .on('click.ins-' + coupon.variationId, function () {
                coupon.copyToTheClipBoard();
            });

        sQuery('.ins-coupon-wrapper .ins-coupon-close').off('click.ins-' + coupon.variationId)
            .on('click.ins-' + coupon.variationId, function () {
                coupon.reset();
            });
    };

    coupon.copyToTheClipBoard = function () {
        var range;
        var selection;
        var element = document.createElement('textarea');

        element.readOnly = true;
        element.value = coupon.text;
        element.textContent = coupon.text;
        document.body.appendChild(element);

        if (spApi.getBrowser() === 'Safari') {
            range = document.createRange();
            range.selectNodeContents(element);

            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            element.setSelectionRange(0, 999999);
        } else {
            element.select();
        }

        document.execCommand('copy');

        document.body.removeChild(element);
    };

    coupon.init();
}({}));