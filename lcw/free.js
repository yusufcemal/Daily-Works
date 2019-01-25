if (typeof spApi.isApiReinited === 'undefined') {
    spApi.serialList = [
        '/kadin',
        '/erkek',
        '/genc-kiz',
        '/genc-erkek',
        '/cocuk-kiz',
        '/cocuk-erkek',
        '/bebek-kiz',
        '/bebek-erkek'
    ];

    spApi.getSerialName = function () {
        var url = window.location.href;

        return spApi.serialList.filter(function (item, index) {
            return url.indexOf(item) > -1;
        })[0] || '';
    };

    spApi.updateSerialVisitCounter = function () {
        var name = spApi.getSerialName();

        if (name !== '') {
            var list = JSON.parse(sQuery.cookie('serial-visit-counter') || '{}');

            list[name] = typeof list[name] !== 'undefined' ? list[name] + 1 : 1;

            sQuery.cookie('serial-visit-counter', JSON.stringify(list), {
                expire: 90,
                path: '/',
                domain: '.' + partner_site.host
            });
        }
    };

    spApi.getCurrentPageVisitCount = function (name) {
        var list = JSON.parse(sQuery.cookie('serial-visit-counter') || '{}');

        return typeof list[name] !== 'undefined' ? list[name] : '';
    };

    if (spApi.isOnCategoryPage() || spApi.isOnProductPage()) {
        spApi.updateSerialVisitCounter();
    }

    // Review Done for OPT - 8467

    /* SD-37391 and OPT-161 Start */
    /* userID using for unification do not remove. - web dev c3mb0 */
    var userID = ((typeof dataLayer !== 'undefined' ? dataLayer : []).filter(function (item) {
        return typeof item.CV_UserID !== 'undefined';
    })[0] || {}).CV_UserID || '';

    if (userID !== '' && sQuery.cookie('ins-CV_UserId') !== userID) {
        sQuery.cookie('ins-CV_UserId', userID, {
            expires: 1,
            path: '/',
            domain: '.' + partner_site.host
        });
    }
    /* SD-37391 and OPT-161 End */

    // SD-30723 update total cart amoutn cookie on basket adding.
    $(document).unbind('ajaxComplete.unique').bind('ajaxComplete.unique', function (e, x, s) {
        var oldValue;
        var productPrice;

        if (s.url.indexOf('/shop/addproducttocart') > -1 && JSON.parse(x.responseText || "{}").Message === "OK") {
            oldValue = parseFloat(sQuery.cookie('total-cart-amount')) || Number(sQuery('.header-cart-total').text().replace(/[^0-9,]/g, '').replace(',', '.'));
            productPrice = spApi.getCurrentProduct().price;

            sQuery.cookie('total-cart-amount', parseFloat((oldValue + productPrice).toFixed(2)), {
                expires: 14,
                path: '/',
                domain: partner_site.host
            });
        }
    });

    //SD-29171 start - SD-29221
    sQuery(document).on('click', '.order-payment #paymentTypeNav> li,#btn-cc-payment-confirm,[name*=btnpurchaseorder]', function () {
        $(document).ajaxComplete(function (event, xhr, settings) {
            if ((settings.url.indexOf("shop/getshoppingcartSecure") > -1)) {
                if (typeof window.afterPaymentBound === "undefined") {
                    window.afterPaymentBound = true;

                    setTimeout(function () {
                        spApi.reInitOnChange();
                    }, 1000);
                }
            }
        });
    });
    //SD-29171 finish - SD-29221

    sQuery.bounceCall = function (callback) {

        // bounce işlemleri tanımlanır
        if (!Boolean(spApi.bounceEventList)) {

            // bounce callbacklerinin tutulduğu dizi
            spApi.bounceEventList = [];

            // bounce u algılayan fonksiyonlar
            sQuery('html').live('mouseover', function (e) {
                window.spOver = 1;
            });
            sQuery('html').live('mouseout', function (event) {
                //var e = event.toElement || event.relatedTarget;
                //if (jQuery(this).has(e).length > 0 || jQuery(this).attr('id') == jQuery(e).attr('id')) return;

                if (event.clientY >= 0) return;

                window.spOver = 0;
                setTimeout(function () {
                    if (window.spOver == 0 && spApi.bounceEventList.length > 0) {

                        /* bounce olayına atanan eventlar çalıştırılır. */
                        sQuery.each(spApi.bounceEventList, function (key, callback) {
                            callback();
                        });
                        spApi.bounceEventList = [];
                    }
                }, 10);
            });
        }

        // bounce callback lerini diziye atar.
        if (Boolean(callback))
            spApi.bounceEventList.push(callback);
    };

    spApi.recommendationGaPush = {
        forImpressions: function (impression_products, currency) {
            dataLayer.push({
                'Category': 'Enhanced Ecommerce',
                'Action': 'Browse',
                'Label': 'Product Impressions',
                'Value': 0,
                'noninteraction': true,
                'ecommerce': {
                    'currencyCode': currency,
                    'impressions': impression_products
                },
                'event': 'eeEvent'
            });
        },

        forClicks: function (clicked_product, type) {
            dataLayer.push({
                'Category': 'Enhanced Ecommerce',
                'Action': 'Browse',
                'Label': 'Product Click',
                'Value': 0,
                'noninteraction': true,
                'ecommerce': {
                    'click': {
                        'actionField': {
                            'list': type
                        },
                        'products': clicked_product
                    }
                },
                'event': 'eeEvent'
            });
        }
    };

    /*SD-32595-- User attributes */
    if (spApi.isOnAfterPaymentPage()) {
        sQuery.cookie('insLastPurchasedProd', JSON.stringify(JSON.parse(spApi.storageData('paid-products') || '[]')[0] || {}), {
            expires: 1,
            path: '/',
            domain: "." + window.location.hostname.replace("www.", "")
        });
    }
    if (spApi.isOnCategoryPage() && spApi.getCategories().length > 0) {
        var currentCategory = spApi.getCategories() || [];
        if (currentCategory.length > 0) {
            var categoryCookie = JSON.parse(sQuery.cookie('ins-visited-categories') || '{}');
            if (!sQuery.isEmptyObject(categoryCookie)) {
                for (var i = 0; i < currentCategory.length; i++) {

                    if (categoryCookie[currentCategory[i]]) {
                        var count = parseInt(categoryCookie[currentCategory[i]]);
                        count++;
                        categoryCookie[currentCategory[i]] = String(count);
                    } else {
                        categoryCookie[currentCategory[i]] = '1';
                    }
                }
                sQuery.cookie('ins-visited-categories', JSON.stringify(categoryCookie), {
                    expires: 1,
                    path: '/',
                    domain: "." + window.location.hostname.replace("www.", "")
                });
            } else {
                for (var i = 0; i < currentCategory.length; i++) {

                    categoryCookie[currentCategory[i]] = '1';
                }
                sQuery.cookie('ins-visited-categories', JSON.stringify(categoryCookie), {
                    expires: 1,
                    path: '/',
                    domain: "." + window.location.hostname.replace("www.", "")
                });
            }
        }
        sQuery.cookie('insLastVisitedCategory', spApi.getCategories()[0], {
            expires: 1,
            path: '/',
            domain: "." + window.location.hostname.replace("www.", "")
        });

    }

    if (spApi.isOnProductPage()) {
        sQuery.cookie('insLastVisitedProd', JSON.stringify(spApi.getCurrentProduct()), {
            expires: 1,
            path: '/',
            domain: "." + window.location.hostname.replace("www.", "")
        });
    }

    if (typeof insider_object == 'undefined' || spApi.isOnAfterPaymentPage()) {
        var lastPurchasedProduct = JSON.parse(sQuery.cookie('insLastPurchasedProd') || "{}");
        var lastVisitedProduct = JSON.parse(sQuery.cookie('insLastVisitedProd') || "{}");
        var basketProducts = spApi.isOnCartPage() ? spApi.getPaidProducts() : (JSON.parse(spApi.storageData('paid-products') || '[]'));
        var prodCats = JSON.parse(spApi.storageData('prodCats')) || [];
        var lastVisitedCategories = JSON.parse(sQuery.cookie('ins-visited-categories') || '{}');

        if (prodCats.length > 0 || basketProducts.length > 0 || !sQuery.isEmptyObject(lastVisitedProduct) || !sQuery.isEmptyObject(lastPurchasedProduct) || !sQuery.isEmptyObject(lastVisitedCategories)) {
            var user = {
                location: JSON.parse(spApi.localStorageGet('userLocation') || '{}').city || '',
                totalBasketAmount: spApi.isOnCartPage() ? (spApi.getTotalCartAmount() || 0).toString() : Number(sQuery.cookie('total-cart-amount')).toString(),
                basketItemCount: spApi.isOnCartPage() ? (spApi.getPaidProducts().length || 0).toString() : basketProducts.length.toString(),
                lastVisitedProductName: (lastVisitedProduct.name) ? decodeURIComponent(lastVisitedProduct.name).trim() || "" : "",
                lastPurchasedDate: (lastPurchasedProduct.time) ? lastPurchasedProduct.time.toString() || '' : '',
                lastVisitedCategory: spApi.isOnCategoryPage() ? (spApi.getCategories()[0] || '') : (sQuery.cookie('insLastVisitedCategory')) || '',
                lastVisitedProductImage: lastVisitedProduct.img || "",
                lastPurchasedProductName: lastPurchasedProduct.name || "",
                lastPurchasedProductImage: lastPurchasedProduct.img || "",
                language: "tr_TR",
                bonusRouble: "0",
                basketItemName: (basketProducts[0] || {}).name || "",
                basketItemImage: (basketProducts[0] || {}).img || "",
                basketItemCategory: ((basketProducts.map(function (item) {
                    return prodCats.map(function (prodInfo) {
                        return decodeURIComponent(prodInfo.name).indexOf(item.name) > -1 ? prodInfo.cat : '';
                    });
                })[0] || [])[0]) || ""
            };

            if (typeof window.insider_object !== 'undefined' && typeof data !== 'undefined')
                window.insider_object.user = data;
            else if (typeof data !== 'undefined') {
                window.insider_object = {
                    'user': data
                };
            }

            if (typeof window.insider_object !== 'undefined' && typeof window.insider_object.user !== 'undefined') {
                for (var key in lastVisitedCategories) {
                    window.insider_object.user[key] = lastVisitedCategories[key];
                }
            }

        }
    }
    // ENDOF: SD-32595 - user attributes

    if (spApi.isOnAfterPaymentPage()) {
        spApi.localStorageSet('insLastPurchasedProd', JSON.stringify(JSON.parse(spApi.storageData('paid-products') || '[]')[0] || {}));
    }
    if (spApi.isOnProductPage()) {
        spApi.localStorageSet('insLastVisitedProd', JSON.stringify(spApi.getCurrentProduct()));
        spApi.localStorageSet('insLastVisitedCat', encodeURIComponent(spApi.getProductCategories().pop()));
    } else if (spApi.isOnCategoryPage()) {
        spApi.localStorageSet('insLastVisitedCat', encodeURIComponent(spApi.getCategories().pop()));
    }


    sQuery('.user-logout > a').click(function () {
        spApi.updateCartCount(0);
    });
    //SD-37526 start
    var categories = {
        'kadın': 1,
        'erkek': 1,
        'genç': 1,
        'genç kız': 1,
        'genç erkek': 1,
        'çocuk': 1,
        'kız çocuk': 1,
        'erkek çocuk': 1,
        'kız bebek': 1,
        'erkek bebek': 1
    };

    function getCategoriesFromUrl() {
        var url = window.location.href;
        var urlCategories = ['women', 'men', 'teen-girls', 'teen-boys', 'baby-girls', 'baby-boys', 'girls', 'boys'];
        var cat = '',
            isFound = false;
        urlCategories.forEach(function (item, index) {
            if (url.indexOf(item) > -1 && !isFound) {

                cat = item;
                isFound = true;
                return false;
            }
        });
        return cat;
    }

    var cat1 = [],
        tmpCat, isUrlHasCat = false;

    if (spApi.isOnCategoryPage()) {
        cat1 = spApi.getCategories();
    } else if (spApi.isOnProductPage()) {
        cat1 = spApi.getProductCategories();
    } else {
        spApi.localStorageRemoveItem('lastVisitedGenderCat');
    }

    var cat = getCategoriesFromUrl();

    if (cat !== '') {
        spApi.localStorageSet('lastVisitedGenderCat', cat);
        isUrlHasCat = true;
    } else
        spApi.localStorageRemoveItem('lastVisitedGenderCat');

    var isExists = false;
    (isUrlHasCat == false) && cat1.forEach(function (item, index) {
        tmpCat = sQuery.trim((item || '').toLowerCase());
        if (categories[tmpCat] == 1) {
            spApi.localStorageSet('lastVisitedGenderCat', tmpCat);
            isExists = true;
            return false;
        }
    });

    if (isExists == false && isUrlHasCat == false)
        spApi.localStorageRemoveItem('lastVisitedGenderCat');
    //SD-37526 end

    //SD-40921 start

    $(document).ajaxComplete(function (event, xhr, settings) {
        // OPT-5568 START
        if (settings.url.indexOf('/ajax/Shop/GetShoppingCart') > -1 && spApi.isOnProductPage()) {
            // OPT-5568 END
            var currentProduct = spApi.getCurrentProduct();
            currentProduct.name = decodeURI(currentProduct.name);

            sQuery.cookie('ins-added-product', JSON.stringify(currentProduct), {
                expires: 30,
                path: '/',
                domain: '.' + partner_site.host
            });
        }
    });

    //SD-40921 end
    // SD-41888 Start

    if (spApi.isOnCartPage()) {
        var reInitTimeout;
        var reInitApi = function () {
            if (typeof reInitTimeout !== 'undefined') {
                clearTimeout(reInitTimeout);
            }

            reInitTimeout = setTimeout(function () {
                spApi.webPushInitialized = false;
                spApi.reInitOnChange();
            }, 400);
        };

        var ajaxListener = function (cb) {
            var originalOpenFunction = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function (method, url) {
                originalOpenFunction.apply(this, arguments);
                this.addEventListener("readystatechange", function () {
                    if (this.readyState == 4 && this.status == 200) {
                        cb(url, this.responseText, method);
                    }
                });
            };
        };


        ajaxListener(function (url) {
            if (url.indexOf('deleteshoppingcartitem') !== -1) {
                setTimeout(function () {
                    if ((sQuery.cookie('ins-conversion-push-triggered-SD41888') === null || (spApi.getCartCount() === 0 &&
                            sQuery.cookie('ins-conversion-push-triggered-SD41888') === '1'))) {
                        reInitApi();
                    }
                }, 300);
            }
        });
    }

    // SD-41888 End
}
//--- End of reinited function ---

// OPT-2292 start
spApi.setCustomCookie = function (cookieName, data, expireTime) {
    sQuery.cookie(cookieName, data, {
        expires: expireTime,
        path: '/',
        domain: '.' + partner_site.host
    });
};

if (spApi.isOnCartPage()) {
    if (spApi.getCartCount() > 0) {
        spApi.setCustomCookie('ins-cart-abandonment', true, 365);
    } else {
        spApi.setCustomCookie('ins-cart-abandonment', false, 365);
    }

    sQuery(document).off('click.insCartReInit', '.sc-delete:visible')
        .on('click.insCartReInit', '.sc-delete:visible', function () {
            sQuery('.button:contains(Anasayfaya Git)').elementLoadComplete(function () {
                spApi.isWebPushInitialized = false;
                spApi.reInitOnChange();
            }, {
                i: 10,
                t: 15000
            });
        });
}

if (spApi.isOnAfterPaymentPage()) {
    spApi.setCustomCookie('ins-cart-abandonment', false, 365);
}
// OPT-2292 end

// unification test start - c3mb0
hashCode = function (s) {
    var h = 0,
        l = s.length,
        i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};

var iid = spApi.storageData('insider_id') || '';

var insiderData = {
    partner: partnerName,
    insider_id: iid,
    identifiers: {
        cvid: sQuery.cookie('ins-CV_UserId') || ''
    }
};

var sid = JSON.stringify(insiderData);
var sidh = hashCode(sid);

if (false && (!iid || sidh.toString() !== localStorage.getItem('sidh'))) {
    sQuery.ajax({
        url: 'https://unification.useinsider.com/get_insider_id',
        type: 'POST',
        data: sid,
        contentType: 'application/json',
        success: function (insider_id) {
            spApi.storageData('insider_id', insider_id, {
                expires: 30
            });
            localStorage.setItem('sidh', sidh);
        },
        timeout: 1000,
        async: true
    });
}

if (false && spApi.isOnProductPage() && spApi.storageData('insider_id')) {
    var productDetails = spApi.getCurrentProduct();
    sQuery.ajax({
        type: 'POST',
        url: 'https://unification.useinsider.com/hit/product',
        contentType: 'application/json',
        data: JSON.stringify({
            "partner": partnerName,
            "insider_id": spApi.storageData('insider_id'),
            "session_id": spApi.getGAStyleSesId(),
            "product_id": productDetails.id,
            "product_name": productDetails.name,
            "product_price": productDetails.price,
            "product_page_url": productDetails.url,
            "product_image_url": productDetails.img,
            "product_category": productDetails.cats
        }),
        timeout: 1000,
        async: true
    });
}
// unification test end - c3mb0

spApi.customGoal = function (builderId, goalId) {
    spApi.conLog('success');
    var goalOfCamp = spApi.personalizationCamps[builderId]['goalBuilderList'][goalId];

    if (typeof goalOfCamp === 'undefined') {
        return false;
    }

    if (goalOfCamp.type === 'rules') {
        goalOfCamp.goalList[0]['selectorString'] = 'true';
        spApi.addGoalTracking(true);
    }
};

//OPT-5924 START 
if (spApi.isOnProductPage() &&
    JSON.parse(JSON.parse(spApi.localStorageGet('insUserPermissionGranted') || '{}').data || '{}').state === true) {
    (function (self) {
        'use strict';

        self.construct = function () {
            self.setAjaxListener();
        };

        self.setAjaxListener = function () {
            self.ajaxListener(function (url, response, method) {
                if (url.indexOf('/ajax/Shop/GetShoppingCart') !== -1 && spApi.isOnProductPage()) {
                    self.saveUserAttr();
                    self.sendPush();
                }
            });
        };

        self.ajaxListener = function (cb) {
            var originalOpenFunction = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function (method, url) {
                originalOpenFunction.apply(this, arguments);
                this.addEventListener("readystatechange", function () {
                    if (this.readyState == 4 && this.status == 200) {
                        cb(url, this.responseText, method);
                    }
                });
            };
        };

        self.saveUserAttr = function () {
            var insCustomAttr = JSON.parse(spApi.storageData('insCustomAttributes') || '{}');
            var currentProduct = spApi.getCurrentProduct();

            insCustomAttr.lastaddedproductname = decodeURI(currentProduct.name);
            insCustomAttr.url_lastaddedproductimage = currentProduct.img;
            spApi.storageData('insCustomAttributes', JSON.stringify(insCustomAttr));
        };

        self.sendPush = function () {
            var originalWebPushesStack = spApi.webPushes;

            spApi.webPushes = [];
            spApi.webPushes.push(originalWebPushesStack[1896]);
            spApi.getWebPushOfThePage();
            spApi.webPushes = originalWebPushesStack;
            spApi.conversionPush1201Inited = true;
        };

        return self.construct();
    })({});
}
//OPT-5924 

// OPT-7585 START
(function (self) {
    self.run = function () {
        if (spApi.isOnProductPage()) {
            self.checkProductFromArray();
        }

        if (spApi.isOnAfterPaymentPage()) {
            self.createCookie();
        } else if (spApi.getCartCount() > 0 && sQuery.cookie('ins-user-has-item') === null) {
            self.createCookie();
        }
    };

    self.checkProductFromArray = function () {
        var productInfo = spApi.getCurrentProduct();

        if ((spApi.localStorageGet('ins-visited-product-list') || '[]').indexOf(productInfo.id) > -1) {
            var product = {
                name: productInfo.name,
                image: productInfo.img,
                url: productInfo.url
            };

            spApi.localStorageSet('ins-two-times-visited-product', JSON.stringify(product));
        } else {
            self.addProductToArray(productInfo.id);
        }
    };

    self.addProductToArray = function (productId) {
        var productList = JSON.parse(spApi.localStorageGet('ins-visited-product-list') || '[]');

        productList.push(productId);

        if (productList.length === 50) {
            productList.splice(-1, 1);
        }

        spApi.localStorageSet('ins-visited-product-list', JSON.stringify(productList));
    };

    self.createCookie = function () {
        sQuery.cookie('ins-user-has-item', true, {
            expires: 1,
            path: '/',
            domain: '.' + partner_site.host
        });
    };

    self.run();
})({});
// OPT-7585 END

/* DO NOT REMOVE  PA-4277*/
spApi.coeffInterval = setInterval(function () {
    if (sQuery.cookie('insL2pMid') === null && typeof spApi.coeff.l2pMid !== 'undefined' && spApi.coeff.l2pMid) {
        clearInterval(spApi.coeffInterval);

        if (!spApi.isMobileBrowser()) {
            spApi.showCustomCamp(spApi.getCamp('c1071').camp);
        } else if (spApi.deviceDetect('Mobil')) {
            spApi.showCustomCamp(spApi.getCamp('c1073').camp);
        } else if (spApi.deviceDetect('Tablet')) {
            spApi.showCustomCamp(spApi.getCamp('c1075').camp);
        }

        sQuery.cookie('insL2pMid', true, {
            expires: 1,
            path: '/',
            domain: partner_site.host
        });
    }
}, 100);

setTimeout(function () {
    if (typeof spApi.coeffInterval !== 'undefined') {
        clearInterval(spApi.coeffInterval);
    }
}, 1000 * 10);
/* DO NOT REMOVE  PA-4277*/

spApi.listenAjaxRequest = function (cb) {
    var originalOpenFunction = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        originalOpenFunction.apply(this, arguments);
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                cb(url, this.responseText, method);
            }
        });
    };
};