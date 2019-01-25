(function (self) {

    "use strict";

    var variationId = 26;

    self.construct = function () {
        self.reset();
        self.buildHtml();
        self.setEvents();
    };

    self.buildHtml = function () {
        sQuery('body').prepend('<div class="ins-survey-overlay"></div>' +
            '<div class="ins-survey-container">' +
            '<div class="ins-survey-wrap">' +
            '<div class="ins-survey-header">Websitemizi nasıl değerlendiriyorsunuz?</div>' +
            '<div class="ins-survey-close sp-custom-' + variationId + '-2"><a href="#"></a></div>' +
            '<div class="ins-survey-stars">' +
            '<div class="ins-star">' +
            '<img src="https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png">' +
            '</div>' +
            '<div class="ins-star">' +
            '<img src="https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png">' +
            '</div>' +
            '<div class="ins-star">' +
            '<img src="https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png">' +
            '</div>' +
            '<div class="ins-star">' +
            '<img src="https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png">' +
            '</div>' +
            '<div class="ins-star">' +
            '<img src="https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png">' +
            '</div>' +
            '</div>' +
            '<div class="ins-survey-button sp-custom-' + variationId + '-1">' +
            '<a><span>Puan Ver</span></a>' +
            '</div>' +
            '</div>' +
            '</div>');
    };

    self.setEvents = function () {
        self.setCookie('ins-survey-seen', 'true', 60);

        sQuery('body').css('overflow', 'hidden');

        sQuery('.ins-star').on('mouseover', function () {
            var index = sQuery(this).index();
            for (var i = 0; i <= index; i++) {
                sQuery('.ins-star').eq(i).find('img').attr('src', 'https://image.useinsider.com/kuveytturk/c26/VFVko8gqTWPXI7j3FvtY1519052784.png');
            }
        });

        sQuery('.ins-star').on('mouseout', function () {
            sQuery('.ins-star').each(function () {
                if (!sQuery(this).hasClass('clicked')) {
                    sQuery('img', this).attr('src', 'https://image.useinsider.com/kuveytturk/c26/KX23YDRtGrQuWWdtxsHQ1519055463.png');
                }
            });
        });

        sQuery('.ins-star').on('click', function () {
            sQuery('.ins-star').removeClass('clicked');
            var index = sQuery(this).index();
            for (var i = 0; i <= index; i++) {
                sQuery('.ins-star').eq(i).addClass('clicked');
            }
        });
        //OPT - 7784 - START
        sQuery(document).off('click.commentArea').on('click.commentArea', '.ins-star', function () {
            if (sQuery('.ins-star.clicked').length < 3) {
                self.openCommentArea();
            } else {
                self.closeCommentArea();
            }
        });
        //OPT - 7784 - END

        sQuery('.ins-survey-close').on('click', function () {
            self.setCookie('ins-survey-seen', 'true', 60);
            self.reset();
        });

        sQuery('.ins-survey-button').on('click', function () {
            self.saveFormResult();
            self.reset();
        });
    };

    self.saveFormResult = function () {
        var formData = {
            'formData[0][type]': 'scale',
            'formData[0][id]': '9995338713547',
            'formData[0][text]': 'Websitemizi nasıl değerlendiriyorsunuz?',
            'formData[0][required_question]': 'false',
            'formData[0][options][0][id]': '9872248769951',
            'formData[0][options][0][text]': String(sQuery('.clicked').length),
            'formData[0][options][0][type]': 'radio',
            'formData[1][type]': 'paragraph',
            'formData[1][id]': '7444953617697',
            'formData[1][text]': 'Comment',
            'formData[1][required_question]': 'false',
            'formData[1][options][0][id]': '4564791389416',
            'formData[1][options][0][text]': sQuery('.ins-survey-comment-area').val() || '',
            'formData[1][options][0][type]': 'textarea',
            'couponAction[type]': 'none',
            'campId': '11',
            'spUID': spApi.localStorageGet('spUID')
        };

        sQuery('#spWorker').pm(function (data) {
            sQuery.ajax({
                url: '//kuveytturk.api.sociaplus.com/ajax.php?t=saveFormResult',
                data: data,
                success: function () {
                    sQuery(window).pm(function () {
                        if (typeof spApi.insSendFormResultCb === 'function') {
                            spApi.insSendFormResultCb();
                        }
                    });
                }
            });
        }, undefined, formData);
    };

    self.reset = function () {
        sQuery('.ins-survey-container, .ins-survey-overlay').remove();
        sQuery('body').css('overflow', 'scroll');
    };

    self.setCookie = function (key, value, expire) {
        sQuery.cookie(key, value, {
            expires: expire,
            path: '/',
            domain: '.' + partner_site.host
        });
    };
    //OPT - 7784 - START
    self.openCommentArea = function () {
        if (!sQuery('.ins-survey-comment-area').exists()) {
            sQuery('.ins-survey-stars').after(
                '<textarea class="ins-survey-comment-area sp-custom-' + variationId + '-3"' +
                'style = "outline-width : 0px!important;"' +
                'placeholder = "Lütfen mesajınızı giriniz"></textarea>');

            sQuery('.ins-survey-container').css('height', '320px');
        }
    };

    self.closeCommentArea = function () {
        sQuery('textarea.ins-survey-comment-area').remove();

        sQuery('.ins-survey-container').css('height', '');
    };
    //OPT - 7784 - END

    self.construct();

})({});