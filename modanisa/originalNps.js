/*
    Modanisa NPS

    OPT-2287
    OPT-2279
    OPT-2271
    OPT-2273
    OPT-2288
    OPT-2281
*/
spApi.modanisaNps = function (options) {
    this.options = options;
};

spApi.modanisaNps.prototype.init = function () {
    this.reset();
    this.styling();
    this.createHtml(this.options.targetSelector, this.options.addingMethod, this.options.type);
    this.setEvents();
};

spApi.modanisaNps.prototype.reset = function () {
    sQuery('#ins-user-nps, #ins-user-nps-style').remove();
};

spApi.modanisaNps.prototype.createHtml = function (selector, method, type) {
    var customClass = 'sp-custom-' + this.options.campId + '-';

    var html = '' +
        '<div id="ins-user-nps" class="ins-user-nps-' + type + '">' +
        '<div class="ins-user-nps-container">' +
        '<div class="ins-user-nps-inner-container">' +
        '<div class="ins-user-nps-page ins-user-nps-form-page">' +
        '<div class="ins-user-nps-text">' + this.options.dictionary.question + '</div>' +
        '<div class="ins-user-nps-scale-container">' +
        '<div class="ins-user-nps-scale-title">' + this.options.dictionary.scaleTitle + '</div>' +
        '<div class="ins-user-nps-scale">' +
        //OPT-4261 start
        '<div class="ins-user-nps-scale-info-not-text">' + this.options.dictionary.notAtAll + '</div>' +
        '<div class="ins-user-nps-scale-info">' + this.options.dictionary.extremelyLike + '</div>' +
        //OPT-4261 end
        '<div class="ins-user-nps-scale-number ' + customClass + '10">10</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '9">9</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '8">8</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '7">7</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '6">6</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '5">5</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '4">4</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '3">3</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '2">2</div>' +
        '<div class="ins-user-nps-scale-number ' + customClass + '1">1</div>' +
        '</div>' +
        '</div>' +
        '<textarea class="ins-user-nps-comment" placeholder="' + this.options.dictionary.followUpQuestion + '"></textarea>' +
        '<div class="ins-user-nps-submit ' + customClass + '-0">' + this.options.dictionary.submitButton + '</div>' +
        '</div>' +
        '<div class="ins-user-nps-page ins-user-nps-thank-you-page">' + this.options.dictionary.thankYou + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="ins-user-nps-close"></div>' +
        '</div>';

    spApi.e('sQuery("' + selector + '").' + method + '(\'' + html.replace(/'/g, "\\'") + '\');');
};

spApi.modanisaNps.prototype.styling = function () {
    sQuery('head').append(
        //OPT-4261 start
        "<style id='ins-user-nps-style'>" +
        "div#topcontrol{bottom:250px!important}.ins-user-nps-scale-info-not-text {color: #7c7c7c;position: absolute;top: -30px;left: 0;text-align: left;font-size: 12px;line-height: 12px;}.ins-user-nps-scale-info {color: #7c7c7c;position: absolute;top: -30px;right: 0;text-align: right;font-size: 12px;line-height: 12px;}#ins-user-nps,#ins-user-nps *{box-sizing:border-box}#ins-user-nps{width:380px;height:auto;padding:30px;position:fixed;right:20px;bottom:20px;z-index:9999;background-color:#FFF;border-radius:5px;box-shadow:0 0 30px -5px rgba(0,0,0,.4)}.ins-user-nps-container {width: 100%;height: 150px;float: left;overflow: hidden;transition: all .3s ease;}#ins-user-nps.ins-user-nps-opened .ins-user-nps-container {height: 335px;}.ins-user-nps-inner-container{width:200%;transition:all .3s ease}.ins-user-nps-page{width:50%;float:left}.ins-user-nps-scale-container,.ins-user-nps-text{width:100%;float:left}.ins-user-nps-thank-you-page{height:310px;display:flex;justify-content:center;align-items:center;font-size:20px;color:#ff5b00}.ins-user-nps-text{text-align:center;font-size:13.6px;font-weight:600;color:#424c66}.ins-user-nps-scale-title{width:100%;float:left;margin-top:20px;text-align:center;font-size:12px;color:#7c7c7c;letter-spacing:2px}.ins-user-nps-scale-title:after{content:' ';width:15px;border-bottom:1px solid #7c7c7c;display:block;margin-left:50%;transform:translate(-50%,1px)}.ins-user-nps-scale {width: 100%;float: left;margin-top: 35px;display: flex;justify-content: space-between;flex-direction: row-reverse;position: relative;}.ins-user-nps-scale-number{width:25px;height:25px;border:1px solid #ff5b00;border-radius:3px;text-align:center;line-height:25px;color:#7c7c7c;font-size:12px;cursor:pointer}.ins-user-nps-scale-number.ins-user-nps-scale-number-active,.ins-user-nps-scale-number.ins-user-nps-scale-number-active~.ins-user-nps-scale-number,.ins-user-nps-scale-number:hover,.ins-user-nps-scale-number:hover~.ins-user-nps-scale-number{background-color:#ff5b00;color:#FFF}.ins-user-nps-comment{width:100%;height:120px;float:left;margin-top:20px;padding:15px;background-color:#e9e9e9;font-size:14px}.ins-user-nps-comment::placeholder{font-size:14px;font-style:normal}.ins-user-nps-submit{width:100%;float:left;margin-top:10px;padding:10px 0;text-align:center;background-color:#424c66;color:#FFF;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;cursor:pointer}.ins-user-nps-close{width:30px;height:30px;position:absolute;top:-15px;right:10px;background-color:#35393d;border-radius:50%;color:#FFF;text-align:center;font-size:25px;line-height:30px;font-weight:400;font-family:sans-serif;cursor:pointer}.ins-user-nps-close:before{font-family:sans-serif;content:'\\00D7'}#ins-user-nps.ins-user-nps-inline{position:relative;bottom:auto;right:auto;width:100%;display:inline-block;border-radius:0;box-shadow:none;margin-bottom:20px}#ins-user-nps.ins-user-nps-inline .ins-user-nps-container{height:auto}#ins-user-nps.ins-user-nps-inline .ins-user-nps-text{width:35%;text-align:left}#ins-user-nps.ins-user-nps-inline .ins-user-nps-scale-container{width:32%}#ins-user-nps.ins-user-nps-inline .ins-user-nps-page{height:100%;min-height:80px;display:flex;justify-content:space-between;align-items:center}#ins-user-nps.ins-user-nps-inline .ins-user-nps-thank-you-page{height:80px;justify-content:center}#ins-user-nps.ins-user-nps-inline .ins-user-nps-scale-title{margin-top:0}#ins-user-nps.ins-user-nps-inline .ins-user-nps-comment{width:32%;height:70px;margin-top:0;display:none}#ins-user-nps.ins-user-nps-inline .ins-user-nps-submit{width:20%;float:right;margin-top:0}#ins-user-nps.ins-user-nps-inline .ins-user-nps-close{display:none}@media all and (max-width:480px){#ins-user-nps{width:100%;right:0;bottom:0;padding:20px;border-radius:0}.ins-user-nps-container{height:133px;transition:unset}#ins-user-nps.ins-user-nps-opened{height:100%;display:flex;align-items:center}#ins-user-nps.ins-user-nps-opened .ins-user-nps-container,.ins-user-nps-thank-you-page{height:317px}#ins-user-nps.ins-user-nps-opened .ins-user-nps-close{top:27px}.ins-user-nps-text{font-size:12px}.ins-user-nps-scale-title{font-size:11px;margin-top:15px}.ins-user-nps-scale-number{width:22px;height:22px;line-height:22px;font-size:12px}.ins-user-nps-close{width:25px;height:25px;line-height:25px;font-size:25px}.ins-user-nps-comment{font-size:12px}.ins-user-nps-comment::placeholder{font-size:12px}.ins-user-nps-submit{font-size:12px;letter-spacing:2px}}" +
        "</style>"
        //OPT-4261 end
    );
};

spApi.modanisaNps.prototype.saveData = function (callback) {
    spApi.modanisaNpsCallback = callback;

    var userData = (typeof insider_object !== 'undefined' && insider_object.user) || {};
    var transactionData = (typeof insider_object !== 'undefined' && insider_object.transaction) || {};

    this.options.formData = {
        point: sQuery('.ins-user-nps-scale-number-active').text(),
        comment: sQuery('.ins-user-nps-comment').val(),
        deviceType: spApi.deviceDetect('Tablet') ? 'Tablet' : (spApi.deviceDetect('Mobil') ? 'Mobile' : 'Desktop'),
        customerId: userData.user_id || '',
        orderId: transactionData.order_id || '',
        country: spApi.getDataFromDataLayer('dimension11'),
        zone: spApi.getDataFromDataLayer('dimension2'),
        language: spApi.getLang(),
        date: this.getDate(),
        orderCount: userData.transaction_count || '0',
        paymentMethod: transactionData.payment_type || ''
    };

    if (this.options.npsType === 'cargoDelivery' && typeof lastDeliveredOrder !== 'undefined') {
        this.options.formData.orderId = lastDeliveredOrder.orderId;
        this.options.formData.date = lastDeliveredOrder.deliveryDate;
    } else if (this.options.npsType === 'returnDelivery' && typeof lastReturnedOrder !== 'undefined') {
        this.options.formData.orderId = lastReturnedOrder.orderId;
        this.options.formData.date = lastReturnedOrder.deliveryDate;
    }

    sQuery('#spWorker').pm(function (options) {
        sQuery.ajax({
            url: 'https://modanisatr.api.sociaplus.com/ajax.php?t=saveFormResult',
            data: {
                'formData[0][type]': 'scale',
                'formData[0][id]': '2427315556873',
                'formData[0][text]': 'Kargo teslim sürecinize istinaden Modanisa\'yı arkadaşlarınız ve yakınlarınıza önerir miydiniz?',
                'formData[0][required_question]': 'false',
                'formData[0][options][0][id]': '1256558033349',
                'formData[0][options][0][text]': options.formData.point,
                'formData[0][options][0][type]': 'radio',
                'formData[1][type]': 'paragraph',
                'formData[1][id]': '8325438058531',
                'formData[1][text]': 'Puanınızın nedenini yazar mısınız?',
                'formData[1][required_question]': 'false',
                'formData[1][options][0][id]': '1539178255358',
                'formData[1][options][0][text]': options.formData.comment,
                'formData[1][options][0][type]': 'textarea',
                'formData[2][type]': 'multiple_textbox',
                'formData[2][id]': '3827289395711',
                'formData[2][text]': 'Other Data',
                'formData[2][required_question]': 'false',
                'formData[2][options][0][id]': '9843309126459',
                'formData[2][options][0][text]': options.npsType,
                'formData[2][options][0][type]': 'multiple_text',
                'formData[2][options][0][label]': 'NPS Type',
                'formData[2][options][1][id]': '8059346391492',
                'formData[2][options][1][text]': options.formData.customerId,
                'formData[2][options][1][type]': 'multiple_text',
                'formData[2][options][1][label]': 'Customer ID',
                'formData[2][options][2][id]': '2089579394314',
                'formData[2][options][2][text]': options.formData.date,
                'formData[2][options][2][type]': 'multiple_text',
                'formData[2][options][2][label]': 'Date',
                'formData[2][options][3][id]': '9849073954213',
                'formData[2][options][3][text]': options.formData.deviceType,
                'formData[2][options][3][type]': 'multiple_text',
                'formData[2][options][3][label]': 'Device Type',
                'formData[2][options][4][id]': '8395974943012',
                'formData[2][options][4][text]': options.formData.language,
                'formData[2][options][4][type]': 'multiple_text',
                'formData[2][options][4][label]': 'Language',
                'formData[2][options][5][id]': '0374354192989',
                'formData[2][options][5][text]': options.formData.country,
                'formData[2][options][5][type]': 'multiple_text',
                'formData[2][options][5][label]': 'Country',
                'formData[2][options][6][id]': '8273943594091',
                'formData[2][options][6][text]': options.formData.zone,
                'formData[2][options][6][type]': 'multiple_text',
                'formData[2][options][6][label]': 'Zone',
                'formData[2][options][7][id]': '0983935149247',
                'formData[2][options][7][text]': options.formData.orderId,
                'formData[2][options][7][type]': 'multiple_text',
                'formData[2][options][7][label]': 'Order ID',
                'formData[2][options][8][id]': '3159320489948',
                'formData[2][options][8][text]': options.formData.orderCount,
                'formData[2][options][8][type]': 'multiple_text',
                'formData[2][options][8][label]': 'Order Count',
                'formData[2][options][9][id]': '8425149393089',
                'formData[2][options][9][text]': options.formData.paymentMethod,
                'formData[2][options][9][type]': 'multiple_text',
                'formData[2][options][9][label]': 'Payment Method',
                'couponAction[type]': 'none',
                'campId': options.infoCampId,
                'spUID': sQuery.cookie('spUID')
            },
            success: function (response) {
                if (response.status === 1) {
                    sQuery(window).pm(function () {
                        if (typeof spApi.modanisaNpsCallback === 'function') {
                            spApi.modanisaNpsCallback();
                        }
                    });
                } else {
                    spApi.conLog('There is something wrong!');
                }
            }
        });
    }, undefined, this.options);
};

spApi.modanisaNps.prototype.setEvents = function () {
    var that = this;

    sQuery('.ins-user-nps-close').on('click', function () {
        that.setCookie('ins-user-nps-closed', 1);
        sQuery('#ins-user-nps').remove();
    });

    sQuery('.ins-user-nps-scale-number').on('click', function () {
        that.setCookie('ins-user-nps-closed', 1, 10);

        sQuery('.ins-user-nps-scale-number').css('pointer-events', 'none')
            .removeClass('ins-user-nps-scale-number-active');

        sQuery(this).addClass('ins-user-nps-scale-number-active');

        if (that.options.type === 'popup') {
            sQuery('#ins-user-nps').addClass('ins-user-nps-opened');
        }

        that.saveData(function () {
            sQuery('.ins-user-nps-scale-number').css('pointer-events', 'auto');
        });
    });

    sQuery('.ins-user-nps-submit').on('click', function () {
        that.setCookie('ins-user-nps-closed', 1, 10);

        setTimeout(function () {
            sQuery('.ins-user-nps-scale-info-not-text, .ins-user-nps-scale-info').css('display', 'none');
        }, 300);

        sQuery('.ins-user-nps-scale-number').css('pointer-events', 'none');
        sQuery('.ins-user-nps-submit').css('pointer-events', 'none');

        if (that.options.type === 'inline' && !sQuery('.ins-user-nps-comment:visible').exists()) {
            sQuery('.ins-user-nps-scale-container').hide();
            sQuery('.ins-user-nps-comment').fadeIn();
            sQuery('.ins-user-nps-submit').css('pointer-events', 'auto');
        } else {
            that.saveData(function () {
                sQuery('.ins-user-nps-inner-container').css({ 'transform': 'translateX(-50%)' });

                setTimeout(function () {
                    sQuery('#ins-user-nps').remove();
                }, 3000);
            });
        }
    });
};

spApi.modanisaNps.prototype.setCookie = function (key, value, expires) {
    var options = {
        path: '/',
        domain: '.' + partner_site.host
    };

    if (typeof expires !== 'undefined') {
        options.expires = expires;
    }

    sQuery.cookie(key, value, options);
};

spApi.modanisaNps.prototype.getDate = function () {
    var date = new Date();

    var day = date.getDate();
    day = day < 10 ? '0' + day : day;

    var month = date.getMonth();
    month = month < 10 ? '0' + month : month;

    var year = date.getFullYear();

    var hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;

    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};
/*
    Modanisa NPS

    OPT-2287
    OPT-2279
    OPT-2271
    OPT-2273
    OPT-2288
    OPT-2281
*/