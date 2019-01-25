(function (self) {
    var builderId = 232;
    var variationId = spApi.userSegments[builderId] || 'Development';
    var notifications = [{
            description: 'Kampanya 1',
            url: 'https://www.yenibiris.com/'
        },
        {
            description: ' Kampanya 2',
            url: 'https://www.yenibiris.com/'
        },
        {
            description: 'Kampanya 3',
            url: 'https://www.yenibiris.com/'
        },
        {
            description: 'Kampanya 4',
            url: 'https://www.yenibiris.com/'
        }
    ];
    var notificationLength = notifications.length;

    self.init = function () {
        self.reset();

        sQuery('.navWrapper:visible').elementLoadComplete(function () {
            self.appendContent();
            self.setCountVisibility();
            self.appendNotificationInList();
            self.setNotificationClickEvents();
            self.setOverlayClickEvents();
            self.setNotificationPosition();
            self.setGoalEvents();
        }, {
            i: 100,
            t: 15000
        });
    };

    self.reset = function () {
        sQuery('.ins-class-notification-139').remove();
        sQuery('.ins-notification-list-139').remove();
        sQuery('.ins-notification-list-overlay-139').remove();
    };

    self.appendContent = function () {
        sQuery('.navWrapper:visible')
            .prepend(
                '<div class="ins-class-notification-139 sp-custom-' + variationId + '-1">' +
                '<span class="ins-class-notification-count-139">' + notificationLength + '</span>' +
                '<div class="ins-notification-list-139"></div></div>' +
                '<div class="ins-notification-list-overlay-139"></div>'
            );
    };

    self.setCountVisibility = function () {
        if (spApi.storageData('ins-class-notification-read') !== null) {
            sQuery('.ins-class-notification-count-139').hide();
        }
    };

    self.appendNotificationInList = function () {
        sQuery('.ins-notification-list-139')
            .append(
                '<div class="title">Announcements</div>'
            );
        sQuery.each(notifications, function (index, element) {
            sQuery('.ins-notification-list-139')
                .append(
                    '<a href="' + element.url + '" class="ins-custom-' + variationId + '-' + index + '">' +
                    element.description + '</a>'
                );
        });
    };

    self.setNotificationClickEvents = function () {
        sQuery('.ins-class-notification-139').off('click.insNotificationClick' + variationId)
            .on('click.insNotificationClick' + variationId, function () {
                if (spApi.storageData('ins-class-notification-read') === null) {
                    sQuery('.ins-class-notification-count-139').hide();

                    spApi.storageData('ins-class-notification-read', '1', {
                        expires: 1
                    });
                }

                sQuery('.ins-notification-list-139').toggle();

                if (sQuery('.ins-notification-list-139').css('display') === 'block') {
                    sQuery(this).addClass('active');
                    sQuery('.ins-class-notification-count-139').addClass('ins-count-hidden');

                    sQuery('.ins-notification-list-overlay-139').show();
                } else {
                    sQuery(this).removeClass('active');
                    sQuery('.ins-class-notification-count-139').removeClass('ins-count-hidden');

                    sQuery('.ins-notification-list-overlay-139').hide();
                }
            });
    };

    self.setOverlayClickEvents = function () {
        sQuery('.ins-notification-list-overlay-139').off('click.insOverlayClick' + variationId)
            .on('click.insOverlayClick' + variationId, function () {
                if (spApi.storageData('ins-class-notification-read') === null) {
                    sQuery('.ins-class-notification-count-139').hide();

                    spApi.storageData('ins-class-notification-read', '1', {
                        expires: 1
                    });
                }

                sQuery('.ins-class-notification-139').removeClass('active');

                sQuery('.ins-notification-list-139').hide();
                sQuery('.ins-notification-list-overlay-139').hide();
            });
    };

    self.setNotificationPosition = function () {
        sQuery(window).off('resize.ins' + variationId).on('resize.ins' + variationId, function () {
            if (sQuery(window).width() < 992) {
                sQuery('.ins-class-notification-139').prependTo(sQuery('.topMenu .searchHoverArea:visible').parent());
            } else {
                sQuery('.ins-class-notification-139').prependTo(sQuery('.navWrapper:visible'));
            }
        });
    };

    self.init();
})({});