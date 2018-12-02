(function (self) {
    self.init = function () {
        self.reset();
        self.createHtml();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('.ins-notification-cta').remove();
    };

    self.createHtml = function () {
        if (spApi.getTotalCartAmount() < 688) {
            var buttonsContainer = sQuery('.salepage-fix-bottom');
            var currentCartAmount = spApi.getTotalCartAmount();
            var notificationText = '滿$499享超取免運';

            if (currentCartAmount > 0 && currentCartAmount < 499) {
                notificationText = '再加購$' + (499 - currentCartAmount) + ' 立享超取免運';
            }

            if (currentCartAmount >= 499 && currentCartAmount < 688) {
                notificationText = '滿$688早鳥超商取貨送City Cafe拿鐵';
            }

            var notification = '<div class="ins-notification-cta">' + notificationText + '</div>';

            buttonsContainer.prepend(notification);

            sQuery('.salepage-btn').addClass('sp-custom-c189-1');
        }
    };

    self.setEvents = function () {
        spApi.conLog('in ajax listener...');
        self.ajaxListener(function (url, response, method) {
            if (url.indexOf('webapi/ShoppingCartV2/InsertItem') > -1 && method === 'POST') {
                spApi.conLog('ajax received...');
                setTimeout(function () {
                    self.reset();
                    self.createHtml();
                }, 2000);
            }
        });
    };

    self.ajaxListener = function (callback) {
        var originalOpenFunction = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            originalOpenFunction.apply(this, arguments);

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        try {
                            callback(url, this.responseText, method);
                        } catch (error) {
                            spApi.conLog('Something is crashed, Event:' + error);
                        }
                    }
                }
            });
        };
    };

    self.init();
}({}));