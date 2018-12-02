spApi.customSurveyExitIntent = function (config) {
    spApi.getCamp(config.infoCampId).show(function () {
        sQuery('.sp-advanced-css-' + config.infoCampId + ' .sp-fancybox-iframe').pm(function (config) {
            var leftOptionButtonSelector = config.selector['leftOptionButton'];
            var rightOptionButtonSelector = config.selector['rightOptionButton'];
            var destinationInputSelector = config.selector['destinationInput'];
            var flightTimeInputSelector = config.selector['flightTimeInput'];
            var questionTitleSelector = config.selector['questionTitle'];

            var init = function () {
                addCustomCampaignStyling();
                addInputPlaceHolder();
                addCustomClass();
                setEvents();
            };

            var addCustomCampaignStyling = function () {
                sQuery(destinationInputSelector + ',' + flightTimeInputSelector).addClass('ins-info-inputs-styling');
                sQuery(questionTitleSelector).text('');
            };

            var addInputPlaceHolder = function () {
                sQuery(destinationInputSelector).attr('placeholder', config.placeholderText['Destination']);
                sQuery(flightTimeInputSelector).attr('placeholder', config.placeholderText['Flight-time']);
            };

            var addCustomClass = function () {
                sQuery('#' + leftOptionButtonSelector).addClass('sp-custom-' + config.infoCampId);
                sQuery('#' + rightOptionButtonSelector).addClass('sp-custom-' + config.infoCampId);
            };

            var setEvents = function () {
                sQuery('a[id*="link-button-"]')
                    .off('click.insEngageButton' + config.infoCampId)
                    .on('click.insEngageButton' + config.infoCampId,
                        function (event) {
                            var data = {
                                'dataKey': 'insSurveyResult',
                                'dataValues': '',
                                'expireTime': 183
                            };
                            var clickedButtonId = (sQuery(event.currentTarget).attr('id') || '');

                            if (clickedButtonId === leftOptionButtonSelector) {
                                data.dataValues = 'High Price';

                                setLocalStorageValue(data);
                            } else if (clickedButtonId === rightOptionButtonSelector) {
                                data.dataValues = 'No Flight';

                                setLocalStorageValue(data);
                            }
                        });

                var iosVersion = getIosVersion();

                if (iosVersion && iosVersion[0] === 11 && iosVersion[1] < 3) {
                    setIosModalFixEvents();
                    // OPT - 6103 - START 
                } else if (iosVersion && iosVersion[0] === 11 && iosVersion[1] >= 3) {
                    setIosModalFixEventsForOPT6103();
                }
                // OPT - 6103 - END
            };

            var setLocalStorageValue = function (data) {
                sQuery(window).pm(function (data) {
                    spApi.storageData(data.dataKey, JSON.stringify(data.dataValues), {
                        expires: data.expireTime,
                        path: '/',
                        domain: '.' + partner_site.host,
                    });
                }, undefined, data);
            };

            var getIosVersion = function () {
                if (/iP(hone|od|ad)/.test(navigator.platform)) {
                    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                }

                return false;
            };
            // OPT - 6103 - START
            var setIosModalFixEventsForOPT6103 = function () {
                sQuery('#option-3225918597817, #option-0315851859339').off('focus.ins6103')
                    .on('focus.ins6103', function () {
                        sQuery(window).pm(function () {
                            sQuery('body').css('position', 'fixed');

                            spApi.conLog('iosCursorFix', 'in focus action');
                        });
                    });

                sQuery('#option-3225918597817, #option-0315851859339').off('blur.ins6103')
                    .on('blur.ins6103', function () {
                        sQuery(window).pm(function () {
                            sQuery('body').css('position', '');
                            
                            spApi.conLog('iosCursorFix', 'in blur action');
                        });
                    });
            };
            // OPT - 6103 - END
            var setIosModalFixEvents = function () {
                sQuery('#option-3138599692421, #option-1399346358851')
                    .on('focus', function (event) {
                        console.log('one of this element is focused');
                        setTimeout(function () {
                            sQuery(window).pm(function () {
                                sQuery('.sp-advanced-css-241').addClass('ins-absoluted-input');
                                //sQuery('.sp-advanced-css-241').addClass('sp-advanced-css-241-2');
                            }, undefined);
                            // sQuery('#page-1539815797518').css({
                            //     'position': 'absolute',
                            //     'transform': 'translate(-50%, 0)'
                            // });

                            //rearrangeModalPosition(event.target, '#ins-hemlak-newsletter');
                        }, 200);
                    })
                    .on('blur', function (event) {
                        console.log('one of this element is blured');
                        sQuery(window).pm(function () {
                            sQuery('.sp-advanced-css-241').removeClass('ins-absoluted-input');
                        }, undefined);
                        // sQuery('#page-1539815797518').css({
                        //     'position': 'fixed',
                        //     'top': '50%',
                        //     'transform': 'translate(-50%, -50%)'
                        // });
                    });
            };

            var rearrangeModalPosition = function (element, container) {
                element = sQuery(element);
                var elementTop = element.offset().top;
                var elementHeight = element.height();

                container = sQuery(container);
                var containerTop = container.offset().top;
                var containerHeight = container.height();

                var windowScrollTop = sQuery(window).scrollTop();
                var windowHeight = sQuery(window).height() / 2;

                if ((elementTop < windowScrollTop) ||
                    ((elementTop + elementHeight) > (windowScrollTop + windowHeight))) {
                    var diff = elementTop - containerTop;
                    var top = windowScrollTop + (windowHeight / 2) + 50;

                    sQuery(container).css({
                        'top': top - diff
                    });
                }
            };

            init();
        }, undefined, config);
    });

    setTimeout(function () {
        spApi.showCamp(spApi.getCamp(config.infoCampId).camp);
    }, 500);
};

spApi.checkSurveyShowConditions = function (campaignEngagementDetails) {
    var isConditionsFulfilled = false;
    var yearInSeconds = 31556926;
    var weekInSeconds = 604800;
    var sixMonthsInSeconds = 15780000;
    var currentTime = spApi.getTime();

    if (sQuery.isEmptyObject(campaignEngagementDetails)) {
        isConditionsFulfilled = true;
    } else if ((campaignEngagementDetails['step1-displayed'] || '') === true) {
        if (
            (
                (campaignEngagementDetails['joined'] || '') === true &&
                currentTime - (campaignEngagementDetails['joDa'] || '') > sixMonthsInSeconds
            ) ||
            (
                (campaignEngagementDetails['closed'] || '') === true &&
                currentTime - (campaignEngagementDetails['clDa'] || '') > weekInSeconds)
        ) {
            isConditionsFulfilled = true;
        }
    }

    return isConditionsFulfilled;
};

true;