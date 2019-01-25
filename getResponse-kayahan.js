(function (self) {
    var campaignToken = 'xx';
    var userInfo = [];

    self.construct = function () {
        self.setEvents();
    };

    self.setEvents = function () {
        sQuery('#mc-embedded-subscribe').off('click.insClick6182').on('click.insClick6182', function () {
            var email = sQuery('#mce-EMAIL').val() || '';

            self.sendGetResponseIfMailIsValid(email);
        });

        sQuery('.step-footer-continue-btn').off('click.insClick6182').on('click.insClick6182', function () {
            var email = sQuery('#checkout_user_email').val() || '';

            self.setValues();
            self.sendGetResponseIfMailIsValid(email);
        });
    };

    self.setValues = function () {
        var fullname = sQuery('#billing_address_full_name').val() || '';
        var phone = sQuery('#billing_address_phone').val() || '';
        var address = sQuery('#billing_address_address1').val() || '';
        var city = sQuery('#customer_shipping_province > option:selected').val() !== 'null' ?
            sQuery('#customer_shipping_province > option:selected').text() : '';

        userInfo = [{
            'customFieldId': 'vE3',
            'value': [fullname],
        }, {
            'customFieldId': 'vEP',
            'value': [phone],
        }, {
            'customFieldId': 'vEZ',
            'value': [address],
        }, {
            'customFieldId': 'vEt',
            'value': [city],
        }];
    };

    self.sendGetResponseIfMailIsValid = function (email) {
        if (spApi.validateEmail(email)) {
            self.addContactToGetResponse('updateContact', email, userInfo);
        }
    };

    self.addContactToGetResponse = function (type, email, customFieldsArray) {
        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            type: 'POST',
            data: {
                t: 'emailRequest',
                type: type,
                provider: 'getResponse',
                contactInfo: {
                    email: email,
                    name: 'New Subscriber',
                    dayOfCycle: '0',
                    campaign: {
                        campaignId: campaignToken
                    },
                    customFieldValues: customFieldsArray
                }
            },
            success: function () {
                userInfo = [];
            }
        });
    };

    self.construct();
})({});

true;

//GET CUSTOM FIELDS
sQuery.ajax({
    url: '//' + partnerName + '.api.useinsider.com/ajax.php',
    data: {
        provider: 'getResponse',
        t: 'emailRequest',
        type: 'getCustomFields'
    },
    success: function (results) {
        results = JSON.parse(results);

        console.log(results);
    }
});