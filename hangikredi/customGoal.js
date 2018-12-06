if (spApi.hasParameter('/kampanyalar/ergo-dask-sigortasi-montaj-hizmeti')) {
    var dataLayerListener = function (callback) {
        if (typeof dataLayer !== 'object' || typeof dataLayer.push !== 'function') {
            spApi.conLog('There is no datalayer on partner site');

            return false;
        }

        var originalDataLayerPush = dataLayer.push;

        dataLayer.push = function (object) {
            try {
                originalDataLayerPush.apply(this, arguments);

                callback(object || {});
            } catch (error) {
                spApi.conLog('On dataLayerListener, somethings went wrong, error message:' + error);
            }
        };
    };

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

    dataLayerListener(function (object) {
        if (object.Action === 'Basvuru_Tamamlandi' && object.Category === 'Dask') {
            spApi.conLog('DataLayer listener : Basvuru Tamamlandi!');

            spApi.sendCustomGoal(900, 594);
        }
    });
}

true;