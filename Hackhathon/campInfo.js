var CampaignSettings = function (config) {
    var self = {};

    self.inspectorDetails = config.inspectorDetails;
    self.currentCampInfo = spApi.getCamp(config.campId).camp || {};
    self.campInfo = {
        success: (typeof self.currentCampInfo !== 'undefined'),
        segments: [],
        rules: []
    };

    self.init = function () {
        self.addBasicProperties(config.campId);
        self.setInspectorDetails(self.inspectorDetails);
        self.setEvents();
    };

    self.addBasicProperties = function (campId) {
        self.campInfo['campName'] = spApi.decryptCampName(((spApi.getCamp(campId) || {}).camp || {}).campName || '');
        self.campInfo['startDate'] = {
            'value': self.currentCampInfo.activeDateStart,
            'result': self.currentCampInfo.activeDateStart < spApi.getTime()
        };
        self.campInfo['endDate'] = {
            'value': self.currentCampInfo.activeDateEnd,
            'result': self.currentCampInfo.activeDateEnd > spApi.getTime()
        };
        self.campInfo['language'] = {
            'value': self.currentCampInfo.lang,
            'result': spApi.getLang() === self.currentCampInfo.lang
        };
        self.campInfo['displayTime'] = {
            'start': {
                'value': JSON.parse(self.currentCampInfo.dailyDisplay).start,
                'result': self.compareDisplayHours(JSON.parse(self.currentCampInfo.dailyDisplay).start)
            },
            'end': {
                'value': JSON.parse(self.currentCampInfo.dailyDisplay).end,
                'result': !self.compareDisplayHours(JSON.parse(self.currentCampInfo.dailyDisplay).end)
            }
        };
        self.campInfo['platform'] = {
            'value': self.currentCampInfo.platform,
            'result': (self.currentCampInfo.platform === 'web' ?
                !spApi.isMobileBrowser() : spApi.isMobileBrowser())
        };
    };

    self.compareDisplayHours = function (campaignTime) {
        campaignTime = campaignTime.split(':');

        var campaignHour = campaignTime[0];
        var campaignMinute = campaignTime[1];
        var currentHours = (new Date).getHours();
        var currentMinutes = (new Date).getMinutes();

        return (campaignHour < currentHours) || (campaignHour === currentHours && campaignMinute < currentMinutes);
    };

    self.setInspectorDetails = function (inspectorDetails) {
        var label = '';

        inspectorDetails.forEach(function (element) {
            label = element.label;

            if (label === 'Segments') {
                (element['segments'] || []).forEach(function (segment) {
                    self.campInfo.segments.push({
                        'name': segment.text || '',
                        'value': segment.js || '',
                        'result': eval(segment.js || '')
                    });
                });
            }

            if (label === 'Rules') {
                (element['rules'] || []).forEach(function (rule) {
                    self.campInfo.rules.push({
                        'name': rule.text || '',
                        'value': rule.js || '',
                        'result': eval(rule.js || '')
                    });
                });
            }
        });
    };

    self.ajaxListener = function (callback) {
        var originalOpenFunction = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            originalOpenFunction.apply(this, arguments);
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        try {
                            callback(url, this.responseText, method);
                        } catch (e) {
                            spApi.conLog('Something is crashed, Event:' + e);
                        }
                    }
                }
            });
        };
    };

    self.setEvents = function () {
        var ajaxEvent = {};

        ajaxListener(function (url, response, method) {
            if (url.indexOf('ajax.php') > -1) {
                ajaxEvent = {};
                ajaxEvent.logType = spApi.getParameterFromUrl(url, 'type') || '';
                ajaxEvent.campId = spApi.getParameterFromUrl(url, 'campId') || '';
                ajaxEvent.customSubId = spApi.getParameterFromUrl(url, 'customSubId') || '';
                ajaxEvent.productType = spApi.getParameterFromUrl(url, 'productType') || '';

                if (ajaxEvent.campId === config.campId) {
                    sQuery(document).trigger('logEventSent', ajaxEvent);
                }
            }
        });
    };

    self.init();

    return self.campInfo;
};

(function () {
    var $body = sQuery('body');
    var $inspectorDetails = sQuery('.inspector-details');
    var $btnOpenAdvance = sQuery('.btn-open-advance');
    var $btnInspectorExpand = sQuery('.btn-inspector-expand');
    var $btnShowInstantly = sQuery('.btn-show-instantly');
    var $desktopWrapper = sQuery('.inspector-desktop-wrapper');
    var $mobileWrapper = sQuery('.inspector-mobile-wrapper');
    var testCampId = spApi.Base64.encode(spApi.getCamp(spApi.getObjectValue(spApi.getCampBuilderCandidates())).camp.id);

    var init = function () {
        setCampaignVisibilityObserver();
        setEvents();
        changeCampaignVisibilityStatus();
    };

    var setCampaignVisibilityObserver = function () {
        sQuery(document).off('inspectorCampaignShowed.insider').on('inspectorCampaignShowed.insider', function (event) {
            changeCampaignVisibilityStatus();
        });
    };

    var changeCampaignVisibilityStatus = function () {
        if ((spApi.showedCampaignList || []).indexOf(testCampId) !== -1) {
            sQuery('.inspector-personalization-visibility').css('display', 'none');
        }
    };

    var setEvents = function () {
        $body.on('click', '.btn-open-advance', function () {
            if ($inspectorDetails.is(':visible')) {
                $btnOpenAdvance.text('DETAILS');
                $btnShowInstantly.prop('disabled', false);
                $inspectorDetails.slideToggle();
            } else {
                showInspectorDetails();
            }
        });

        $body.on('click', '.btn-inspector-collapse', function () {
            $btnInspectorExpand.addClass('inspector-collapsed');
            $inspectorDetails.hide();
            $btnOpenAdvance.text('DETAILS');
            $btnShowInstantly.prop('disabled', false);
            isDesktop() ? $desktopWrapper.addClass('inspector-collapsed') : $mobileWrapper.addClass('inspector-collapsed');
        });

        $body.on('click', '.btn-inspector-expand', function () {
            $btnInspectorExpand.removeClass('inspector-collapsed');
            isDesktop() ? $desktopWrapper.removeClass('inspector-collapsed') : $mobileWrapper.removeClass('inspector-collapsed');
        });

        $body.on('click', '.inspector-move-to-button', function () {
            changeInspectorPosition();
        });
    };

    var openAdvance = function () {
        $btnOpenAdvance.text('CLOSE DETAILS');
        // Only on desktop
        if (isDesktop()) {
            $btnShowInstantly.prop('disabled', true);
        }

        $inspectorDetails.slideToggle();
    };

    var isDesktop = function () {
        return sQuery(window).width() > 1200;
    };

    /**
     * Generates and appends personalization summary html
     * @param inspectorDetails
     */
    var generatePersonalizationSummary = function (inspectorDetails) {
        sQuery('#spWorker').pm(function () {
            return sQuery.cookie('inspectorRouteAlias');
        }, function (inspectorRouteAlias) {
            if (inspectorRouteAlias != null) {
                sQuery('.inspector-details').append(generateDetailItem(inspectorDetails, inspectorRouteAlias));
                checkRulesAndSegments();
            }
        });
    };

    /**
     * Run tests for campaign rules
     */
    var checkRulesAndSegments = function () {
        var trigger = spApi.getCamp(spApi.getObjectValue(spApi.getCampBuilderCandidates())).camp.showIn.trigger;
        var segment = spApi.getCamp(spApi.getObjectValue(spApi.getCampBuilderCandidates())).camp.showIn.segment;

        if (typeof trigger !== 'undefined' && typeof trigger[0] === 'number') {
            if (spApi.rules[trigger[0]].test.match(/.(showCustomCamp|showCamp)./)) {
                sQuery('.inspector-details .rules').addClass('not-tested');
                return;
            }

            spApi.e(spApi.rules[trigger[0]].test) === false ? sQuery('.inspector-details .rules').addClass('inspector-error') : '';
        }

        if (typeof segment !== 'undefined' && typeof segment[0] === 'number') {
            spApi.e(spApi.rules[segment[0]].test) === false ? sQuery('.inspector-details .segments').addClass('inspector-error') : '';
        }
    };

    /**
     * Generates personalization item details html
     * @param inspectorDetails
     * @param inspectorRouteAlias
     * @returns {string|boolean}
     */
    var generateDetailItem = function (inspectorDetails, inspectorRouteAlias) {
        if (typeof inspectorDetails !== 'object') {
            return false;
        }
        var detailHtml = '';

        sQuery.each(inspectorDetails, function (index, values) {
            var listElements = '';

            if (Array.isArray(values.text)) {
                sQuery.each(values.text, function (id, value) {
                    listElements += '<li>' + generatePermalink(values.label, value, inspectorRouteAlias) + '</li>';
                });
            } else {
                sQuery.each(values.text.bold, function (id, value) {
                    listElements += '<li><b>' + generatePermalink(values.label, value, inspectorRouteAlias) + '</b></li>';
                });

                sQuery.each(values.text.normal, function (id, value) {
                    listElements += '<li>' + generatePermalink(values.label, value, inspectorRouteAlias) + '</li>';
                });
            }

            detailHtml += '<div class="inspector-detail-row"><h2>' + values.label + '</h2><ul class="' + values.label.toLowerCase() + '">' + listElements + '</ul></div>';
        });

        return detailHtml;
    };

    /**
     * Generate link for detail items
     * @param label
     * @param text
     * @param inspectorRouteAlias
     * @returns {string}
     */
    var generatePermalink = function (label, text, inspectorRouteAlias) {
        var pageType = '';

        switch (label) {
            case 'Segments':
                pageType = 'segmentation';
                break;
            case 'Rules':
                pageType = 'rules';
                break;
            case 'Variations':
                pageType = 'design';
                break;
            case 'Goals':
                pageType = 'goals';
                break;
            default:
                pageType = 'launch';
                break
        }

        return '<a href="//' + partnerName + '.inone.useinsider.com/' + inspectorRouteAlias + '/' + getBuilderId() + '/' + pageType + '" target="_blank">' + text + '</a>';
    };

    /**
     * Get builder id
     * @returns {*}
     */
    var getBuilderId = function () {
        return isDesktop() ? sQuery('#desktop-variation-list option:selected').attr('builder-id') : sQuery('#mobile-variation-list option:selected').attr('builder-id');
    };

    var changeInspectorPosition = function () {
        var $inspectorWrapper = sQuery('.inspector-wrapper');

        $inspectorWrapper
            .removeClass('inspector-show-up-from-top inspector-show-up-from-bottom inspector-default-position');

        if ($inspectorWrapper.attr('inspector-position') === 'bottom') {
            $inspectorWrapper.addClass('inspector-show-up-from-top');
            $inspectorWrapper.attr('inspector-position', 'top');
        } else {
            $inspectorWrapper.addClass('inspector-show-up-from-bottom');
            $inspectorWrapper.attr('inspector-position', 'bottom');
        }
    };

    var showInspectorDetails = function () {
        if (sQuery('.inspector-detail-row').length === 0) {
            sQuery('#spWorker').pm(function () {
                return sQuery.cookie('inspectorQueryHash');
            }, function (inspectorQueryHash) {
                if (inspectorQueryHash != null) {
                    sQuery.ajax({
                        type: 'GET',
                        url: 'https://' + partnerName + '.inone.useinsider.com/inspector-summary',
                        dataType: 'json',
                        data: {
                            id: getBuilderId(),
                            queryHash: inspectorQueryHash
                        },
                        success: function (inspectorDetails) {
                            console.log(new CampaignSettings({
                                builderId: getBuilderId(),
                                inspectorDetails: inspectorDetails
                            }));
                            generatePersonalizationSummary(inspectorDetails);
                            openAdvance();
                        }
                    });
                }
            });
        } else {
            openAdvance();
        }
    };

    return init();
})();