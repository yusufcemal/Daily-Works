(function (self) {
    'use strict';

    var currencyType = sQuery('.currency-text:first').text();
    var campId = 396;
    var cookieExpires = 30;
    var isAnimationActive = true;
    var config = {
        value: {
            popupTitle: 'Fly with everything you need for just @price',
            upgradeButtonText: 'Upgrade me to Value fare',
            dontNeedButtonText: 'I don`t need it',
            services: [{
                icon: false,
                text: 'Upgrade to value fare for just @price'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/MutHx8RmXXbWWA8udZJU1521970385.png',
                text: '20/30/40 KG checked baggage'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/VwKqpxZBIbVQCOUiBqI31521970451.png',
                text: 'Sandwich + water'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/9s4R33waLmepfXjhSsxa1521970508.png',
                text: 'Seats: row 8 onwards'
            }]
        }, // OPT-9055 start
        extra: {
            popupTitle: 'Fly with everything you need for just @price',
            upgradeButtonText: 'Upgrade me to Extra fare',
            dontNeedButtonText: 'I don`t need it',
            services: [{
                icon: false,
                text: 'Upgrade to Extra fare for just @price'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/MutHx8RmXXbWWA8udZJU1521970385.png',
                text: '40 KG checked baggage'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/VwKqpxZBIbVQCOUiBqI31521970451.png',
                text: 'Any hot meal'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/9s4R33waLmepfXjhSsxa1521970508.png',
                text: 'Any seat'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/dcAeInVUiVYSgqE7Mkm11521970621.png',
                text: 'Free modifictaion up to 4 hours'
            }, {
                icon: 'https://image.useinsider.com/airarabia/c396/JeaUGYByajlRn9tl5LF61521970636.png',
                text: 'Free cancelletion up to 4 hours'
            }]
        }
    };// OPT-9055 end

    self.construct = function () {
        self.reset();

        if (sQuery.cookie('ins-popup-showed') === null) {
            spApi.insPriceDifference = self.getPriceDifference();

            self.addFakePassengerDetailsButton();
            self.setEvents();
        }
    };

    self.reset = function () {
        sQuery('.ins-overlay').remove();
        sQuery('.ins-popup-container').remove();
        sQuery('.ins-proceed-to-passenger').remove();
    };

    self.addFakePassengerDetailsButton = function () {
        var parent = sQuery('#btn-proceed-to-passenger').closest('.button-block');

        parent.append('<div class="ins-proceed-to-passenger">' +
            '<button class="ins-custom-continue-button"></button>' +
            '</div>');
    };

    self.addPopup = function () {
        config = config[spApi.popupToShow];

        if (typeof config === 'undefined') {
            return false;
        }

        sQuery('body').append('<div class="ins-popup-container ' +
            '" >' +
            '<div class="ins-popup-header">' + config.popupTitle.replace('@price', currencyType + ' ' +
                spApi.insPriceDifference) + '</div>' +
            '<div class="ins-popup-body">' +
            self.getServicesHtml(config.services) +
            '</div>' +
            '<div class="ins-popup-footer">' +
            '<div class="ins-button ins-close-button">' +
            config.dontNeedButtonText +
            '</div>' +
            '<div class="ins-button ins-success-button sp-custom-' + campId + '-1">' +
            config.upgradeButtonText +
            '</div>' +
            '</div>' +
            '</div>');

        if (isAnimationActive === true) {
            sQuery('.ins-popup-container').fadeIn('slow');
        }
    };
    // OPT-6467 start
    self.multiplyPriceDifference = function () {
        if (window.location.origin.indexOf('reservations.airarabia') > -1 ||
            window.location.origin.indexOf('reservationseg.airarabia') > -1) {
            spApi.insPriceDifference = parseFloat((spApi.insPriceDifference * 1.03).toFixed(2));
        }
    };
    // OPT-6467 end
    self.addOverlay = function () {
        sQuery('body').append('<div class="ins-overlay"></div>');
    };

    self.setEvents = function () {
        sQuery(document).on('click', '.ins-proceed-to-passenger', function () {
            self.addPopup();
            self.addOverlay();
            self.setPopupCookie();
            self.multiplyPriceDifference();
        });

        sQuery(document).on('click', '.ins-close-button', function () {
            self.reset();

            sQuery('#btn-proceed-to-passenger').elementLoadComplete(function () {
                angular.element(document.querySelectorAll('#btn-proceed-to-passenger')[0]).click();
            }, {
                i: 500,
                t: 5000
            });
        });

        sQuery(document).on('click', '.ins-success-button', function () {
            function setUpgradeEvents(callback) {
                self.reset();

                if (sQuery('.right-section .fare-and-services-body-container.ng-scope ').length > 4) {
                    sQuery('.right-section .fare-and-services-body-container.ng-scope').each(function (index, elem) {
                        if ((index === 1 || index === 4) && spApi.popupToShow === 'value') {
                            sQuery(elem).trigger('click');
                        } else if ((index === 2 || index === 5) && spApi.popupToShow === 'extra') {
                            sQuery(elem).trigger('click');
                        }

                    });
                } else {
                    sQuery('.right-section .fare-and-services-body-container.ng-scope').each(function (index, elem) {
                        if (index === 1 && spApi.popupToShow === 'value') {
                            sQuery(elem).trigger('click');
                        } else if (index === 2 && spApi.popupToShow === 'extra') {
                            sQuery(elem).trigger('click');
                        }
                    });
                }

                if (typeof callback === 'function') {
                    callback();
                }
            }

            setUpgradeEvents(function () {
                sQuery.cookie('ins-popup-' + campId + '-button-clicked', 1);
                setTimeout(function () {
                    sQuery('#btn-proceed-to-passenger').elementLoadComplete(function () {
                        setTimeout(function () {
                            angular.element(document.querySelectorAll('#btn-proceed-to-passenger')[0]).click();
                        }, 1000);
                    }, {
                        i: 500,
                        t: 5000
                    });
                }, 100);
            });
        });
    };

    self.fareType = function () {
        return sQuery('.fare-and-services-body-container.ng-scope.selected:eq(1) .ng-binding').text().substr(0, 5);
    };
    // OPT-9055 start
    self.getServicesHtml = function (services) {
        var serviceHtml = '';

        sQuery.each(services, function (index, service) {
            serviceHtml += '<div class="ins-service-area">' +
                (service.icon ? ('<img src="' + service.icon + '"></img>') : '') +
                '<span>' + service.text.replace('@price', currencyType + ' ' + spApi.insPriceDifference) +
                '</span>' +
                '</div>';
        });

        return serviceHtml;
    };
    // OPT-9055 end
    self.getPriceDifference = function () {
        if (sQuery('.right-section .fare-and-services-body-container.ng-scope ').length > 4) {
            if (spApi.popupToShow === 'value') {
                return self.calculatePrice(1, 4);
            }

            return self.calculatePrice(2, 5);
        } else if (spApi.popupToShow === 'value') {
            if (spApi.popupToShow === 'value') {
                return self.calculatePrice(1, 3);
            }

            return self.calculatePrice(2, 5);

        }
    };

    self.calculatePrice = function (inboundFareIndex, outBondFareIndex) {
        var priceDifference = 0;

        sQuery('.right-section .fare-and-services-body-container.ng-scope ').each(function (index, elem) {
            if (index === inboundFareIndex || index === outBondFareIndex) {
                priceDifference += parseInt(sQuery('.currency-value', elem).text());
            }
        });

        sQuery('.right-section .fare-and-services-body-container.ng-scope.selected ').each(function (index, elem) {
            priceDifference -= parseInt(sQuery('.currency-value', elem).text());
        });

        return priceDifference * self.getNumberOfPassengers();
    };

    self.getNumberOfPassengers = function () {
        var flightInfo = JSON.parse(sessionStorage['IBE.SEARCH_CRITERIA']);
        var totalPassengers = parseInt(flightInfo.adult || 0) +
            parseInt(flightInfo.infant || 0) +
            parseInt(flightInfo.child || 0);

        return totalPassengers;
    };

    self.setPopupCookie = function () {
        sQuery.cookie('ins-popup-showed', 1, {
            path: '/',
            domain: '.' + partner_site.host,
            expires: cookieExpires
        });
    };
    //OPT-6467 start

    if (!(JSON.parse(sQuery.cookie('ins-user-behaviors') || '{}').infantNumber > 0)) {
        self.construct();
    }
    //OPT-6467 end
}({}));