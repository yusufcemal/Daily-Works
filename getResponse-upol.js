spApi.CartAbandonment = function (options) {
    this.options = options;
    this.options.customFields = {};

    this.init();
};

spApi.CartAbandonment.prototype.init = function () {
    if (spApi.hasParameter('/checkout/cart/')) {
        this.sendMail(this.collectCustomFiedls());
    } else if (spApi.isOnAfterPaymentPage() || spApi.hasParameter('insTest')) {
        sQuery.cookie('ins-ajax-request-sent', null, {
            expires: -1,
            path: '/',
            domain: '.' + partner_site.host
        });

        this.sendMail({
            'purchased': 'true'
        });
    }
};

spApi.CartAbandonment.prototype.collectCustomFiedls = function () {
    var customFields = {
        'purchased': 'false',
        'total_quantity': 0,
        'ins_apr_visible_0': 'none',
        'ins_apr_visible_1': 'none',
        'ins_apr_visible_2': 'none',
        'ins_apr_visible_3': 'none',
        'ins_apr_visible_4': 'none'
    };

    var paidProducts = spApi.getPaidProducts();
    var productsLength = (paidProducts.length >= 5) ? 5 : paidProducts.length;
    var totalCartAmount = 0;
    var utm = '?utm_source=insider&utm_medium=email&utm_campaign=abandonment_' + spApi.getLang().split('_')[0] +
        '&utm_content=' + (spApi.isMobileBrowser() ? 'mobile' : 'desktop');

    for (var i = 0; i <= productsLength; i++) {
        if (typeof paidProducts[i] !== 'undefined') {
            customFields['ins_apr_name_' + i] = paidProducts[i].name;
            customFields['ins_apr_price_' + i] = paidProducts[i].price;
            customFields['ins_apr_img_' + i] = paidProducts[i].img;
            customFields['ins_apr_url_' + i] = paidProducts[i].url + utm;
            customFields['ins_apr_quantity_' + i] = paidProducts[i].quantity;
            customFields['ins_apr_visible_' + i] = 'table-row';
            customFields['ins_apr_currency_' + i] = spApi.getCurrency();
            totalCartAmount += paidProducts[i].price;
        }
    }

    customFields['fname'] = (this.options.name === 'New Subscriber' ? 'Jarir User!' : this.options.name);
    customFields['total_cart_amount'] = totalCartAmount;
    customFields['site_url'] = window.location.origin + utm;
    customFields['url'] = window.location.href + utm;

    return customFields;
};

spApi.CartAbandonment.prototype.sendMail = function (customFields) {
    var SendData = new spApi.GetResponse({
        apiKey: this.options.apiKey,
        campaignId: this.options.campaignId,
        partnerName: this.options.partnerName,
        email: this.options.email,
        name: this.options.name,
        customFields: customFields
    });

    SendData.send();
};

spApi.GetResponse = function (options) {
    this.options = options;
};

spApi.GetResponse.prototype.send = function () {
    this.matchCustomFields(this.options.customFields, this.emailRequest);
};

spApi.GetResponse.prototype.cancelMail = function () {
    this.matchCustomFields(this.options.customFields, this.emailRequest);
};

spApi.GetResponse.prototype.emailRequest = function (customFields) {
    sQuery.ajax({
        url: '//' + partnerName + '.api.sociaplus.com/ajax.php',
        data: {
            t: 'emailRequest',
            type: 'updateContact',
            provider: 'getResponse',
            contactInfo: {
                email: this.options.email,
                name: this.options.name,
                dayOfCycle: '0',
                campaign: {
                    campaignId: this.options.campaignId
                },
                customFieldValues: customFields
            }
        },
        success: function (data) {
            spApi.conLog(data);
        }
    });

};

spApi.GetResponse.prototype.matchCustomFields = function (customFields, callback) {
    var that = this;

    sQuery.ajax({
        url: '//' + partnerName + '.api.sociaplus.com/ajax.php',
        data: {
            t: 'emailRequest',
            type: 'getCustomFields',
            provider: 'getResponse'
        },
        success: function (results) {
            results = JSON.parse(results);

            var matchedCustomFields = [];

            sQuery.each(results, function (index, item) {
                if (typeof customFields[item.name] !== 'undefined') {
                    matchedCustomFields.push({
                        "customFieldId": item.customFieldId,
                        "value": [customFields[item.name]]
                    });
                }
            });

            callback.call(that, matchedCustomFields);
        }
    });
};

spApi.TriggerCartAbandonment = function () {
    var email = sQuery.cookie('ins-cart-abandonment-user-email') ||
        JSON.parse(spApi.localStorageGet('insUserData') || sQuery.cookie('insUserData') || '{}').email || '';
    var lang = spApi.getLang();
    var campId = (lang === 'en_US') ? 'Xg' : 'X1';
    var self = {};

    self.init = function () {
        self.events();

        if (spApi.validateEmail(email) && spApi.hasParameter('/checkout/cart/')) {
            self.sendEmail();
        }
    };

    self.events = function () {
        sQuery(document).on('change', '#email:visible, #email-address:visible', function () {
            var email = sQuery('#email:visible, #email-address:visible').val() || '';
        
            if(sQuery.cookie('ins-cart-abandonment-user-email') === null && spApi.validateEmail(email)){
                sQuery.cookie('ins-cart-abandonment-user-email', email, {expires: 365, path: '/', domain: '.' + partner_site.host});

                spApi.conLog('User Email Set for Cart Abandonment = ', email);
            }
        });

        sQuery(document).on('change.insGetName').on('change.insGetName', 'input#firstname', function () {
            var username = encodeURIComponent(sQuery('input#firstname').val() || '');

            sQuery.cookie('ins-cart-abandonment-userdata', username, {
                expires: 365,
                path: '/',
                domain: '.' + partner_site.host
            });
        });
    };

    self.sendEmail = function () {
        new spApi.CartAbandonment({
            campaignId: campId,
            email: email,
            name: decodeURIComponent(sQuery.cookie('ins-cart-abandonment-userdata') || 'New Subscriber')
        });

        sQuery.cookie('ins-ajax-request-sent', true, {
            expires: 1,
            path: '/',
            domain: '.' + partner_site.host
        });
    };

    self.init();
};

sQuery.cookie('ins-ajax-request-sent') === null;