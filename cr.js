(function (self) {
    spApi.necessaryCampaignFunctions = {};

    var campaignToken = 'K9';
    var campaignId = '34';
    var partnerName = 'liontravel';
    var email = '';
    var source = '';
    var campaignValues = [{
        variationId: 8,
        submitButtonSelector: '#link-button-1529950029190',
        emailFieldSelector: '#option-input-6049260531323',
        checkboxSelector: '#option-5132966210409',
        source: 'Exit Intent | Desktop',
        clickVariation: 'insExitIntentDesktop'
    }, {
        variationId: 25,
        submitButtonSelector: '#ins-link-button-1454703860695',
        emailFieldSelector: '#ins-option-input-3844348745057',
        checkboxSelector: '#ins-option-input-3844348745051',
        source: 'Exit Intent | Mobile',
        clickVariation: 'insExitIntentMobile'
    }, {
        variationId: 45,
        submitButtonSelector: '#link-button-1531393290206',
        emailFieldSelector: '#option-3132395315313',
        checkboxSelector: '#option-8433257643321',
        source: 'Desktop|Sticky Hidden EmailCollectionBox',
        clickVariation: 'insEmailCollection'
    }, {
        variationId: 39,
        submitButtonSelector: '#ins-link-button-1454703860665',
        emailFieldSelector: '#ins-option-input-8851911844858',
        checkboxSelector: '#ins-option-input-8851911844862',
        source: 'Lead Generation Button| Mobile',
        clickVariation: 'insleadGeneration'
    }, ];

    self.construct = function () {
        self.findTheActiveCampaign();
    };

    self.findTheActiveCampaign = function () {
        sQuery.each(campaignValues, function (key, value) {
            self.findLoadedElement(value);
        });
    };

    self.findLoadedElement = function (campaignInfo) {
        if (campaignInfo.variationId === 45 || campaignInfo.variationId === 8) {
            sQuery('.sp-advanced-css-' + campaignInfo.variationId + ' .sp-fancybox-iframe')
                .elementLoadComplete(function () {
                    self.setInfoCampaignEvents(campaignInfo);
                });
        } else if (campaignInfo.variationId === 25 || campaignInfo.variationId === 39) {
            sQuery(campaignInfo.submitButtonSelector).elementLoadComplete(function () {
                self.setLeadCollectionCampaignEvents(campaignInfo);
            });
        }
    };

    self.setInfoCampaignEvents = function (infoCampaign) {
        sQuery('.sp-fancybox-iframe').pm(function (data) {
            var campaignId = '34';

            sQuery(document).off('click.' + data.clickVariation + campaignId, data.submitButtonSelector)
                .on('click.' + data.clickVariation + campaignId, data.submitButtonSelector, function () {
                    email = sQuery(data.emailFieldSelector).val() || '';
                    source = data.source;

                    if ((sQuery(data.checkboxSelector)[0] || {}).checked) {
                        sQuery(window).pm(function (info) {
                            if (spApi.necessaryCampaignFunctions.checkEmail(info.email)) {
                                spApi.necessaryCampaignFunctions.setValues(info.source, info.email);
                            }
                        }, undefined, {
                            email: email,
                            source: source
                        });
                    }
                });
        }, undefined, infoCampaign);
    };

    self.setLeadCollectionCampaignEvents = function (leadCollectionCampaign) {
        sQuery(leadCollectionCampaign.submitButtonSelector).off('click.' + leadCollectionCampaign.clickVariation +
                campaignId)
            .on('click.' +
                leadCollectionCampaign.clickVariation + campaignId,
                function () {
                    email = sQuery(leadCollectionCampaign.emailFieldSelector).val() || '';
                    source = leadCollectionCampaign.source;

                    if (spApi.necessaryCampaignFunctions.checkEmail(email) &&
                        (sQuery(leadCollectionCampaign.checkboxSelector)[0] || {}).checked) {
                        spApi.necessaryCampaignFunctions.setValues(source, email);
                    }
                });
    };

    spApi.necessaryCampaignFunctions.checkEmail = function (email) {
        return spApi.validateEmail(email);
    };

    spApi.necessaryCampaignFunctions.setValues = function (source, email) {
        var userInfo = [];
        var customFields = [{
            customFieldId: 'v2k',
            value: [source],
        }];

        sQuery.each(customFields, function () {
            if (this.value[0] !== '') {
                userInfo.push({
                    customFieldId: this.customFieldId,
                    value: this.value
                });
            }
        });

        spApi.necessaryCampaignFunctions.addContactToGetResponse(email, userInfo);
    };

    spApi.necessaryCampaignFunctions.addContactToGetResponse = function (email, customFieldsArray) {
        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            type: 'POST',
            data: {
                t: 'emailRequest',
                type: 'updateContact',
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
            }
        });
    };

    self.construct();
})({});