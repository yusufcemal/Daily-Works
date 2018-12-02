spApi.conLog('in the rule varId : ', spApi.userSegments[50]);

spApi.getCamp(spApi.userSegments[50]).show(function () {
    spApi.conLog('Flexible Payment camp shown...');

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

    sQuery('.sp-advanced-css-72 .sp-fancybox-iframe').pm(function () {
        sQuery('#wrap-button-1541923008621').off('click.insContinueButton').on('click.insContinueButton', function () {
            sQuery(window).pm(function () {
                spApi.sendCustomGoal(50, 12);
            });
        });

        sQuery('#wrap-button-1541922981635').off('click.insNoThanksButton').on('click.insNoThanksButton', function () {
            sQuery(window).pm(function () {
                spApi.sendCustomGoal(50, 13);
            });
        });
    });
});

sQuery('#pay-later').elementLoadComplete(function () {
    spApi.showCamp(spApi.getCamp(spApi.userSegments[50]).camp);
}, {
    i: 500,
    t: 10000
});

false;