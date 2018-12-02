(function (self) {
    self.searchBarElement = sQuery('.search.opener.v1');

    self.init = function () {
        self.reset();
        self.createHtml();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('.ins-overlay').remove();

        self.searchBarElement.removeClass('ins-search-bar-focus');
        self.searchBarElement.removeClass('ins-search-bar-transition');

        setTimeout(function () {
            self.searchBarElement.show();
        }, 1000);
    };

    self.createHtml = function () {
        sQuery('body').prepend('<div class="ins-overlay"></div>');
        self.searchBarElement.addClass('ins-search-bar-transition');
        self.searchBarElement.addClass('ins-search-bar-focus');
        self.searchBarElement.addClass('sp-custom-90-1');
    };

    self.setEvents = function () {
        sQuery('.ins-overlay').off('click.ins145').on('click.ins145', function () {
            self.searchBarElement.hide();
            self.reset();
        });
    };

    self.init();
})({});