spApi.createRecommendationEngine = function (config) {
    var variationId = config.variationId;
    var recommendationTitle = config.recommendationTitle;
    var selector = config.selector;
    var insertType = config.insertType;
    var classNamePrefix = config.classNamePrefix;
    var productSize = config.productSize;
    var currency = config.currency;
    var currencyDisplay = config.currencyDisplay;
    var endPointUserBased = config.endPointUserBased;
    var endPointTopSeller = config.endPointTopSeller;
    var addBagIconSelector = '.ins-' + classNamePrefix + '-icon-shopping-bag';
    var addBagButtonSelector = '.ins-' + classNamePrefix + '-add-to-cart-bag-popup';
    var addWishListButtonSelector = '.ins-' + classNamePrefix + '-add-wish-popup-' + variationId;
    var dropdownButtonSelector = '.ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix +
        '-btn-group .ins-' + classNamePrefix + '-dropdown-menu';
    var self = this;

    self.construct = function () {
        self.reset();

        sQuery('.main-category-part').hide();
        sQuery('.ProductSales').hide();
        sQuery('.ProductSales.hide').hide();
        sQuery('.ProductSales').hide();

        self.getData(function (products) {
            self.addStyles();
            self.buildHtml(products);
            // OPT-9180 Start
            self.initSlider();
            self.setProductsBorder();
            // OPT-9180 End
            self.setClickEvent();
        });
    };

    self.reset = function () {
        sQuery('#ins-' + classNamePrefix + '-style-' + variationId).remove();
        sQuery('.ins-' + classNamePrefix + '-recommendation-title').remove();
        sQuery('.ins-' + classNamePrefix + '-product-sales').remove();
        sQuery('.ins-' + classNamePrefix + '-add-to-cart-bag-popup').remove();
        sQuery('.ins-' + classNamePrefix + '-popup-' + variationId + '').remove();
        sQuery('.main-category-part').show();
        sQuery('.ProductSales').show();
        sQuery('.ProductSales.hide').show();
        sQuery('.ProductSales').show();
    };

    self.getData = function (callback) {
        var userBasedProducts = [];
        var topSellerProducts = [];
        var totalProducts = [];
        var totalProductsIds = [];

        sQuery.ajax({
            type: 'GET',
            url: endPointUserBased,
            success: function (userBasedResponse) {
                if (((userBasedResponse || {}).data || []).length > productSize && typeof callback === 'function') {
                    userBasedProducts = self.shuffle(userBasedResponse.data).slice(0, productSize);
                    // OPT-9180 Start
                    sQuery(userBasedProducts).each(function () {
                        totalProductsIds.push(this.item_id);
                    });
                    // OPT-9180 End
                    sQuery.ajax({
                        type: 'GET',
                        url: endPointTopSeller,
                        success: function (topSellerResponse) {
                            if (((topSellerResponse || {}).data || []).length > productSize &&
                                typeof callback === 'function') {
                                // OPT-9180 Start
                                sQuery(topSellerResponse.data).each(function (index, element) {
                                    if (totalProductsIds.indexOf(element.item_id) > -1) {
                                        delete topSellerResponse.data[index];
                                    }
                                });
                                // OPT-9180 End
                                topSellerProducts = self.shuffle(topSellerResponse.data).slice(0, productSize);
                                totalProducts = userBasedProducts.concat(topSellerProducts);

                                callback(totalProducts);
                            }
                        }
                    });
                }
            }
        });
    };

    self.shuffle = function (products) {
        for (var index = 0; index < products.length - 1; index++) {
            var randomNumber = index + Math.floor(Math.random() * (products.length - index));
            var temporaryElement = products[randomNumber];

            products[randomNumber] = products[index];
            products[index] = temporaryElement;
        }

        return products;

    };

    self.addStyles = function () {
        var style = '<style id="ins-' + classNamePrefix + '-style-' + variationId + '">.ins-' + classNamePrefix + '-green-empty-btn a { background: transparent; margin: 0 auto; padding: 0 5px; text-align: center; color: #009AA9; display: block; width: 160px; font-size: 14px; font-weight: normal; border-radius: 4px; line-height: 38px; border: 1px solid #009AA9; } i.ins-' + classNamePrefix + '-icon-back-arrow { margin-left: 10px; display: inline-block; -webkit-transform: translateY(-2px) rotate(180deg) scale(0.6); -moz-transform: translateY(-2px) rotate(180deg) scale(0.6); -ms-transform: translateY(-2px) rotate(180deg) scale(0.6); transform: translateY(-2px) rotate(180deg) scale(0.6); vertical-align: middle; } i.ins-' + classNamePrefix + '-icon-back-arrow:before { content: "\\e805"; } .ins-' + classNamePrefix + '-green-empty-btn a:hover { background: #009AA9; color: #fff; } i.ins-' + classNamePrefix + '-icon-back-arrow { margin-left: 10px; display: inline-block; -webkit-transform: translateY(-2px) rotate(180deg) scale(0.6); -moz-transform: translateY(-2px) rotate(180deg) scale(0.6); -ms-transform: translateY(-2px) rotate(180deg) scale(0.6); transform: translateY(-2px) rotate(180deg) scale(0.6); vertical-align: middle; } .ins-' + classNamePrefix + '-buy.disabled { background: #9a9b9c !important; pointer-events: none; } .ins-' + classNamePrefix + '-icon-star02 { color: #dfdfdf } .ins-' + classNamePrefix + '-icon-star02:before { content: "\\e827"; } .ins-' + classNamePrefix + '-icon-shopping-bag:before { content: "\\e824"; } .ins-' + classNamePrefix + '-fade-out { visibility: hidden !important; opacity: 0; transition: visibility 0s 0.5s, opacity 0.5s linear; } .ins-' + classNamePrefix + '-fade-in { visibility: visible !important; opacity: 1; transition: opacity 0.5s linear; } .ins-' + classNamePrefix + '-add-bag-loading:before { animation: rotate360 2s linear infinite; content: "\\e84b"; } @media (max-width: 767px) { .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup:before { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid rgba(0, 0, 0, .1); content: ""; bottom: -8px; left: 50%; position: absolute; margin-left: -8px; left: auto; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top { font-size: 0; white-space: nowrap; line-height: 35px; height: 35px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-num { display: inline-block; width: 35px; height: 35px; line-height: 35px; color: #fff; background: #ffbc3d; font-size: 14px; border-radius: 50%; text-align: center; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-items { text-align: left; display: inline-block; height: 35px; margin-left: 5px; line-height: 35px; color: #4a4a4a; font-size: 14px; border-radius: 50%; white-space: nowrap; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom { text-align: right; line-height: 14px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom a { text-decoration: underline; color: #4a4a4a; font-size: 12px; } } @media (max-width: 979px) and (min-width: 768px) { .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup:before { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid rgba(0, 0, 0, .1); content: ""; bottom: -8px; left: 50%; position: absolute; margin-left: -8px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top { font-size: 0; white-space: nowrap; line-height: 35px; height: 35px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-num { display: inline-block; width: 35px; height: 35px; line-height: 35px; color: #fff; background: #ffbc3d; font-size: 14px; border-radius: 50%; text-align: center; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-items { text-align: left; display: inline-block; height: 35px; margin-left: 5px; line-height: 35px; color: #4a4a4a; font-size: 14px; border-radius: 50%; white-space: nowrap; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom { text-align: right; line-height: 14px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom a { text-decoration: underline; color: #4a4a4a; font-size: 12px; } } @media (min-width: 980px) { .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup:before { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid rgba(0, 0, 0, .1); content: ""; bottom: -8px; left: 50%; position: absolute; margin-left: -8px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top { font-size: 0; white-space: nowrap; line-height: 35px; height: 35px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-num { display: inline-block; width: 35px; height: 35px; line-height: 35px; color: #fff; background: #ffbc3d; font-size: 14px; border-radius: 50%; text-align: center; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-top .ins-' + classNamePrefix + '-items { text-align: left; display: inline-block; height: 35px; margin-left: 5px; line-height: 35px; color: #4a4a4a; font-size: 14px; border-radius: 50%; white-space: nowrap; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom { text-align: right; line-height: 14px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup .ins-' + classNamePrefix + '-bottom a { text-decoration: underline; color: #4a4a4a; font-size: 12px; } } .ins-' + classNamePrefix + '-buy i:hover { cursor: pointer; } a.ins-' + classNamePrefix + '-wishlist-dom i:hover { color: #e600a0; } .ins-' + classNamePrefix + '-recommendation-title { margin-top: 5px; padding: 15px 0; font-weight: 500; font-size: 16px; color: #43484D; text-align: center; } .ins-' + classNamePrefix + '-product-item-container { border: 0; height: inherit; margin: 0; } .ins-' + classNamePrefix + '-product-item-photo {} .ins-' + classNamePrefix + '-product-sales a { color: #337ab7; text-decoration: none; background-color: transparent; } .ins-' + classNamePrefix + '-icon-wishlist { display: block; color: #9a9b9c; } .ins-' + classNamePrefix + '-icon-wishlist:before { content: "\\e818"; } [class*=" ins-' + classNamePrefix + '-icon-"]:before, [class^=ins-' + classNamePrefix + '-icon-]:before { margin: 0; width: auto; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-buy { position: absolute; right: 0px; bottom: 0px; width: 40px; height: 30px; background: #009aa9; color: #fff; font-size: 18px; text-align: center; line-height: 30px; border-radius: 4px; } .ins-' + classNamePrefix + '-buy i { display: inline-block; } [class*=" ins-' + classNamePrefix + '-icon-"]:before, [class^=ins-' + classNamePrefix + '-icon-]:before { font-family: fontello; font-style: normal; font-weight: 400; speak: none; display: inline-block; text-decoration: inherit; width: 1em; margin-right: .2em; text-align: center; font-variant: normal; text-transform: none; line-height: 1em; margin-left: .2em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } .ins-' + classNamePrefix + '-promotion-button {} .ins-' + classNamePrefix + '-icon-star01:before { content: "\\e826"; } @media only screen and (min-width: 1280px) { .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-bottom-product-sales { margin: 0 -5px; margin-top: 20px; display: inline-block; } .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-product-item-container { height: auto; width: 20%; padding: 5px; float: left; display: block; } .ins-' + classNamePrefix + '-product-item-photo-container { padding-top: 15px; position: relative; } .ins-' + classNamePrefix + '-product-link img { height: 205px; width: auto; } .ins-' + classNamePrefix + '-brand-icon { position: absolute; left: 0; top: 0; } .ins-' + classNamePrefix + '-like { position: absolute; right: 0; top: 0; }' +
            ' .ins-' + classNamePrefix + '-like i { font-size: 18px; } .ins-' + classNamePrefix + '-promotion-button { height: 30px; } .ins-' + classNamePrefix + '-promotion-button a { font-size: 12px; color: #e600a0; display: block; line-height: 30px; height: 30px; text-align: center; border: 1px solid #e600a0; border-radius: 5px; } .ins-' + classNamePrefix + '-product-name-info { position: relative; padding: 0 3px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h1 { margin: 0; font-weight: 400; margin-top: 5px; font-size: 14px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; height: 54px; color: #4a4a4a; -webkit-box-orient: vertical; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h2 { margin: 0; margin-top: 5px; font-size: 18px; color: #e600a0; font-weight: 500; height: 23px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 { margin: 0; font-weight: 400; height: 16px; font-size: 0; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 del { font-size: 14px; color: #8e8e8c; line-height: 16px; vertical-align: middle; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 { margin: 0; font-weight: 400; margin-top: 5px; height: 19px; font-size: 12px; line-height: 19px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 .ins-' + classNamePrefix + '-icon-star01 { color: #fcbc3d; vertical-align: top; } .ins-' + classNamePrefix + '-only-at-watsons { margin-bottom: 5px; display: block; width: 40px; } } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 span { font-size: 12px; color: rgba(0, 0, 0, .5); font-weight: 500; vertical-align: top; } @media only screen and (min-width: 980px) { .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-bottom-product-sales { margin: 0 -5px; margin-top: 20px; display: inline-block; } .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-product-item-container { width: 20%; display: block; margin-bottom: 20px; height: 349.13px; float: left; padding: 5px; } .ins-' + classNamePrefix + '-product-item-photo-container { padding-top: 11px; position: relative; } .ins-' + classNamePrefix + '-product-link img { height: 163px; display: block; margin: 0 auto; } .ins-' + classNamePrefix + '-brand-icon { position: absolute; left: 0; top: 0; } .ins-' + classNamePrefix + '-like { position: absolute; right: 0; top: 0; cursor: pointer; } .ins-' + classNamePrefix + '-like i { font-size: 18px; } .ins-' + classNamePrefix + '-promotion-button { height: 24px; } .ins-' + classNamePrefix + '-promotion-button a { font-size: 12px; color: #e600a0; display: block; line-height: 24px; height: 24px; text-align: center; border: 1px solid #e600a0; border-radius: 5px; } .ins-' + classNamePrefix + '-product-name-info { position: relative; padding: 0 3px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h1 { margin: 0; font-weight: 400; margin-top: 5px; font-size: 14px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; height: 54px; -webkit-box-orient: vertical; color: #4a4a4a; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h2 { margin: 0; margin-top: 5px; font-size: 18px; color: #e600a0; font-weight: 500; height: 23px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 { margin: 0; font-weight: 400; height: 16px; font-size: 0; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 del { font-size: 14px; color: #8e8e8c; line-height: 16px; vertical-align: middle; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 { margin: 0; font-weight: 400; margin-top: 5px; height: 19px; font-size: 12px; line-height: 19px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 .ins-' + classNamePrefix + '-icon-star01 { vertical-align: top; color: #fcbc3d; } .ins-' + classNamePrefix + '-only-at-watsons { margin-bottom: 5px; display: block; width: 40px; } } @media (max-width: 979px) and (min-width: 768px) { .ins-' + classNamePrefix + '-recommendation-title { padding: 20px; font-weight: 500; font-size: 16px; color: #43484D; background: #fff; text-align: center; } .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-bottom-product-sales { margin: 0 -5px; margin-top: 20px; display: inline-block; } .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-product-item-container { width: 20%; display: block; margin-bottom: 20px; float: left; height: 349.13px; padding: 5px; } .ins-' + classNamePrefix + '-product-item-photo-container { padding-top: 11px; position: relative; } .ins-' + classNamePrefix + '-product-link img { height: 163px; display: block; margin: 0 auto; } .ins-' + classNamePrefix + '-brand-icon { position: absolute; left: 0; top: 5px; } .ins-' + classNamePrefix + '-like { position: absolute; right: 0; top: 0; cursor: pointer; } .ins-' + classNamePrefix + '-like i { font-size: 18px; } .ins-' + classNamePrefix + '-promotion-button { height: 24px; } .ins-' + classNamePrefix + '-promotion-button a { font-size: 12px; color: #e600a0; display: block; line-height: 24px; height: 24px; text-align: center; border: 1px solid #e600a0; border-radius: 5px; } .ins-' + classNamePrefix + '-product-name-info { position: relative; padding: 0 3px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h1 { margin: 0; font-weight: 400; margin-top: 5px; font-size: 14px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; height: 54px; -webkit-box-orient: vertical; color: #4a4a4a; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h2 { margin: 0; margin-top: 5px; font-size: 18px; color: #e600a0; font-weight: 500; height: 23px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 { margin: 0; font-weight: 400; height: 16px; font-size: 0; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 del { font-size: 14px; color: #8e8e8c; line-height: 16px; vertical-align: middle; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 { margin: 0; font-weight: 400; margin-top: 5px; height: 19px; font-size: 12px; line-height: 19px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 .ins-' + classNamePrefix + '-icon-star01 { color: #fcbc3d; vertical-align: top; } .ins-' + classNamePrefix + '-only-at-watsons { margin-bottom: 5px; display: block; width: 40px; } .ins-' + classNamePrefix + '-product-sales { padding: 0 20px; background: #fff; } } @media (max-width: 767px) { .ins-' + classNamePrefix + '-recommendation-title { margin-top: 13px; padding: 10px 15px; font-weight: 500; font-size: 14px; color: #43484D; background: #fff; text-align: center; } .ins-' + classNamePrefix + '-product-sales { padding: 0 15px; background: #fff; width: 100%; overflow: visible ! important; margin-top: 20px;} .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-bottom-product-sales { margin: 0 -15px; margin-top: -15px; padding: 0 5px; } .ins-' + classNamePrefix + '-product-sales .ins-' + classNamePrefix + '-product-item-container { width: 50%; padding: 10px 5px; float: left; display: block; border-left: 0.2px solid #e8e8e8; } .ins-' + classNamePrefix + '-product-item-photo-container { padding: 10px 0; position: relative; } .ins-' + classNamePrefix + '-product-link img { width: 100%; display: block; margin: 0 auto; margin-right: 0; } .ins-' + classNamePrefix + '-brand-icon { position: absolute; left: 0; top: 5px; } .ins-' + classNamePrefix + '-like { position: absolute; right: -30px; top: 5px; } .ins-' + classNamePrefix + '-like i { font-size: 14px; } .ins-' + classNamePrefix + '-promotion-button { height: 15px; } .ins-' + classNamePrefix + '-promotion-button a { font-size: 10px; color: #e600a0; display: block; line-height: 19px; height: 18px; text-align: center; border: 1px solid #e600a0; border-radius: 4px; min-width: 108px; margin-right :-30px; } .ins-' + classNamePrefix + '-product-name-info { position: relative; padding: 0 3px; color: #4a4a4a; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h1 { margin: 0; font-weight: 400; margin-top: 5px; font-size: 12px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; height: 45px; -webkit-box-orient: vertical; margin-right:-30px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h2 { margin: 0; margin-top: 5px; font-size: 12px; color: #e600a0; font-weight: 500; height: 15px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 { margin: 0; font-weight: 400; height: 16px; font-size: 0; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h3 del { font-size: 11px; color: #8e8e8c; line-height: 16px; vertical-align: middle; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 { margin: 0; font-weight: 400; margin-top: 5px; height: 19px; font-size: 8px; line-height: 19px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 span { font-size: 9px; color: rgba(0, 0, 0, .5); font-weight: 500; vertical-align: top; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-buy { position: absolute; right: 0px; bottom: 0px; width: 28px; height: 20px; background: #009aa9; color: #fff; font-size: 14px; text-align: center; line-height: 22px; border-radius: 4px; right: -30px; } .ins-' + classNamePrefix + '-green-empty-btn a { background: transparent; margin: 0 auto; padding: 0 5px; text-align: center; color: #009AA9; display: block; width: 135px; font-size: 12px; font-weight: normal; border-radius: 4px; line-height: 25px; border: 1px solid #009AA9; margin-top: 10px; } .ins-' + classNamePrefix + '-product-name-info .ins-' + classNamePrefix + '-h4 .ins-' + classNamePrefix + '-icon-star01 { color: #fcbc3d; vertical-align: top; } .ins-' + classNamePrefix + '-only-at-watsons { margin-bottom: 5px; display: block; width: 30px; } }</style>';

        sQuery('head').append(style);
    };

    self.buildHtml = function (products) {
        var html = '<div class="ins-' + classNamePrefix + '-recommendation-title">' + recommendationTitle + '</div>' +
            // OPT-9180 Start
            '<div class="ins-' + classNamePrefix + '-product-sales swiper-container">' +
            '<div class="ins-' + classNamePrefix + '-bottom-product-sales swiper-wrapper">' +
            self.buildEachRecommendationItemHtml(products.slice(0, 5)) +
            '</div>' +
            '</div>' +
            '<div class="ins-' + classNamePrefix + '-product-sales swiper-container">' +
            '<div class="ins-' + classNamePrefix + '-bottom-product-sales swiper-wrapper">' +
            self.buildEachRecommendationItemHtml(products.slice(5, 10)) +
            '</div>' +
            '</div>' +
            // OPT-9180 End
            '<div class="ins-' + classNamePrefix + '-green-empty-btn">' +
            '<a href="https://www.watsons.com.tw/c/bestSeller">更多' +
            '<i class="ins-' + classNamePrefix + '-icon-back-arrow"></i></a>' +
            '</div>';

        if (insertType === 'after') {
            sQuery(selector).after(html);
        } else if (insertType === 'prepend') {
            sQuery(selector).prepend(html);
        } else if (insertType === 'append') {
            sQuery(selector).append(html);
        } else if (insertType === 'before') {
            sQuery(selector).before(html);
        }
    };

    self.buildEachRecommendationItemHtml = function (products) {
        var html = '';

        sQuery.each(products, function () {
            var seasonalPromotionImage = this.product_attributes.seasonal_promotions;
            var starsLength = this.product_attributes.product_stars;
            var starReview = this.product_attributes.product_number_of_review;
            var watsonsImage = this.product_attributes.onlywatsons_img_url;
            var promotionText = this.product_attributes.product_promotion;
            var productName = this.name.replace(' ', ' ');

            // OPT-9180 Start
            html += '<div class="ins-' + classNamePrefix + '-product-item-container swiper-slide">' +
                // OPT-9180 End
                '<div class="ins-' + classNamePrefix + '-product-item-photo-container">' +
                '<div class="ins-' + classNamePrefix + '-product-item-photo">' +
                '<a class="ins-' + classNamePrefix + '-product-link sp-custom-' + variationId + '-1" href="' +
                this.url + '">' +
                '<img src="' + this.image_url + '">' +
                '</a></div>' +
                '<div class="ins-' + classNamePrefix + '-brand-icon">';

            if (seasonalPromotionImage !== undefined && seasonalPromotionImage !== '') {
                html += '<img class="ins-' + classNamePrefix + '-promo-icon" src="' + seasonalPromotionImage + '">';
            }

            if (watsonsImage !== undefined && watsonsImage !== '') {
                html += '<img class="ins-' + classNamePrefix + '-only-at-watsons" src="' + watsonsImage + '">';
            }

            html += '</div>' +
                '<div class="ins-' + classNamePrefix + '-like">' +
                '<a href="javascript:void(0);" class="ins-' + classNamePrefix + '-wishlist-dom sp-custom-' +
                variationId + '-2" ' +
                'data-code="' + this.item_id + '">' +
                '<i class="ins-' + classNamePrefix + '-wishlist-icon ins-' + classNamePrefix + '-icon-wishlist"></i>' +
                '</a></div></div>' +
                '<div class="ins-' + classNamePrefix + '-promotion-button">';

            if (promotionText !== undefined && promotionText !== '') {
                html += '<a class="ins-' + classNamePrefix + '-promotion-link sp-custom-' + variationId + '-1" href="' +
                    this.url + '">' +
                    promotionText + '</a>';
            }

            html += '</div><div class="ins-' + classNamePrefix + '-product-name-info">' +
                '<a class="ins-' + classNamePrefix + '-product-link sp-custom-' + variationId + '-1" href="' +
                this.url + '">' +
                '<div class="ins-' + classNamePrefix + '-h1">' + productName + '</div>' +
                '</a>' +
                '<div class="ins-' + classNamePrefix + '-h2">' + currencyDisplay + '' + this.price[currency] +
                '</div>' +
                '<div class="ins-' + classNamePrefix + '-h3"><del>' + currencyDisplay + '' +
                this.original_price[currency] + '</del></div>' +
                '<div class="ins-' + classNamePrefix + '-h4">';

            if (starsLength !== undefined && starsLength !== '') {
                for (var i = 1; i <= 5; i++) {
                    if (i <= starsLength) {
                        html += '<i class="ins-' + classNamePrefix + '-icon-star01"></i>';
                    } else {
                        html += '<i class="ins-' + classNamePrefix + '-icon-star02"></i>';
                    }
                }
            }

            if (starReview !== undefined && starReview !== '' || starReview !== 0) {
                html += '<span>(' + starReview + ')</span>';
            }
            html += '</div>' +
                '<div class="ins-' + classNamePrefix + '-buy sp-custom-' + variationId + '-3" data-code="' +
                this.item_id + '" ' +
                'data-user-not-logged="true" data-qty="1">' +
                '<i class="ins-' + classNamePrefix + '-icon-shopping-bag"></i>' +
                '</div></div></div>';
        });

        return html;
    };
    // OPT-9180 Start
    self.initSlider = function () {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 2.5,
            spaceBetween: 30,
            freeMode: true
        });
    };

    self.setProductsBorder = function () {
        sQuery('.ins-homepage-product-sales .ins-homepage-bottom-product-sales').each(function () {
            sQuery('.ins-homepage-product-item-container:first', this).css('border-left', 'none');
        });
    };
    // OPT-9180 End
    self.setClickEvent = function () {
        var addCartButtonSelector = '.ins-' + classNamePrefix + '-buy';

        sQuery(addCartButtonSelector).off('click.insClickAddBag' + variationId)
            .on('click.insClickAddBag' + variationId, function () {
                var currentElement = this;
                var productId = sQuery(currentElement).attr('data-code') || '';

                self.appendAddBagPopupHtml(currentElement);

                sQuery(this).addClass('ins-clicked');
                sQuery(addBagIconSelector, currentElement).addClass('ins-' + classNamePrefix + '-add-bag-loading');
                sQuery(addCartButtonSelector + ':not(.ins-clicked)').addClass('disabled');

                sQuery.get('https://www.watsons.com.tw/minicart/add?productCodePost=' + productId + '&' +
                    'codeVariant=' + productId + '&qty=1',
                    function () {
                        sQuery(addBagIconSelector).removeClass('ins-' + classNamePrefix + '-add-bag-loading');
                        sQuery(addBagButtonSelector).addClass('ins-' + classNamePrefix + '-fade-in');
                        sQuery(addCartButtonSelector).removeClass('disabled');
                        sQuery(addCartButtonSelector).removeClass('ins-clicked');
                        sQuery('#myBasket span').text(spApi.getCartCount() + 1);

                        setTimeout(function () {
                            sQuery(addBagButtonSelector).removeClass('ins-' + classNamePrefix + '-fade-in');
                            sQuery(addBagButtonSelector).addClass('ins-' + classNamePrefix + '-fade-out');
                        }, 2000);
                    });
            });

        sQuery('.ins-' + classNamePrefix + '-wishlist-icon').off('click.insClickAddWish' + variationId)
            .on('click.insClickAddWish' + variationId, function () {
                if (spApi.isUserLoggedIn()) {
                    var currentElement = (sQuery(this) || [])[0].parentNode || {};
                    var productId = sQuery(currentElement).attr('data-code') || '';

                    self.appendAddWishListPopupHtml(currentElement, productId);
                } else {
                    window.location.href = 'https://www.watsons.com.tw/login';
                }

            });
    };

    self.appendAddBagPopupHtml = function (currentElement) {
        if (!sQuery(addBagButtonSelector, currentElement).exists()) {
            var popupHtml = '<div class="ins-' + classNamePrefix + '-add-to-cart-bag-popup">' +
                '<div class="ins-' + classNamePrefix + '-top">' +
                '<div class="ins-' + classNamePrefix + '-num">1</div>' +
                '<div class="ins-' + classNamePrefix + '-items">個商品加入購物袋</div>' +
                '</div>' +
                '<div class="ins-' + classNamePrefix + '-bottom">' +
                '<a href="/checkoutstepone">結帳</a>' +
                '</div></div>';

            sQuery(addBagButtonSelector).remove();
            sQuery('.ins-' + classNamePrefix + '-popup-' + variationId + '').remove();

            self.appendAddBagPopupStyle(currentElement);

            sQuery(currentElement).append(popupHtml);
        }
    };

    self.appendAddBagPopupStyle = function (currentElement) {
        if (window.innerWidth - sQuery(currentElement).offset().left > 160) {
            sQuery('head').append('<style class="ins-' + classNamePrefix + '-popup-' + variationId + '">.ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup { position: absolute; left: 50%; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); padding: 8px; border-radius: 5px; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .5); visibility: hidden; z-index: 1; top: -75px; } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup:after { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #fff; content: ""; bottom: -6px; position: absolute; margin-left: -8px; }</style>');
        } else {
            sQuery('head').append('<style class="ins-' + classNamePrefix + '-popup-' + variationId + '">.ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup { right: 0; position: absolute; padding: 8px; border-radius: 5px; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .5); visibility: hidden; z-index: 1; top: -75px; transform: translateX(0) } .ins-' + classNamePrefix + '-buy .ins-' + classNamePrefix + '-add-to-cart-bag-popup:after { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #fff; content: ""; bottom: -6px; position: absolute; margin-left: -8px; right:12px;}</style>');
        }
    };

    self.appendAddWishListPopupHtml = function (currentElement, productId) {
        if (!sQuery(addWishListButtonSelector, currentElement).exists()) {
            var loaderImageHtml = '<img class="ins-' + classNamePrefix + '-whis-list-loader" ' +
                'src="https://image.useinsider.com/watsonsmy/c63/K3BVTUjZPWNdrtdui5pb1547726460.gif">';

            sQuery('body').append(loaderImageHtml);

            sQuery.get('https://www.watsons.com.tw/*/p/*/showAllWishList/', function (response) {
                var popupHtml = '<div class="ins-' + classNamePrefix + '-add-wish-popup-' + variationId + '" ' +
                    'style="display: block;">' +
                    '<form>' +
                    '<div class="ins-' + classNamePrefix + '-title">選擇購物清單</div>' +
                    '<i class="ins-' + classNamePrefix + '-icon-close ins-' + classNamePrefix + '-close-btn"></i>' +
                    '<div class="ins-' + classNamePrefix + '-reset-bootstrp-select ' +
                    'ins-' + classNamePrefix + '-size5">' +
                    '<div class="ins-' + classNamePrefix + '-btn-group ins-' + classNamePrefix + '-bootstrap-select" ' +
                    'style="width: 100%;">' +
                    '<button type="button" class="ins-' + classNamePrefix + '-btn ins-' + classNamePrefix +
                    '-dropdown-toggle ins-' + classNamePrefix + '-btn-default" data-toggle="dropdown"' +
                    ' role="button" title="建立一個新的清單">' +
                    '<span class="ins-' + classNamePrefix + '-filter-option ins-' + classNamePrefix +
                    '-pull-left">建立一個新的清單</span> ' +
                    '<span class="ins-' + classNamePrefix + '-bs-caret"><span class="ins-' + classNamePrefix +
                    '-caret"></span></span></button>' +
                    '<div class="ins-' + classNamePrefix + '-dropdown-menu ins-' + classNamePrefix + '-open" ' +
                    'role="combobox"style="overflow: hidden;' +
                    'min-height: 0;"> ' +
                    '<ul class="ins-' + classNamePrefix + '-dropdown-menu ins-' + classNamePrefix + '-inner" ' +
                    'role="listbox" aria-expanded="false">' +
                    '<li data-original-index="0" class="selected" wishlistpk="-1">' +
                    '<a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" ' +
                    'aria-selected="true">' +
                    '<span class="text">建立一個新的清單</span><span class="ins-' + classNamePrefix +
                    '-glyphicon ins-' + classNamePrefix + '-glyphicon-ok ' +
                    'ins-' + classNamePrefix + '-check-mark"></span>' +
                    '</a></li>';

                if (response.length > 0) {
                    sQuery(response).each(function (index, element) {
                        popupHtml += '<li data-original-index="' + (index + 1) + '" wishlistpk="' + element.pk + '">' +
                            '<a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" ' +
                            'aria-selected="false">' +
                            '<span class="ins-' + classNamePrefix + '-text">' + element.name + '</span><span ' +
                            'class="ins-' + classNamePrefix + '-glyphicon ' +
                            'ins-' + classNamePrefix + '-glyphicon-ok ins-' + classNamePrefix + '-check-mark"></span>' +
                            '</a></li>';
                    });
                }

                popupHtml += '</ul></div>' +
                    '<select class="ins-' + classNamePrefix + '-selectpicker" data-width="100%" name="wishlistpk" ' +
                    'tabindex="-98">' +
                    '<option value="-1">建立一個新的清單</option>' +
                    '</select>' +
                    '</div></div>' +
                    '<div class="ins-' + classNamePrefix + '-input" style="display: block;">' +
                    '<input type="text" name="wishlistName" autocomplete="off" placeholder="列表名稱">' +
                    '</div>' +
                    '<div class="ins-' + classNamePrefix + '-add-warning"></div>' +
                    '<div class="ins-' + classNamePrefix + '-green-btn"><a href="javascript:void(0);">儲存</a></div>' +
                    '<div class="ins-' + classNamePrefix + '-hidden ins-' + classNamePrefix +
                    '-wishlist-maximum-lists">Your list has reached the limit</div>' +
                    '<div class="ins-' + classNamePrefix + '-hidden ins-' + classNamePrefix +
                    '-wishlist-maximum-items">Your item has reached the limit</div>' +
                    '<input type="hidden" name="quantity" value="1">' +
                    '</form></div>';

                sQuery('.ins-' + classNamePrefix + '-wish-popup-' + variationId).remove();
                sQuery('.ins-' + classNamePrefix + '-wish-popup-general-' + variationId).remove();
                sQuery(addWishListButtonSelector).remove();

                self.appendAddWishListPopupStyle(currentElement);

                sQuery('body').append('<div class="ins-' + classNamePrefix + '-overlay"></div>');

                sQuery('.ins-' + classNamePrefix + '-whis-list-loader').remove();

                sQuery(currentElement).append(popupHtml);

                self.setDropdownClickEvents(currentElement, productId);
            });
        }
    };

    self.appendAddWishListPopupStyle = function (currentElement) {
        var addWishListIconTop = sQuery('.ins-' + classNamePrefix + '-wishlist-icon.ins-' + classNamePrefix +
            '-icon-wishlist').offset().top - 210;

        sQuery('head').append('<style class="ins-' + classNamePrefix + '-wish-popup-general-' + variationId + '">.ins-' + classNamePrefix + '-overlay { position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' .ins-' + classNamePrefix + '-title { font-weight: 500; font-size: 14px; color: #4a4a4a; letter-spacing: 0; line-height: 20px; text-align: left; margin-bottom: 10px; } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' .ins-' + classNamePrefix + '-icon-close { position: absolute; right: 10px; top: 10px; cursor: pointer; line-height: normal; font-size: 18px; color: #9a9b9c!important; } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' .ins-' + classNamePrefix + '-icon-close:before { content: "\\e80c"; } .ins-' + classNamePrefix + '-reset-bootstrp-select { line-height: normal; margin-bottom: 12px; } .ins-' + classNamePrefix + '-dropdown-toggle { border-bottom: 0!important; border-radius: 4px 4px 0 0; border: 1px solid #dfdfdf!important; padding-top: 0; padding-bottom: 0; padding-left: 13px; line-height: 40px; height: 40px; color: #4a4a4a!important; background: #fff!important; outline: 0!important; -webkit-box-shadow: none!important; box-shadow: none!important; font-size: 14px; border-radius: 4px; } .ins-' + classNamePrefix + '-filter-option{ overflow: hidden; text-overflow: ellipsis; padding-right: 10px; display: inline-block; width: 100%; text-align: left; } .ins-' + classNamePrefix + '-pull-left { float: left!important; } .ins-' + classNamePrefix + '-caret { -webkit-transform: rotate(0) scale(.6); -moz-transform: rotate(0) scale(.6); -ms-transform: rotate(0) scale(.6); transform: rotate(0) scale(.6); right: 10px; top: 0; border: 0; font-size: 12px; height: 40px; line-height: 40px; margin-top: 0; color: #9a9b9c; width: 20px; -webkit-transform: rotate(180deg) scale(.6); -moz-transform: rotate(180deg) scale(.6); -ms-transform: rotate(180deg) scale(.6); transform: rotate(180deg) scale(.6); position: absolute; vertical-align: middle; margin-left: 0; display: inline-block; } .ins-' + classNamePrefix + '-caret:before { content: "\\e817"; font-family: fontello; font-style: normal; font-weight: 400; speak: none; display: inline-block; text-decoration: inherit; width: auto; margin-right: 0; text-align: center; font-variant: normal; text-transform: none; line-height: auto; margin-left: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } .ins-' + classNamePrefix + '-dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 160px; padding: 5px 0; /* margin: 2px 0 0; */ list-style: none; font-size: 14px; text-align: left; background-color: #fff; border: 1px solid #ccc; border: 1px solid rgba(0,0,0,.15); border-radius: 4px; -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175); box-shadow: 0 6px 12px rgba(0,0,0,.175); -webkit-background-clip: padding-box; background-clip: padding-box; } .ins-' + classNamePrefix + '-dropdown-menu.ins-' + classNamePrefix + '-inner { max-height: 195px!important; position: static; float: none; border: 0!important; padding: 0!important; border-radius: 0!important; box-shadow: none!important; min-width: 100%; box-sizing: border-box; } .ins-' + classNamePrefix + '-dropdown-menu li { position: relative; } select.ins-' + classNamePrefix + '-selectpicker { display: inline !important; visibility: hidden; position: absolute!important; bottom: 0; left: 50%; display: block!important; width: .5px!important; height: 100%!important; padding: 0!important; opacity: 0!important; border: none; } .ins-' + classNamePrefix + '-input{ margin-bottom: 12px; } .ins-' + classNamePrefix + '-add-warning { margin-bottom: 12px; color: #e42313; line-height: normal; font-size: 12px; text-align: left; display: none; } .ins-' + classNamePrefix + '-green-btn a { width: 100%; background: #009aa9; margin: 0 auto; padding: 0 5px; text-align: center; color: #fff; display: block; font-size: 14px; font-weight: 400; border-radius: 4px; line-height: 38px; border: 1px solid #009aa9; cursor: pointer; } .ins-' + classNamePrefix + '-hidden{ display: none!important; } .ins-' + classNamePrefix + '-input input[type=text] { display: block; width: 100%; border: 1px solid #dfdfdf; border-radius: 4px; height: 40px; padding: 0 13px; font-size: 14px; outline: 0; -webkit-transition: .3s; -moz-transition: .3s; -ms-transition: .3s; transition: .3s; } .ins-' + classNamePrefix + '-btn-group.ins-' + classNamePrefix + '-bootstrap-select { float: none; display: inline-block; margin-left: 0; } .ins-' + classNamePrefix + '-btn-group{ position: relative; vertical-align: middle; } .ins-' + classNamePrefix + '-btn-group>.ins-' + classNamePrefix + '-btn:first-child { margin-left: 0; } .ins-' + classNamePrefix + '-btn-group > .ins-' + classNamePrefix + '-btn { margin-left: 0; float:left; } .ins-' + classNamePrefix + '-bootstrap-select>.ins-' + classNamePrefix + '-dropdown-toggle { width: 100%; padding-right: 25px; z-index: 1; } .ins-' + classNamePrefix + '-btn { display: inline-block; margin-bottom: 0; font-weight: 400; text-align: center; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; border-radius: 4px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .ins-' + classNamePrefix + '-open .ins-' + classNamePrefix + '-dropdown-menu { border-top: 0!important; margin-top: 0; border-radius: 0 0 4px 4px; padding-top: 0; } .ins-' + classNamePrefix + '-block { display: block; } .ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix + '-btn-group .ins-' + classNamePrefix + '-dropdown-menu { min-width: 100%; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } .ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix + '-btn-group .ins-' + classNamePrefix + '-dropdown-menu li{ position:relative; /* border-top: 1px solid; */ } img.ins-' + classNamePrefix + '-whis-list-loader { left: 50%; z-index: 99999999; position: fixed; top: 50%; } .ins-' + classNamePrefix + '-warning-border { border-color : red ! important; } .ins-' + classNamePrefix + '-wish-list-added:before { content: "\\e816"; color: #e600a0; } .ins-' + classNamePrefix + '-bootstrap-select a{ text-decoration:none; } .ins-' + classNamePrefix + '-dropdown-menu>li>a { padding: 0 13px; line-height: 38px; border-top: 1px solid #efefef; display: block; padding: 3px 20px; clear: both; font-weight: 400; line-height: 1.42857143; color: #333; white-space: nowrap; } .ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix + '-btn-group .ins-' + classNamePrefix + '-dropdown-menu li a span.text { display: inline-block; line-height:38px; }</style>');

        self.appendDynamicWishListStyle(sQuery(currentElement).offset().left - 166, addWishListIconTop);

        sQuery(window).off('scroll.insClick-' + variationId).on('scroll.insClick-' + variationId, function () {
            sQuery('.ins-' + classNamePrefix + '-wish-popup-' + variationId).remove();

            self.appendDynamicWishListStyle(sQuery(currentElement).offset().left, addWishListIconTop);
        });
    };

    self.appendDynamicWishListStyle = function (currentElementLeft, addWishListIconTop) {
        var isThereEnoughAreaLeft = window.innerWidth - currentElementLeft > 300;

        if (sQuery(window).scrollTop() >= addWishListIconTop) {
            if (isThereEnoughAreaLeft) {
                sQuery('head').append('<style class="ins-' + classNamePrefix + '-wish-popup-' + variationId + '">.ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' { z-index: 9; position: absolute; left: 50%; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(-50%); bottom: 65px; padding: 15px 10px; border-radius: 5px; background: #fff; display: none; width: 276px; bottom:auto; top: 40px; right:-5px; box-shadow: 0 2px 6px rgba(0,0,0,.5); } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ':before { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid #fff; content: ""; bottom: -10px; position: absolute; left:50%; top: -10px; }</style>');
            } else {
                sQuery('head').append('<style class="ins-' + classNamePrefix + '-wish-popup-' + variationId + '">.ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' { z-index: 9; position: absolute; left: auto; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(0); bottom: 65px; padding: 15px 10px; border-radius: 5px; background: #fff; display: none; width: 276px; bottom:auto; top: 40px; right:-5px; box-shadow: 0 2px 6px rgba(0,0,0,.5); } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ':before { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid #fff; content: ""; bottom: -10px; position: absolute; right:12px; top: -10px; }</style>');
            }
        } else {
            if (isThereEnoughAreaLeft) {
                sQuery('head').append('<style class="ins-' + classNamePrefix + '-wish-popup-' + variationId + '">.ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' { z-index: 9; position: absolute; left: 50%; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(-50%); bottom: 65px; padding: 15px 10px; border-radius: 5px; background: #fff; display: none; width: 276px; bottom: 40px; box-shadow: 0 2px 6px rgba(0,0,0,.5); } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ':after { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #fff; content: ""; bottom: -8px; left: 50%; position: absolute; margin-left: -8px; }</style>');
            } else {
                sQuery('head').append('<style class="ins-' + classNamePrefix + '-wish-popup-' + variationId + '">.ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ' { z-index: 9; position: absolute; left: auto; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(0); bottom: 65px; padding: 15px 10px; border-radius: 5px; background: #fff; display: none; width: 276px; bottom: 40px; right:-5px; box-shadow: 0 2px 6px rgba(0,0,0,.5); } .ins-' + classNamePrefix + '-add-wish-popup-' + variationId + ':after { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #fff; content: ""; bottom: -8px; right:12px; position: absolute; margin-left: -8px; }</style>');
            }
        }
    };

    self.setDropdownClickEvents = function (currentElement, productId) {
        var wishListKey = '-1';

        sQuery('.ins-' + classNamePrefix + '-btn.ins-' + classNamePrefix + '-dropdown-toggle')
            .off('click.insClickDropDown' + variationId).on('click.insClickDropDown' + variationId, function () {
                if (sQuery(dropdownButtonSelector).hasClass('ins-' + classNamePrefix + '-block')) {
                    sQuery('.ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix +
                            '-btn-group .ins-' + classNamePrefix + '-dropdown-menu')
                        .removeClass('ins-' + classNamePrefix + '-block');
                } else {
                    sQuery('.ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix +
                            '-btn-group .ins-' + classNamePrefix + '-dropdown-menu')
                        .addClass('ins-' + classNamePrefix + '-block');
                }
            });

        sQuery('.ins-' + classNamePrefix + '-overlay').off('click.insClickOverlay' + variationId)
            .on('click.insClickOverlay' + variationId, function () {
                sQuery('.ins-' + classNamePrefix + '-add-wish-popup-' + variationId).remove();
                sQuery('.ins-' + classNamePrefix + '-overlay').remove();
            });

        sQuery('.ins-' + classNamePrefix + '-close-btn').off('click.insClickClose' + variationId)
            .on('click.insClickClose' + variationId, function () {
                sQuery('.ins-' + classNamePrefix + '-add-wish-popup-' + variationId).css('display', 'none');
                sQuery('.ins-' + classNamePrefix + '-overlay').remove();
            });

        sQuery('.ins-' + classNamePrefix + '-green-btn').off('click.insClickWishSave' + variationId)
            .on('click.insClickWishSave' + variationId, function () {
                var wishListName = sQuery('input[name="wishlistName"]').val() || '';

                if (wishListKey !== '' && wishListName !== '' && productId !== '') {
                    var loaderImageHtml = '<img class="ins-' + classNamePrefix + '-whis-list-loader" ' +
                        'src="https://image.useinsider.com/watsonsmy/c63/K3BVTUjZPWNdrtdui5pb1547726460.gif">';

                    sQuery('body').append(loaderImageHtml);

                    sQuery.get('https://www.watsons.com.tw/*/p/*/addToWishList/?wishlistpk=' + wishListKey + '&' +
                        'wishlistName=' + wishListName + '&quantity=1&codeVariant=' +
                        productId + '',
                        function () {
                            sQuery(((sQuery(currentElement) || [])[0] || {}).childNodes[0] || {})
                                .addClass('ins-' + classNamePrefix + '-wish-list-added');

                            sQuery('.ins-' + classNamePrefix + '-whis-list-loader').remove();

                            sQuery('.ins-' + classNamePrefix + '-add-wish-popup-' + variationId).css('display', 'none');
                            sQuery('.ins-' + classNamePrefix + '-overlay').remove();
                        });
                } else {
                    sQuery('.ins-' + classNamePrefix + '-btn.ins-' + classNamePrefix + '-dropdown-toggle.ins-' +
                        classNamePrefix + '-btn-default').addClass('ins-' + classNamePrefix + '-warning-border');
                    sQuery('.ins-' + classNamePrefix + '-input input').addClass('ins-' +
                        classNamePrefix + '-warning-border');
                }
            });

        sQuery('.ins-' + classNamePrefix + '-dropdown-menu.ins-' + classNamePrefix + '-inner li:not(.selected)')
            .off('click.insClickDropdownElement').on('click.insClickDropdownElement', function () {
                wishListKey = sQuery(this).attr('wishlistpk') || '';

                sQuery('.ins-' + classNamePrefix + '-filter-option.ins-' + classNamePrefix + '-pull-left')
                    .text(sQuery(this).text());
                sQuery('input[name="wishlistName"]').val(sQuery(this).text());

                sQuery('.ins-' + classNamePrefix + '-input').css('display', 'none');
                sQuery('.ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix + '-btn-group .ins-' +
                    classNamePrefix + '-dropdown-menu').removeClass('ins-' + classNamePrefix + '-block');
            });

        sQuery('.ins-' + classNamePrefix + '-dropdown-menu.ins-' + classNamePrefix + '-inner li.selected')
            .off('click.insClickDropdownElement').on('click.insClickDropdownElement', function () {
                wishListKey = sQuery(this).attr('wishlistpk') || '';

                sQuery('.ins-' + classNamePrefix + '-filter-option.ins-' + classNamePrefix + '-pull-left')
                    .text(sQuery(this).text());
                sQuery('input[name="wishlistName"]').val('');

                sQuery('.ins-' + classNamePrefix + '-input').css('display', 'block');
                sQuery('.ins-' + classNamePrefix + '-bootstrap-select.ins-' + classNamePrefix + '-btn-group .ins-' +
                    classNamePrefix + '-dropdown-menu').removeClass('ins-' + classNamePrefix + '-block');
            });
    };

    self.construct();
};

true;