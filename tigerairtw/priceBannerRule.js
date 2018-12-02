if (sQuery('.breadcrumb li').eq(3).hasClass('active') && sQuery('.breadcrumb li').eq(4).hasClass('active')) {
    var seatType = spApi.storageData('ins-selected-seat-type');

    if (seatType && JSON.parse(spApi.storageData('sp-camp-c36') || '{}')['step1-displayed']) {

        spApi.sendCustomGoal = function (builderId, goalId) {
            var goalOfCamp = spApi.personalizationCamps[builderId]['goalBuilderList'][goalId];

            if (typeof goalOfCamp === 'undefined') {
                return false;
            }

            if (goalOfCamp.type === 'rules') {
                goalOfCamp.goalList[0]['selectorString'] = 'true';
                spApi.addGoalTracking(true);
            }
        };

        spApi.sendCustomGoal(54, seatType);
    }
}

true;