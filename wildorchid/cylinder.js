(function (cylinder) {
    cylinder.configs = {
        partnerId: '10001492',
        userId: sQuery.cookie('spUID') || '',
        builderId: 202,
        customClass: 'sp-custom-' + (spApi.userSegments[202] || 'Development') + '-',
        language: spApi.getLang() || '',
        currency: spApi.getCurrency() || '',
        classList: [
            'one active', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
        ],
        designTitle: 'Не нашли, что искали?',
        middleBlockColor: '#cb2a50',
        buttonColor: '#000',
        butonHighlightColor: '#f7a752'
    };

    cylinder.init = function () {
        cylinder.reset();
        cylinder.createHtml();
        cylinder.getRecommendedItems();
    };

    cylinder.reset = function () {
        sQuery('#ins-container, .ins-layer').remove();
    };

    cylinder.createHtml = function () {
        var structure =
            '<div id="ins-container" class="fade-out">' +
            '<div id="ins-stage">' +
            '<div class="ins-middle">' +
            '<h2>' + cylinder.configs.designTitle + '</h2>' +
            '<div class="ins-close-cylinder">&#10006;</div>' +
            '</div>' +
            '<div id="ins-products" class="ins-ring">' +
            '</div>' +
            '</div>' +
            '<div class="ins-fold">' +
            '</div>' +
            '</div>' +
            '<div class="ins-layer fade-out"></div>';

        sQuery('body').append(structure);
    };

    cylinder.getRecommendedItems = function () {
        sQuery.ajax({
            url: cylinder.getEndpoint(),
            success: function (items) {
                if (items.data.length < 12) {
                    return;
                }

                items = cylinder.shuffleItems(items.data);

                cylinder.populateItems(items);
            }
        });
    };

    cylinder.getEndpoint = function () {
        return 'https://recommendation.api.useinsider.com/' + cylinder.configs.partnerId + '/' +
            cylinder.configs.language + '/user/' + cylinder.configs.userId + '?size=30&details=true';
    };

    cylinder.shuffleItems = function (items) {
        for (
            var newIndex, temp, currentIndex = items.length; currentIndex; newIndex = Math.floor(Math.random() * currentIndex),

            temp = items[--currentIndex],
            items[currentIndex] = items[newIndex],
            items[newIndex] = temp
        );

        return items;
    };

    cylinder.populateItems = function (items) {
        var cards = '';
        var productCount = 0;
        var hasSalePrice;

        sQuery(items).each(function (index, item) {
            hasSalePrice = item.price[cylinder.configs.currency] !== item.original_price[cylinder.configs.currency];

            if (productCount < 12 && item.discount[cylinder.configs.currency] < 99) {
                cards +=
                    '<div class="ins-product ' + cylinder.configs.classList[productCount] + ' ' +
                    cylinder.configs.customClass + (productCount + 1) + '">' +
                    '<div class="prevItem"></div>' + '<div class="nextItem"></div>' +
                    '<div class="ins-row">' +
                    '<div class="ins-image">' + '<img src="' + item.image_url + '">' + '</div>' +
                    '</div>' +
                    '<div class="ins-row details">' + '<div class="ins-row">' + '<div class="ins-name">' +
                    '<a href="' + item.url + '">' + item.name + '</a>' +
                    '</div>' +
                    '<div class="ins-description">' + item.category.pop() + '</div>' + '</div>' +
                    '<div class="ins-product-footer">' + '<div class="ins-prices">' + '<div class="' +
                    ((!hasSalePrice && 'ins-sale-price') || 'ins-original-price') + '">' +
                    item.original_price[cylinder.configs.currency] + ' ₽</div>' +
                    '<div class="ins-sale-price" ' + (!hasSalePrice && 'style="display: none;"') + '>' +
                    item.price[cylinder.configs.currency] + ' ₽</div>' + '</div>' +
                    '<div class="ins-cart-elements">' +
                    '<div class="ins-go-to ' + cylinder.configs.customClass + '0' + '">' +
                    '<a href="' + item.url + '">Перейти</a>' +
                    '</div>' + '</div>' + '</div>' + '</div>' + '</div>';

                productCount++;
            }
        });

        sQuery('#ins-products').append(cards);

        cylinder.setEvents();
    };

    cylinder.setEvents = function () {
        var ring = sQuery('#ins-products');
        var nextButton = sQuery('.ins-product .nextItem');
        var prevButton = sQuery('.ins-product .prevItem');
        var closeButton = sQuery('.ins-close-cylinder');
        var container = sQuery('#ins-container');
        var layer = sQuery('.ins-layer');
        var middleBlock = sQuery('.ins-middle, .ins-fold');
        var anchorPoint = 0;
        var lock = true;

        middleBlock.css('background', cylinder.configs.middleBlockColor);

        container.removeClass('fade-out');
        layer.removeClass('fade-out');

        ring.css({
            transition: 'all 3s ease',
            transform: 'rotateY(' + (anchorPoint -= 360) + 'deg)'
        });

        setTimeout(function () {
            ring.css('transition', 'all .5s ease');
        }, 1000);

        nextButton.off('click.cylinder-next').on('click.cylinder-next', function () {
            if (lock) {
                lock = false;

                setTimeout(function () {
                    lock = true;
                }, 750);

                sQuery(this).parent().removeClass('active');

                if (sQuery(this).parent().next().length > 0) {
                    sQuery(this).parent().next().addClass('active');
                } else {
                    sQuery('.ins-product:first').addClass('active');
                }

                ring.css('transform', 'rotateY(' + (anchorPoint -= 30) + 'deg)');
            }
        });

        prevButton.off('click.cylinder-prev').on('click.cylinder-prev', function () {
            if (lock) {
                lock = false;

                setTimeout(function () {
                    lock = true;
                }, 750);

                sQuery(this).parent().removeClass('active');

                if (sQuery(this).parent().prev().length > 0) {
                    sQuery(this).parent().prev().addClass('active');
                } else {
                    sQuery('.ins-product:last').addClass('active');
                }

                ring.css('transform', 'rotateY(' + (anchorPoint += 30) + 'deg)');
            }
        });

        closeButton.off('click.cylinder-close').on('click.cylinder-close', function () {
            ring.css({
                transition: 'all 3s ease',
                transform: 'rotateY(' + (anchorPoint += 360) + 'deg)'
            });

            container.addClass('fade-out');
            layer.addClass('fade-out');

            setTimeout(function () {
                cylinder.reset();
            }, 3000);
        });
    };

    cylinder.init();
})({});