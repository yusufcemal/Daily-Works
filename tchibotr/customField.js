spApi.sendCustomFieldForOPT8068 = function (surveyCustomValue) {
    var spUID = spApi.localStorageGet('spUID') || sQuery.cookie('spUID') || '';
    var searchQuery = spApi.getParameter('query') || '';
    var variationId = spApi.userSegments[627] || '';

    sQuery('#spWorker').pm(function (data) {
        sQuery.ajax({
            type: 'POST',
            url: 'https://tchibotr.api.useinsider.com/ajax.php?t=saveFormResult',
            data: {
                'formData[0][type]': 'multiple_choice',
                'formData[0][id]': '2785165405016',
                'formData[0][text]': 'Arama sonuçlarından memnun musunuz?',
                'formData[0][required_question]': 'false',
                'formData[0][options][0][id]': '9540590541816',
                'formData[0][options][0][text]': data.surveyCustomValue,
                'formData[0][options][0][type]': 'radio',
                'formData[0][options][0][redirect_page]': undefined,
                'formData[0][options][0][redirect_page_index]': 0,
                'formData[1][type]': 'text',
                'formData[1][id]': '5817524252269',
                'formData[1][text]': 'Aradığınız şey ne?',
                'formData[1][required_question]': 'false',
                'formData[1][options][0][id]': '2132556687374',
                'formData[1][options][0][text]': data.searchQuery,
                'formData[1][options][0][type]': 'text',
                'couponAction[type]': 'none',
                'campId': data.variationId,
                'spUID': data.userId
            },
            success: function () {
                sQuery(window).pm(function () {
                    spApi.conLog('OPT-8068: ', 'Ajax Request: ', 'Success');
                });
            }
        });
    }, undefined, {
        userId: spUID,
        searchQuery: searchQuery,
        variationId: variationId,
        surveyCustomValue: surveyCustomValue
    });
};

var setClickEventForSubmitButton = function () {
    var variationId = spApi.userSegments[627] || '';

    sQuery('.sp-advanced-css-' + variationId + ' iframe').pm(function () {
        sQuery('#wrap-button-1540560302784').off('click.customField').on('click.customField', function () {
            var surveyCustomValue = sQuery('input[type="radio"]:checked').val() || '';

            if (surveyCustomValue !== '') {
                sQuery(window).pm(function (answer) {
                    spApi.sendCustomFieldForOPT8068(answer);
                }, undefined, surveyCustomValue);
            }
        });
    });
};

spApi.getCamp(spApi.userSegments[627]).show(setClickEventForSubmitButton);

true;