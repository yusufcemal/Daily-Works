spApi.CartAbandonment = function (campaignToken) {
    'use strict';
    // OPT-9165-START  
    var productList = JSON.parse(spApi.storageData('ins-cart-product-list') || '{}').productList || [];
    // OPT-9165-END
    var isOnCartPage = spApi.isOnCartPage();
    var isOnAfterPaymentPage = spApi.isOnAfterPaymentPage() || spApi.hasParameter('insTestPurchase');

    this.init = function () {
        var userInformation = this.getUserInformation();

        if (spApi.validateEmail(userInformation.email)) { // OPT-9165-SINGLE LINE- CONDITION REMOVED
            this.matchCustomFields(this.getCustomFields(), function (customFields) {
                this.sendAjaxRequest(userInformation, customFields);
            }.bind(this));
        }
    };

    this.getUserInformation = function () {
        return {
            email: JSON.parse(spApi.storageData('insUserData') || sQuery.cookie('insUserData') || '{}').email || ''
        };
    };

    this.matchCustomFields = function (customFields, callback) {
        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            data: {
                t: 'emailRequest',
                provider: 'getResponse',
                type: 'getCustomFields'
            },
            success: function (results) {
                results = JSON.parse(results);

                var matchedCustomFields = [];

                sQuery.each(results, function (index, item) {
                    if (
                        typeof customFields[item.name] !== 'undefined' &&
                        customFields[item.name] !== '' &&
                        customFields[item.name] !== null
                    ) {
                        matchedCustomFields.push({
                            customFieldId: item.customFieldId,
                            value: [customFields[item.name]]
                        });
                    }
                });

                if (typeof callback === 'function') {
                    callback(matchedCustomFields);
                }
            }
        });
    };

    this.getCustomFields = function () {
        var language = spApi.getLang();

        if (isOnAfterPaymentPage || (isOnCartPage && productList.length === 0)) {
            return {
                ins_apr_purchased: 'true',
                ins_apr_language: language
            };
        }

        var customFields = {
            ins_apr_purchased: 'false',
            ins_apr_visibility_0: 'none',
            ins_apr_visibility_1: 'none',
            ins_apr_visibility_2: 'none',
            utm: '?utm_source=insider&utm_medium=email&utm_campaign=' + language,
            ins_apr_language: language,
            ins_name: spApi.isUserLoggedIn() ? 
                sQuery.trim(sQuery('.site-my-mac-v1 .first-name').text()) : 'Hi MAC Addict' // OPT-9165- Single Line
        };

        productList.slice(0, 3).forEach(function (product, index) {
            if (typeof productList[index] !== 'undefined') {
                customFields['ins_apr_name_' + index] = product.name;
                customFields['ins_apr_price_' + index] = product.price;
                customFields['ins_apr_url_' + index] = product.url;
                customFields['ins_apr_img_' + index] = product.img.replace('124x163', '640x600')
                    .replace('124x163', '640x600');
                customFields['ins_apr_visibility_' + index] = 'block';
            }
        });

        return customFields;
    };

    this.sendAjaxRequest = function (userInformation, customFields) {
        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            data: {
                t: 'emailRequest',
                type: 'updateContact',
                provider: 'getResponse',
                contactInfo: {
                    email: userInformation.email,
                    dayOfCycle: '0',
                    campaign: {
                        campaignId: campaignToken
                    },
                    customFieldValues: customFields
                }
            },
            success: function (data) {
                spApi.conLog(data);
            }
        });
    };

    return this.init();
};

true;