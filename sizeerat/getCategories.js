var categories = [];
var letter = '';

sQuery('.m-breadcrumb .m-breadcrumb_item:not(:first)').each(function (index) {
    if (index === 0 || index === 1) {
        letter += sQuery(this).text() + ' ';
    }

    if (index === 1) {
        categories.push(sQuery.trim(letter));
    } else if (index > 1) {
        categories.push(sQuery.trim(sQuery(this).text()));
    }
});

return categories;