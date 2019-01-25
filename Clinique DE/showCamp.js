if (spApi.isOnProductPage()) {
    var builderId = 68;

    var showInfoCampForOutOfStock = function (id) {
        if (sQuery('.spp_product_status .temp_out_of_stock_msg:visible, .btn-tempoutofstock:visible').exists()) {
            spApi.showCamp(spApi.getCamp(spApi.userSegments[id]).camp);
        }
    };

    showInfoCampForOutOfStock(builderId);

    sQuery('.quickshop-type.quickshop-options:visible').off('click.ins6777').on('click.ins6777', function () {
        showInfoCampForOutOfStock(builderId);
    });
}

false;