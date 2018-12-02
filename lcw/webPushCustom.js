(function (self) {
    self.configs = {
        utmSource : '?utm_source=insider&utm_medium=web_push&utm_campaign=favorilere_eklenen_rnler&' +
              'utm_term=&utm_content=&webPushId=dGVzdA==',
        webPushTitle : 'Favori Ürünün Seni Bekliyor!'
    };

    self.init = function () {
        if (spApi.isOnProductPage()) {
            self.setEventsForProductPage();
        }

        if (spApi.isOnCategoryPage()) {
            self.setEventsForCategoryPage();
        }
    };

    self.setEventsForProductPage = function () {
        var productInfo = {};

        sQuery(document).off('click.ins1712').on('click.ins1712', '.add-to-favorite-detail', function () {
            productInfo = self.getClickedItem(sQuery(this));

            if (sQuery(this).hasClass('added')) {
                if (self.removeClickedItemFromFavoriteList(productInfo.id)) {
                    if (sQuery.cookie('ins-last-favorite-item-id') === productInfo.id) {
                        self.getWebPushOfThePage(false, productInfo);
                    }
                }
            } else if (spApi.getCurrentProduct().quantity !== 0) {
                if (self.addClickedItemToFavoriteList(productInfo.id)) {
                    self.setCookie('ins-last-favorite-item-id', productInfo.id);
                    self.getWebPushOfThePage(true, productInfo);
                }
            }
        });
    };

    self.setEventsForCategoryPage = function () {
        var clickedEventType = '';
        var productInfo = {};

        sQuery(document).off('click.ins1712').on('click.ins1712', '.add-to-favorite', function () {
            clickedEventType = sQuery(this).attr('data-tracking-action') || '';
            productInfo = self.getClickedItem(sQuery(this));

            if (clickedEventType === 'DelFromFav') {
                if (self.removeClickedItemFromFavoriteList(productInfo.id)) {
                    if (sQuery.cookie('ins-last-favorite-item-id') === productInfo.id) {
                        self.getWebPushOfThePage(false, productInfo);
                    }
                }
            } else if (clickedEventType === 'AddToFav') {
                if (self.addClickedItemToFavoriteList(productInfo.id)) {
                    self.setCookie('ins-last-favorite-item-id', productInfo.id);
                    self.getWebPushOfThePage(true, productInfo);
                }
            }
        });
    };

    self.getClickedItem = function (selector) {
        var productInfo = {};
        
        if (spApi.isOnProductPage()) {
            productInfo = spApi.getCurrentProduct();
            productInfo.url = decodeURIComponent(spApi.getCurrentProduct().url);

            return productInfo;
        }

        productInfo.id = selector.attr('optionid') || '';
        productInfo.name = selector.closest('.c-item').children('.c-item-name').text() || '';
        productInfo.url = location.origin + selector.closest('.c-item').children('a').attr('href') || '';
        productInfo.img = selector.closest('.c-item').find('img').attr('src') || '';

        return productInfo;
    };

    self.setCookie = function (key, value) {
        sQuery.cookie(key, value, {
            expires: 30,
            path: '/',
            domain: '.' + partner_site.host
        });
    };

    self.removeClickedItemFromFavoriteList = function (clickedItemId) {
        var favoriteItems = JSON.parse(sQuery.cookie('ins-favorite-list') || '[]');
        var tmpFavoriteItems = JSON.parse(sQuery.cookie('ins-favorite-list') || '[]');
        var flag = false;
        var count = 0;

        sQuery(tmpFavoriteItems).each(function (index, id) {
            if (id === clickedItemId) {
                favoriteItems.splice(index - count, 1);

                flag = true;

                count++;
            }
        });

        self.setCookie('ins-favorite-list', JSON.stringify(favoriteItems));

        return flag;
    };

    self.addClickedItemToFavoriteList = function (clickedItemId) {
        var favoriteItems = JSON.parse(sQuery.cookie('ins-favorite-list') || '[]');

        sQuery(favoriteItems).each(function (index, id) {
            if (id === clickedItemId) {
                return false;
            }
        });

        favoriteItems.push(clickedItemId);

        self.setCookie('ins-favorite-list', JSON.stringify(favoriteItems));

        return true;
    };

    self.getWebPushOfThePage = function (flag, productInfo) {
        try {
            var conversionPush = '3';

            spApi.activeConversionPushes.set = [];
            spApi.activeConversionPushes.reset = [];
            spApi.activeConversionPushes.update = [];

            spApi.worker.asyncFunc(function () {
                sQuery('#spWorker').pm(function () {
                    var pmData = {};

                    pmData.insdrSubsId = sQuery.cookie('insdrSubsId') || '';
                    pmData.spUID = sQuery.cookie('spUID') || '';

                    return pmData;
                }, function (pmData) {
                    if (pmData.insdrSubsId != null) {
                        var conversionPushId = 2673;
                        var webPush = spApi.webPushes[conversionPushId];
                        var tempCamp = [];
                        var conversionName = 'ins-wp-' + webPush.id;

                        spApi.isWebPushInitialized = true;
                        spApi.pmData = pmData;

                        //This part can be unnessesary - START
                        tempCamp.push(webPush);
                        tempCamp = spApi.getCampOfThePage(tempCamp);
                        //END

                        if (flag) { //tempCamp false always, default assign true
                            var storageData = spApi.storageData(conversionName);

                            if (webPush.type === conversionPush) {
                                if (storageData === null) {
                                    spApi.activeConversionPushes.set.push(webPush);
                                } else {
                                    spApi.activeConversionPushes.update.push(webPush);
                                }
                            }
                        }

                        if (webPush.type === conversionPush && !flag) {
                            var storageData = spApi.storageData(conversionName);

                            if (storageData != null) {
                                spApi.activeConversionPushes.reset.push(webPush);
                            }
                        }

                        productInfo.utmSource = self.configs.utmSource;
                        productInfo.webPushTitle = self.configs.webPushTitle;

                        spApi.setConversionPushesForOPT4406(pmData, productInfo);
                        spApi.logger('info', 'Web Push ' + '-' + conversionPushId + '-' + ' initialized for OPT-4406');
                    }
                });
            });
        } catch (err) {
            spApi.errLog(err, {
                logType: 'getWebPushOfThePage',
                bugType: 'product'
            });
        }
    };

    spApi.setConversionPushesForOPT4406 = function (pmData, productInfo) {
        try {
            var webPushEndPoint = '//alfred.api.sociaplus.com/webpush/';
            var conversionPushId = '2673';

            spApi.logger('info', 'Web Push ' + '-' + conversionPushId + '-' + ' sended for OPT-4406');

            if (pmData.insdrSubsId != null) {
                sQuery.each(spApi.activeConversionPushes, function (type, data) {
                    sQuery.each(data, function (key, webPush) {
                        if (webPush.id === conversionPushId) {
                            var action = (type === 'reset') ? 'reset' : 'set';

                            sQuery.ajax({
                                type: 'POST',
                                url: webPushEndPoint + action + '?partnerName=lcwaikiki',
                                data: {
                                    campaignId: webPush.id,
                                    userId: pmData.spUID,
                                    token: pmData.insdrSubsId,
                                    type: action,
                                    timeout: webPush.pushTimeout,
                                    browser: spApi.getPushBrowserName(),
                                    //Dynamic Content - Start - Info For OPAM
                                    title: 
                                        spApi.parseDynamicPushContent(productInfo.webPushTitle).content,
                                    description: 
                                        spApi.parseDynamicPushContent(decodeURIComponent(productInfo.name)).content,
                                    link: 
                                        spApi.parseDynamicPushContent(productInfo.url + productInfo.utmSource).content,
                                    image: 
                                        spApi.parseDynamicPushContent(productInfo.img).content,
                                    buttonFirstUrl: '',
                                    buttonSecondUrl: '',
                                    banner: ''
                                    //Dynamic Content - End
                                },
                                cache: false,
                                contentType: 'application/json',
                                dataType: 'jsonp',
                                crossDomain: true,
                                async: true
                            });

                            var data = {
                                key: 'ins-wp-' + parseInt(webPush.id),
                                obj: {
                                    viDa: spApi.getTime(),
                                    'step1-displayed': true
                                },
                                campId: parseInt(webPush.id)
                            };

                            spApi.updateCookie(data, 'nolog');
                        }
                    });
                });
            }
        } catch (err) {
            spApi.errLog(err, {
                logType: 'setConversionPushes',
                bugType: 'product',
                extraData: {
                    param: spApi.activeConversionPushes
                }
            });
        }
    };

    self.init();
}({}));