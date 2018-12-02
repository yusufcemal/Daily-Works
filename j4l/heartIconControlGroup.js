spApi.sendCustomGoal = function (builderId, goalId) {
    var goalOfCamp = ((spApi.personalizationCamps[builderId] || [])['goalBuilderList'] || [])[goalId] || '';

    if (typeof goalOfCamp === 'undefined') {
        return false;
    }

    if (goalOfCamp.type === 'rules') {
        goalOfCamp.goalList[0]['selectorString'] = 'true';

        spApi.addGoalTracking(true);
    }
};

sQuery('.register-global-btn:first').off('click.insJoinButton').on('click.insJoinButton', function () {
    spApi.sendCustomGoal(24, 20);
});