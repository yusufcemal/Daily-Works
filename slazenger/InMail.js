(function (self) {
    self.variationId = '';
    self.campId = spApi.userSegments[self.variationId];
    self.customFieldNames = ['isim', 'soyisim', 'sourceOfData'];
    self.campaignToken = 'Vf';

    self.init = function () {
        self.setEvents();
    };

    self.setEvents = function () {
        sQuery('.userMail > #chkMailPermission').off('click.ins7128').on('click.ins7128', function () {
            if (sQuery(this).attr('checked') === 'checked') {
                self.getCustomFieldIds();
            }
        });

        sQuery('#btnMailKaydet').off('click.ins7128').on('click.ins7128', function () {
            var userEmail = sQuery('#txtbxNewsletterMail').val() || '';

            self.sendCustomFields('updateContact', [], userEmail);
        });
    };

    self.getCustomFieldIds = function () {
        var userEmail = sQuery('[name="formQuickMember"] input#txtQuickEmail') || '';

        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            data: {
                provider: 'getResponse',
                t: 'emailRequest',
                type: 'getCustomFields'
            },
            success: function (response) {
                var userInfo = self.getUserData();
                var customFieldsResponse = JSON.parse(response || '{}');
                var customFieldId = '';

                userInfo.forEach(function (field, index) {
                    customFieldId = self.getIdFromArray(customFieldsResponse, self.customFieldNames[index]);

                    field.customFieldId = customFieldId;

                    return field;
                });

                self.sendCustomFields('updateContact', userInfo, userEmail);
            }
        });
    };

    self.getUserData = function () {
        var userName = sQuery('[name="formQuickMember"] input#txtQuickName').val() || '';
        var userSurname = sQuery('[name="formQuickMember"] input#txtQuickLastName').val() || '';
        var resourceType = '';

        var userInfo = [{
            'customFieldId': '',
            'value': [userName],
        }, {
            'customFieldId': '',
            'value': [userSurname],
        }, {
            'customFieldId': '',
            'value': [resourceType],
        }];

        return userInfo;
    };

    self.getIdFromArray = function (customFields, attributeName) {
        var id = '';

        sQuery.each(customFields, function (index, attribute) {
            if (attribute.name === attributeName) {
                id = attribute.customFieldId;

                return;
            }
        });

        return id;
    };

    self.sendCustomFields = function (type, customFields, userEmail) {
        sQuery.ajax({
            url: '//' + partnerName + '.api.useinsider.com/ajax.php',
            type: 'POST',
            data: {
                t: 'emailRequest',
                type: type,
                provider: 'getResponse',
                contactInfo: {
                    email: userEmail,
                    name: 'New Subscriber',
                    dayOfCycle: '0',
                    campaign: {
                        campaignId: self.campaignToken
                    },
                    customFieldValues: customFields
                }
            },

            success: function () {
                userInfo = [];
            }
        });
    };

    self.init();
})({});