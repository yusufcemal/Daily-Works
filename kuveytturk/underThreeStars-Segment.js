var isUnderThreeStars;

sQuery(document).off('click.userSegments').on('click.userSegments', '.ins-star', function () {
    isUnderThreeStars = sQuery('.ins-star.clicked-star').length < 3;

    spApi.storageData('ins-under-three-stars', JSON.stringify(isUnderThreeStars), {
        expires: 30
    });
});

spApi.storageData('ins-under-three-stars') === 'true';