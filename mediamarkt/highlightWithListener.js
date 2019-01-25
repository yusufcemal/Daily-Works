function highlightCamp(config) {
    this.variationId = spApi.userSegments[config.builderId] || 'Development';
    this.customClass = 'sp-custom-' + this.variationId + '-1';

    this.init = function () {
        this.reset();
        this.buildUX();
    };

    this.reset = function () {
        sQuery('.ins-highlight-text').remove();
    };

    this.buildUX = function () {
        sQuery('tr.m-cartList_serviceRow').each(function () {
            sQuery(this).find('.m-cartService_item:first')
                .addClass('ins-radio-button-highlight')
                .after('<div class="ins-highlight-text"><span>Zabezpiecz jeszcze lepiej swoje urządzenie</span></div>');

            sQuery(this).find('.ins-highlight:last .m-cartService_radio')
                .addClass('ins-cart-service-radio');
            sQuery(this).find('.m-cartService_radio .m-cartService_customRadio:first')
                .addClass('ins-custom-radio-button-first');
            sQuery(this).find('.m-cartService_radio .m-cartService_customRadio:last')
                .addClass('ins-custom-radio-button-last');

            sQuery(this).find('input:first').addClass(this.customClass);
        });
    };

    this.init();
}

new highlightCamp({
    builderId: 152
});