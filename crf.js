var relatedSelector = 'ul#Guru-SideMenu > li#side_categories > ul.sf-menu-sub > li';

return {
    getCategoryList: function () {
        var categoryList = [];

        sQuery(relatedSelector).each(function (key, val) {
            categoryList.push({
                text: sQuery(val).text().trim(),
                url: sQuery(val).attr('href') || ''
            });
        });

        return categoryList;
    },
    triggerClick: function () {
        spApi.categoryClickHandler(relatedSelector);
    },
    changeCategory: function (category, fromIndex, toIndex, logClass) {
        if (fromIndex > toIndex) {
            sQuery(relatedSelector).eq(fromIndex).insertBefore(sQuery(relatedSelector).eq(toIndex));
        } else {
            sQuery(relatedSelector).eq(fromIndex).insertAfter(sQuery(relatedSelector).eq(toIndex));
        }

        if (typeof logClass !== 'undefined') {
            sQuery(relatedSelector).eq(fromIndex).addClass(logClass);
        }
    },
    getElementCategoryText: function (element) {
        return sQuery(element).text().trim();
    }
};