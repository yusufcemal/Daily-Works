(function (self) {

    self.construct = function () {
        if (spApi.isOnAfterPaymentPage()) {
            self.setCookie('ins-search-data', null, -1);
        } else {
            self.setEvents();
        }
        //self.collectData();
    };

    self.setCookie = function (key, value, expires) {
        sQuery.cookie(key, value, {
            expires: expires,
            path: '/',
            domain: '.' + partner_site.host
        });
    };

    self.getData = function (type) {
        var date;
        var firstValue;
        var secondValue;
        var thirdValue;

        switch (type) {

            case 'journeyType':
                return sQuery('#journey_type_rt').exists() ?
                    (sQuery('#journey_type_rt#journey_type_rt:checked').exists() ? 'RT' : 'OW') :
                    (sQuery('input[name="triptype"][checked="checked"]#mod-return').exists() ? 'RT' : 'OW');

            case 'origin':
                firstValue = sQuery('.search_field.form_flying_from .ui-airportfield').attr('data-iata') || '';
                secondValue = sQuery('#flight-options .segment-code-txt:first').text().split('/').shift();
                return firstValue || secondValue || '';

            case 'destination':
                firstValue = sQuery('.search_field.form_flying_to .ui-airportfield').attr('data-iata') || '';
                secondValue = sQuery('#flight-options .segment-code-txt:first').text().split('/').pop();
                return firstValue || secondValue || '';

            case 'outbound':
                firstValue = sQuery('.search_field.deptdate input').val() ||  '';
                secondValue = sQuery('input[ng-model="mod.departureDate"]').val() || '';
                thirdValue = sQuery('.flights-info-block .sector-details:first .departure-arrival:first label:first i:last')
                    .text();

                date = firstValue || secondValue || thirdValue || '';

                if (date !== '' && date.indexOf(':') === -1) {
                    date = self.formatDate(date);
                } else if (date !== '' && date.indexOf(':') !== -1) { // Third value'da saatlerde bulunmakta
                    date = date + ':00';
                }

                return date;

            case 'inbound':
                firstValue = sQuery('.search_field.rtndate input').val() ||  '';
                secondValue = sQuery('input[ng-model="mod.returnDate"]').val() ||  '';
                thirdValue = sQuery('.flights-info-block .sector-details:last .departure-arrival:first label:first i:last')
                    .text();

                date = firstValue || secondValue || thirdValue || '';

                if (JSON.parse(sQuery.cookie('ins-search-data') || '{}').journeyType === 'OW') {
                    date = '';
                }

                if (date !== '' && date.indexOf(':') === -1) {
                    date = self.formatDate(date);
                } else if (date !== '' && date.indexOf(':') !== -1) { // Third value'da saatlerde bulunmakta
                    date = date + ':00';
                }

                return date;

            case 'adult':
                firstValue = sQuery('select[name="pax_adult"]').val() || '';
                secondValue = sQuery('#pax-picker #pax-dropdown-box .col-section-0 input').val() || '';

                return firstValue || secondValue || '';

            case 'child':
                firstValue = sQuery('select[name="pax_child"]').val() || '';
                secondValue = sQuery('#pax-picker #pax-dropdown-box .col-section-1 input').val() || '';

                return firstValue || secondValue || '';

            case 'infant':
                firstValue = sQuery('select[name="infant"]').val() || '';
                secondValue = sQuery('#pax-picker #pax-dropdown-box .col-section-2 input').val() || '';

                return firstValue || secondValue || '';

            case 'currency':
                firstValue = sQuery('.modify-search-currency .currency-txt .currency-txt').text();

                return firstValue || secondValue || '';

            case 'totalAmount':
                return parseFloat(sQuery('.sub-total .currency-value').text().replace(',', '') ||
                    sQuery('.price-block .currency-value').text().replace(',', '')) || '';

            case 'email':
                firstValue = sQuery('input[ng-model="passengerCtrl.contact.email"]').val() || '';

                return spApi.validateEmail(firstValue) ? firstValue : '';

            case 'countryCode':
                firstValue = sQuery('input[name="countryCode"]:first').val() ||
                    sQuery('input[name="countryCode"]:last').val() || '';

                return !isNaN(firstValue) ? firstValue : '';

            case 'telNumber':
                firstValue = sQuery('input[name="phone"]').val() || sQuery('input[name="mobile"]').val() || '';

                return !isNaN(firstValue) ? firstValue : '';

            case 'name':
                firstValue = sQuery('input[ng-model="passenger.firstName"]').val() || '';

                return firstValue || '';

            case 'surname':
                firstValue = sQuery('input[ng-model="passenger.lastName"]').val() ||  '';

                return firstValue || '';
        }

    };

    self.formatDate = function (date) {
        date = date.split('/');

        if (typeof date[0] !== 'undefined' && date[0].length === 2 &&
            typeof date[1] !== 'undefined' && date[1].length === 2 &&
            typeof date[2] !== 'undefined' && date[2].length === 4) {
            date = date[2] + '-' + date[1] + '-' + date[0] + ' 00:00:00';
        } else {
            date = '';
        }

        return date;
    };

    self.collectData = function () {
        if (spApi.storageData('ins-test-data') === 1) {
            debugger;
        }

        var searchData = JSON.parse(sQuery.cookie('ins-search-data') || '{}');

        searchData.journeyType = self.getData('journeyType') || searchData.journeyType || '';
        searchData.origin = self.getData('origin') || searchData.origin || '';
        searchData.destination = self.getData('destination') || searchData.destination || '';
        searchData.outbound = self.getData('outbound') || searchData.outbound || '';
        searchData.inbound = self.getData('inbound') || searchData.inbound || '';
        searchData.adult = self.getData('adult') || searchData.adult || '1';
        searchData.child = self.getData('child') || searchData.child || '0';
        searchData.infant = self.getData('infant') || searchData.infant || '0';
        searchData.passengers = searchData.adult + ' Adult(s); ' + searchData.child + ' Children(s); ' +
            searchData.infant + ' Infant(s)';
        searchData.currency = self.getData('currency') || searchData.currency || '';
        searchData.totalAmount = self.getData('totalAmount') || searchData.totalAmount || '';
        searchData.email = self.getData('email') || searchData.email || '';
        searchData.countryCode = self.getData('countryCode') || searchData.countryCode || '';
        searchData.telNumber = self.getData('telNumber') || searchData.telNumber || '';
        searchData.mobileNumber = searchData.telNumber !== '' ? ((searchData.countryCode !== '' ?
            '(' + searchData.countryCode + ')' : '') + searchData.telNumber) : '';
        searchData.name = self.getData('name') || searchData.name || '';
        searchData.surname = self.getData('surname') || searchData.surname || '';

        spApi.conLog('Collect', searchData);

        self.setCookie('ins-search-data', JSON.stringify(searchData), 1);
    };

    self.getCurrentStep = function () {
        return sQuery('.hidden-xs li.current i.number').text();
    };

    self.saveData = function () {
        var searchData = JSON.parse(sQuery.cookie('ins-search-data') || '{}');

        if ((spApi.validateEmail(searchData.email) ||
                (typeof searchData.mobileNumber !== 'undefined' && searchData.mobileNumber !== '')) &&
            (typeof searchData.origin !== 'undefined' && searchData.origin !== '') &&
            (typeof searchData.destination !== 'undefined' && searchData.destination !== '') &&
            (typeof searchData.outbound !== 'undefined' && searchData.outbound !== '')) {

            /* SD-39846 Start */
            sQuery(document).off('click.insider', '#cphBody_lnkbtnGuest, #lnkBack');
            sQuery.cookie('ins-abandoned-session', 1, {
                path: '/',
                domain: '.' + partner_site.host
            });
            /* SD-39846 End */

            spApi.conLog('Save', JSON.parse(sQuery.cookie('ins-search-data') || '{}'));

            searchData.stepOfAbandonment = self.getCurrentStep();
            searchData.userId = sQuery.cookie('spUID') || '';
            searchData.pageSubdomain = spApi.isMobileBrowser() ? 'm' : '';

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
                    self.setCookie('ins-search-data', null, -1);
                }
            });
        }
    };

    self.checkStep = function () {
        return ['1','2','3','4','5'].indexOf(self.getCurrentStep()) > -1;
    };

    self.setEvents = function () {
        sQuery(document).on('click', '.flight-search-panel-row .search-button,' +
            ' .modif-search #btn-search-modify-search,' +
            ' #btn-search-modify-search, .Continue-to-Extras',
            function () {
                if(self.checkStep()) {
                    spApi.conLog('in first...');
                    self.collectData();
                }
            });

        sQuery(document).on('touchstart', '.right-section-fare a', function () {
            sQuery('.flight-log').elementLoadComplete(function () {
                if(self.checkStep()) {
                    spApi.conLog('in second...');
                    self.collectData();
                }
            });
        });

        sQuery(document).on('touchstart', '.curruny-wrapper:not(.ng-hide) li', function () {
            setTimeout(function () {
                if(self.checkStep()) {
                    self.collectData();
                }
            }, 500);
        });

        sQuery(document).on('focus blur click change keyup', 'input[name="telNumber"],' +
            ' input[ng-model="passenger.firstName"],' +
            ' input[ng-model="passenger.lastName"],' +
            ' input[ng-model="passengerCtrl.contact.email"]',
            function () {
                if(self.checkStep()) {
                    self.collectData();
                }
            });

        sQuery(document).on('click.insider', '[ui-view="topNav"] isa-progress a:first, #lnkBack', function () {
            if (sQuery.cookie('ins-abandoned-session') === null && spApi.hasParameter('passenger')) {
                if(self.checkStep()) {
                    self.collectData();
                    self.saveData();
                }
            }
        });
    };

    return self.construct();

})({});