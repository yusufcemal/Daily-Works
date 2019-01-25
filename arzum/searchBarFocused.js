(function (self) {
    self.searchBarElement = sQuery('.search.opener.v1');

    self.init = function () {
        self.reset();
        self.createHtml();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('.ins-overlay').remove();

        self.searchBarElement.removeClass('ins-search-bar-focus ins-search-bar-transition sp-custom-90-1');

        setTimeout(function () {
            self.searchBarElement.show();
        }, 1000);
    };

    self.createHtml = function () {
        sQuery('body').prepend('<div class="ins-overlay"></div>');
        self.searchBarElement.addClass('ins-search-bar-transition');
        self.searchBarElement.addClass('ins-search-bar-focus sp-custom-90-1');
    };

    self.setEvents = function () {
        sQuery('.ins-overlay').off('click.ins145').on('click.ins145', function () {
            self.searchBarElement.hide();
            self.reset();
        });
    };

    self.init();
})({});