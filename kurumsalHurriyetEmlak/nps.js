var insPopupNps = function (config) {
    var self = {};

    self.info = {
        point: '',
        comment: '',
        spUID: spApi.storageData('spUID') || ''
    };

    self.init = function () {
        self.reset();
        self.addFirstPageHtml();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('.ins-popup-nps-c16').remove();
    };

    self.addFirstPageHtml = function () {
        var designHtml =
            '<div class = "ins-popup-nps-c16 ins-shift">' +
            '<div class = "ins-popup-text">' + config.firstText + '</div>' +
            '<div class = "ins-popup-numbers">' + self.getGeneratedOptions() + '</div>' +
            '<span class = "ins-number-comment left">Çok Kötü</span>' +
            '<span class = "ins-number-comment right">Çok İyi</span>' +
            '<div class = "ins-popup-arrow"><span class = "ins-rotate">&#709;<span></div>' +
            '</div>';

        sQuery('body').prepend(designHtml);
    };

    self.getGeneratedOptions = function () {
        var optionsHtml = '';
        var index;

        for (index = 1; index <= 10; index++) {
            optionsHtml += '<div class = "ins-option">' + index + '</div>';
        }

        return optionsHtml;
    };

    self.setEvents = function () {
        sQuery('.ins-popup-arrow').off('click.shiftTheDesign').on('click.shiftTheDesign', function () {
            sQuery('.ins-popup-arrow span').toggleClass('ins-rotate');

            sQuery('.ins-popup-nps-c16').toggleClass('ins-shift');
        });

        sQuery('.ins-option').off('click.optionSelection').on('click.optionSelection', function () {
            self.info['point'] = sQuery(this).text();

            self.addCommentSection();
        });

        sQuery(document).off('click.insSubmitButton').on('click.insSubmitButton', '.ins-submit-button', function () {
            self.info['comment'] = sQuery('textarea.ins-comment-input').val();

            self.addThankYouPage();
        });
    };

    self.addCommentSection = function () {
        var commentSectionHtml = '<textarea type="text" class ="ins-comment-input"></textarea>' +
            '<div class = "ins-submit-button">Gönder</div>';

        sQuery('.ins-popup-numbers, .ins-popup-nps-c16 > span').remove();

        sQuery('.ins-popup-text').text(config.secondText).after(commentSectionHtml);
    };

    self.addThankYouPage = function () {
        sQuery('textarea.ins-comment-input, .ins-submit-button').remove();

        sQuery('.ins-popup-text').text(config.thirdText).css('font-size', '4.5vh');
        sQuery('.ins-popup-text').after('<i class="fa fa-angle-up" aria-hidden="true"' +
            'style="position:absolute;font-size: 13vw;color: red;top:-5px"></i>');

        self.sendNpsDataToInfoCampaign();
        self.endOfNps();
    };

    self.sendNpsDataToInfoCampaign = function () {
        sQuery('iframe#spWorker').pm(function (info) {
                sQuery.ajax({
                    url: 'https://kurumsalhurriyetemlak.api.useinsider.com/ajax.php?t=saveFormResult',
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded;',
                    data: {
                        'formData[0][type]': 'dropdown',
                        'formData[0][id]': '3408653896571',
                        'formData[0][text]': 'Ne kadar mutlusunuz',
                        'formData[0][required_question]': 'false',
                        'formData[0][options][0][id]': '9014549536610',
                        'formData[0][options][0][text]': info.point,
                        'formData[0][options][0][type]': 'select',
                        'formData[0][options][0][redirect_page]': 'undefined',
                        'formData[0][options][0][redirect_page_index]': '0',
                        'formData[1][type]': 'text',
                        'formData[1][id]': '3629035195914',
                        'formData[1][text]': 'Biraz daha açıklar mısınız ?',
                        'formData[1][required_question] ': 'false',
                        'formData[1][options][0][id]': '5961982342451',
                        'formData[1][options][0][text]': info.comment,
                        'formData[1][options][0][type]': 'text',
                        'couponAction[type]': 'none',
                        'campId': 549,
                        'spUID': info.spUID
                    },

                    success: function () {
                        sQuery(window).pm(function () {
                            spApi.conLog('Nps Ajax Request : ', 'In Success');
                        });
                    },

                    error: function () {
                        sQuery(window).pm(function () {
                            spApi.conLog('Nps Ajax Request : ', 'In Error');
                        });
                    }
                });
            },
            undefined, self.info);
    };

    self.endOfNps = function () {
        spApi.conLog('Nps Info : ', self.info);

        setTimeout(function () {
            sQuery('.ins-popup-nps-c16').toggleClass('ins-shift');
            sQuery('.ins-popup-arrow span').toggleClass('ins-rotate');
        }, 2500);

        setTimeout(function () {
            self.reset();
        }, 5000);
    };

    self.init();
};

insPopupNps({
    firstText: 'Ne kadar mutlusunuz?',
    secondText: 'Biraz daha açıklar mısınız?',
    thirdText: 'Teşekkürler'
});