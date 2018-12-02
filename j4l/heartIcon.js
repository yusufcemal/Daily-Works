(function (self) {
    self.cookieClickedDuration = 30;
    self.cookieClosedDuration = 15;
    self.variationId = spApi.userSegments[24] || 'Test';

    self.init = function () {
        self.reset();
        self.addHtml();
        self.changeOffsetDynamically();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('#ins-heart-banner').remove();
    };

    self.addHtml = function () {
        var html = '<div id="ins-heart-banner">' +
            '<img src="https://image.useinsider.com/j4l/c42/H9kneezKd47Ta1LEFTAc1540310987.png"' +
            'class="ins-heart-banner-button">' +
            '<div class="ins-heart-banner-close">X</div>' +
            '</div>';

        sQuery('body').append(html);
    };

    self.changeOffsetDynamically = function () {
        var joinButtonOffset = sQuery('.main-header__action-btn.main-header__action-btn--join-only_mainpage').offset();

        sQuery('#ins-heart-banner').css('left', (joinButtonOffset.left - 40) + 'px');
        sQuery('#ins-heart-banner').css('top', (joinButtonOffset.top + 40) + 'px');
    };

    self.setEvents = function () {
        sQuery(window).off('resize.insWindowResize').on('resize.insWindowResize', function () {
            self.changeOffsetDynamically();
        });

        sQuery('#ins-heart-banner img').off('click').on('click', function () {
            sQuery('.register-global-btn:first').trigger('click.insJoinButton');

            self.setCookie(self.cookieClickedDuration);
        });

        sQuery('.register-global-btn:first').off('click.insJoinButton').on('click.insJoinButton', function () {
            spApi.sendCustomGoal(24, 19);

            self.reset();
        });

        sQuery('.ins-heart-banner-close').off('click').on('click', function () {
            sQuery('#ins-heart-banner').fadeOut();

            self.setCookie(self.cookieClosedDuration);
        });
    };

    self.setCookie = function (durationTime) {
        sQuery.cookie('ins-heart-banner-shown', 1, {
            expires: durationTime,
            path: '/',
            domain: '.' + partner_site.host
        });
    };

    spApi.sendCustomGoal = function (builderId, goalId) {
        var goalOfCamp = ((spApi.personalizationCamps[builderId] || [])['goalBuilderList'] || [])[goalId] || '';

        if (typeof goalOfCamp === 'undefined') {
            return false;
        }

        if (goalOfCamp.type === 'rules') {
            goalOfCamp.goalList[0]['selectorString'] = 'true';

            spApi.addGoalTracking(true);
        }
    };

    self.init();
}({}));