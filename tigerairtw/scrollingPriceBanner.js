(function (self) {
    self.afterSelector = '.panel-body .row > div.col-xs-12.col-md-5.col-sm-4';
    self.designText = {
        en_US: {
            title1: 'tigercomfort ',
            description1_1: 'Seats at Rows 1, 12, 13 are more spacious,',
            description1_2: 'offering added leg rooms to you.',
            title2: 'tigerquicker ',
            description2_1: 'Seats at Rows 2-4 facilitate you to promptly find your seats after boarding',
            description2_2: 'And leave the cabin promptly upon arrival at the destination',
            title3: 'tigerbuddy ',
            description3_1: 'Prefer a seat close to the aisle?,',
            description3_2: 'Reserve you and your friends preferred seats.'
        },
        zh_tw: {
            title1: '虎舒適 ',
            description1_1: '第1,12,13排座位空間較舒適寬大，',
            description1_2: ' 讓您的腿部有更多伸展空間。',
            title2: '虎快客 ',
            description2_1: '第2-4排座位，',
            description2_2: '方便您登機迅速找到座位及班機抵達時可快速離開機艙。',
            title3: '虎厝邊 ',
            description3_1: '為您和旅伴優先保留座位，',
            description3_2: '可指定靠走道或靠窗'
        },
        ko_KR: {
            title1: 'tigercomfort ',
            description1_1: '제 1, 12, 13줄좌석은 공간이 비교적 넓기 때문에 다리를',
            description1_2: '더 뻗을 수 있습니다.',
            title2: 'tigerquicker ',
            description2_1: '제 2-4줄좌석은 탑승 후에 좌석을 신속하게 찾을 수 있고, 항공편이 도착한 후 ',
            description2_2: '신속하게 기내를 나갈 수 있습니다.',
            title3: 'tigerbuddy ',
            description3_1: '귀하와 일행의 좌석을 우선 보류해 드리며,',
            description3_2: '창가나 복도쪽 좌석을 지정하실 수 있습니다.'
        },
        ja_JP: {
            title1: 'tigercomfort ',
            description1_1: '1、12、13列目のお座席は、足元の空間が広くなっており、',
            description1_2: 'ゆったりとお座りいただけます。',
            title2: 'tigerquicker ',
            description2_1: '2～4列目のお座席は、ご搭乗時に速やかにご着席いただけ、またご到',
            description2_2: '着後も速やかにご降機いただけます',
            title3: 'tigerbuddy ',
            description3_1: 'お客様とご同行者の方の座席を優先的に確保し、通路側または窓側の',
            description3_2: '座席を指定することができます。'
        },
        th_TH: {
            title1: 'tigercomfort ',
            description1_1: 'พื้นที่ของที่นั่งแถวที่ 1, 12, 13 มีขนาดกว้างใหญ่กว่า',
            description1_2: 'ท่านจึงมีพื้นที่ในการยืดขาได้มากขึ้น',
            title2: 'tigerquicker ',
            description2_1: 'ที่นั่งแถวที่ 2-4 จะได้รับความสะดวกจากการเข้าถึงที่นั่งได้อย่างรวดเร็ว ',
            description2_2: 'และเมื่อเที่ยวบินเดินทางถึงจุดหมายท่านก็สามารถออกจากห้องโดยสารได้อย่างรวดเร็วเช่นกัน*',
            title3: 'tigerbuddy ',
            description3_1: 'สำรองที่นั่งสำหรับคุณและเพื่อนร่วมเดินทางของคุณ ท่านสามารถระบุที่นั่ง',
            description3_2: 'แบบทางเดินหรือที่นั่งริมหน้าต่าง'
        }
    };
    self.seatType = 0;

    self.init = function () {
        self.reset();
        self.createHtml();
        self.addRecommendedElement();
        self.setEvents();
    };

    self.reset = function () {
        sQuery('.ins-price-banner-wrapper').remove();
    };

    self.createHtml = function () {
        var lang = spApi.getLang() || 'en_US';
        var html = '<div class="ins-price-banner-wrapper">' +
            '    <div class="ins-price-container ins-tigercomfort">' +
            '        <div class="ins-top-part">' +
            '            <span>' + self.designText[lang].title1 + ' </span>' +
            '        </div>' +
            '        <div class="ins-bottom-part">' +
            '            <span>' + self.designText[lang].description1_1 + '</span>' +
            '            <span>' + self.designText[lang].description1_2 + '</span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="ins-price-container ins-tigerquicker">' +
            '        <div class="ins-top-part">' +
            '            <span>' + self.designText[lang].title2 + ' </span>' +
            '        </div>' +
            '        <div class="ins-bottom-part">' +
            '            <span>' + self.designText[lang].description2_1 + '</span>' +
            '            <span>' + self.designText[lang].description2_2 + '</span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="ins-price-container ins-tigerbuddy">' +
            '        <div class="ins-top-part">' +
            '            <span>' + self.designText[lang].title3 + '</span>' +
            '        </div>' +
            '        <div class="ins-bottom-part">' +
            '            <span>' + self.designText[lang].description3_1 + '</span>' +
            '            <span>' + self.designText[lang].description3_2 + '</span>' +
            '        </div>' +
            '    </div>' +
            '</div>';

        sQuery(self.afterSelector).after(html);

        self.setPricesDynamically(0);

        if (self.isThereSecondFlight()) {
            self.setPricesDynamically(3);
        }
    };

    self.isThereSecondFlight = function () {
        return sQuery('.nav-tabs .widget-button-link').length > 1;
    }

    self.setPricesDynamically = function (index) {
        var tigerbuddyPrice = sQuery('.panel-body .border-box.seats-guide .seaticon-container > div > span')
            .eq(index).text();
        var tigerquickerPrice = sQuery('.panel-body .border-box.seats-guide .seaticon-container > div > span')
            .eq(index + 1).text();
        var tigercomfortPrice = sQuery('.panel-body .border-box.seats-guide .seaticon-container > div > span')
            .eq(index + 2).text();

        sQuery('.ins-price-banner-wrapper .ins-tigerbuddy span').eq(index).append(tigerbuddyPrice);
        sQuery('.ins-price-banner-wrapper .ins-tigerquicker span').eq(index).append(tigerquickerPrice);
        sQuery('.ins-price-banner-wrapper .ins-tigercomfort span').eq(index).append(tigercomfortPrice);
    };

    self.addRecommendedElement = function () {
        sQuery('.ins-tigerquicker').append('<div class="ins-recommended-icon"></div>');
    };

    self.isInViewport = function (selector) {
        var elementTop = sQuery(selector).offset().top;
        var elementBottom = elementTop + sQuery(selector).outerHeight();
        var viewportTop = sQuery(window).scrollTop();
        var viewportBottom = viewportTop + sQuery(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    self.setEvents = function () {
        var init = false;

        sQuery(window).off('resize.ins54 scroll.ins54').on('resize.ins54 scroll.ins54', function () {
            if (!init) {
                if (self.isInViewport('.widget-button-select:first') ||
                    self.isInViewport('.widget-button-select:not(:first)')) {
                    sQuery('.ins-price-banner-wrapper').removeClass('ins-sticky-banner');
                    sQuery('.ins-price-banner-wrapper').addClass('ins-absolute-banner');
                } else {
                    sQuery('.ins-price-banner-wrapper').removeClass('ins-absolute-banner');

                    if (self.isInViewport('.btn-nav.pull-right')) {
                        sQuery('.ins-price-banner-wrapper').removeClass('ins-sticky-banner');
                    } else {
                        sQuery('.ins-price-banner-wrapper').addClass('ins-sticky-banner');
                    }
                }
            }
        });

        sQuery(document).off('click.ins54').on('click.ins54', '.type-a:not(.not-available) ,' +
            '.type-b:not(.not-available) , ' +
            '.type-c:not(.not-available) ',
            function () {
                if (sQuery(this).hasClass('type-a')) {
                    self.seatType = 13;
                } else if (sQuery(this).hasClass('type-b')) {
                    self.seatType = 14;
                } else if (sQuery(this).hasClass('type-c')) {
                    self.seatType = 15;
                }
            });

        self.ajaxListener(function (url, response, method) {
            if (url.indexOf('/wkapi/v1.0/seat') > -1 && method === 'PUT') {
                spApi.setSessionStorage('ins-selected-seat-type', JSON.stringify(self.seatType));
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
                        } catch (error) {
                            spApi.conLog('Something is crashed, Event:' + error);
                        }
                    }
                }
            });
        };
    };

    self.init();
}({}));