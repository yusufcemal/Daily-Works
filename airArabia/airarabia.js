spApi.saveDataCollection = {
    setSpWorkerSessionStorage: function (key, value) {
        var storageData = {
            key: key,
            value: value
        };

        sQuery('#spWorker').pm(function (data) {
            spApi.sessionStorageSet(data.key, data.value);
        }, undefined, storageData);
    }
};

(function (self) {

    self.construct = function () {
        if (self.checkStep()) {
            self.setEvents();
        }
    };

    self.checkStep = function () {
        return ['1', '2', '3', '4', '5'].indexOf(self.getCurrentStep()) > -1;
    };

    self.getCurrentStep = function () {
        return sQuery('.hidden-xs li.current i.number').text();
    };

    self.setEvents = function () {
        sQuery(document).on('click', '.search-button', function () {
            self.collectData();
        });

        sQuery(document).on('click', '#btn-proceed-to-passenger', function () {
            sQuery.cookie(
                'ins-abandoned-session-price',
                sQuery('.sub-total .fare-value').text().replace(/[^0-9.]/g, '') || '', {
                    expires: 1,
                    path: '/',
                    domain: '.' + partner_site.host
                });

            self.collectData();
        });

        sQuery(document)
            .on('focus blur click change keyup',
                '[name="countryCode"], [name="phone"], [name="mobile"], [name="email"], [name="userForm_0"] [name="firstName"], [name="userForm_0"] [name="lastName"]',
                function () {
                    self.collectData();
                });

        self.customBounce(function () {
            self.saveData();
        });
    };

    self.collectData = function () {
        var searchData = {};

        var pageType = spApi.hasParameter('/fare/') ?
            'fare' : spApi.hasParameter('/passenger/') ? 'passenger' : '';
        var dataObject = self.getDataLayerObject(pageType);

        if (dataObject) {
            var flightDetails = (
                typeof dataObject.transactionProducts !== 'undefined' &&
                typeof (dataObject.transactionProducts[1] || '').searchCriteria !== 'undefined'
            ) ? (dataObject.transactionProducts[1] || '').searchCriteria : '';

            searchData.journeyType = flightDetails.journeyType === 'RETURN' ? 'RT' : 'OW';
            searchData.origin = flightDetails.origin || '';
            searchData.destination = flightDetails.destination || '';
            searchData.outbound = self.formatDate(flightDetails.depDate);
            searchData.inbound = searchData.journeyType == 'RT' ? self.formatDate(flightDetails.retDate) : '';
            searchData.adult = flightDetails.adultCount || '1';
            searchData.child = flightDetails.childCount || '0';
            searchData.infant = flightDetails.infantCount || '0';
            searchData.passengers = searchData.adult + ' Adult(s); ' +
                searchData.child + ' Children(s); ' +
                searchData.infant + ' Infant(s)';
            searchData.currency = flightDetails.currency || '';
            searchData.totalAmount = sQuery.cookie('ins-abandoned-session-price') || '';
            searchData.email = self.getData('email') || '';
            searchData.countryCode = self.getData('countryCode') || '';
            searchData.telNumber = self.getData('telNumber') || '';
            searchData.mobileNumber = searchData.telNumber !== '' ?
                (
                    (searchData.countryCode !== '' ? '(' + searchData.countryCode + ')' : '') + searchData.telNumber
                ) : '';
            searchData.name = self.getData('name') || '';
            searchData.surname = self.getData('surname') || '';

            spApi.saveDataCollection.setSpWorkerSessionStorage('ins-search-data', JSON.stringify(searchData));
        }
    };

    self.getDataLayerObject = function (pageType) {
        var infoObject;

        sQuery(dataLayer).each(function (index, element) {
            if (typeof element.event !== 'undefined') {
                if (element.event === pageType) {
                    infoObject = this;
                }
            }
        });

        return infoObject;
    };

    self.formatDate = function (date) {
        // entered format: 13-09-2018
        // wanted format: 2018-09-13 00:00:00
        date = date.split('-');

        if (typeof date[0] !== 'undefined' && date[0].length === 2 &&
            typeof date[1] !== 'undefined' && date[1].length === 2 &&
            typeof date[2] !== 'undefined' && date[2].length === 4) {
            date = date[2] + '-' + date[1] + '-' + date[0] + ' 00:00:00';
        } else {
            date = '';
        }

        return date;
    };

    self.getData = function (type) {
        var value;

        switch (type) {
            case 'email':
                value = sQuery('[name="email"]:visible').val();

                return spApi.validateEmail(value) ? value : '';
            case 'countryCode':
                value = sQuery('[name="countryCode"]').val() || '';

                return !isNaN(value) ? value : '';
            case 'telNumber':
                value = sQuery('input[name="phone"]').val() || sQuery('input[name="mobile"]').val() || '';

                return !isNaN(value) ? value : '';
            case 'name':
                return sQuery('[name="userForm_0"] [name="firstName"]').val() || '';
            case 'surname':
                return sQuery('[name="userForm_0"] [name="lastName"]').val() || '';
        }
    };

    self.customBounce = function (callback) {
        window.insIsBounced = false;

        if (typeof callback === 'function') {
            sQuery(document).on('mouseleave.insider', function (event) {
                if (sQuery.cookie('ins-abandoned-session') === null &&
                    (event.pageY - sQuery(window).scrollTop()) <= 0 && !window.insIsBounced) {
                    callback();
                }
            });
        }
    };

    self.saveData = function () {
        sQuery('#spWorker').pm(function () {
            var searchData = JSON.parse(spApi.sessionStorageGet('ins-search-data') || '{}');

            if (spApi.sessionStorageGet('ins-search-data') !== null) {

                sQuery(window).pm(function (searchData) {
                    if (
                        (
                            spApi.validateEmail(searchData.email) ||
                            (typeof searchData.mobileNumber !== 'undefined' && searchData.mobileNumber !== '')
                        ) &&
                        (typeof searchData.origin !== 'undefined' && searchData.origin !== '') &&
                        (typeof searchData.destination !== 'undefined' && searchData.destination !== '') &&
                        (typeof searchData.outbound !== 'undefined' && searchData.outbound !== '') &&
                        sQuery.cookie('ins-abandoned-session') === null
                    ) {

                        window.insIsBounced = true;

                        sQuery(document).off('mouseleave.insider');

                        sQuery.cookie('ins-abandoned-session', 1, {
                            path: '/',
                            domain: '.' + partner_site.host
                        });

                        searchData.stepOfAbandonment = sQuery('.hidden-xs li.current i.number').text();
                        searchData.userId = sQuery.cookie('spUID') || '';
                        searchData.pageSubdomain = window.location.origin.indexOf('//m.airarabia.com') > -1 ? 'm' : '';

                        sQuery.ajax({
                            url: '//' + partnerName + '.panel.sociaplus.com/cron/webServices/airarabia/helper.php?type=save',
                            type: 'POST',
                            data: {
                                journeyType: searchData.journeyType,
                                origin: searchData.origin,
                                destination: searchData.destination,
                                outbound: searchData.outbound,
                                inbound: searchData.inbound,
                                passengers: searchData.passengers,
                                totalAmount: searchData.totalAmount,
                                currency: searchData.currency,
                                stepOfAbandonment: searchData.stepOfAbandonment,
                                name: searchData.name,
                                surname: searchData.surname,
                                mobileNumber: searchData.mobileNumber,
                                email: searchData.email,
                                userId: searchData.userId,
                                pageSubdomain: searchData.pageSubdomain
                            },
                            success: function (response) {
                                spApi.conLog(response);
                            }
                        });
                    }
                }, undefined, searchData);
            }
        });
    };

    return self.construct();
})({});