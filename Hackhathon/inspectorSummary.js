sQuery('#spWorker').pm(function () {
    return sQuery.cookie('inspectorQueryHash');
}, function (inspectorQueryHash) {
    if (inspectorQueryHash != null) {
        sQuery.ajax({
            type: 'GET',
            url: 'https://' + partnerName + '.inone.useinsider.com/inspector-summary',
            dataType: 'json',
            data: {
                id: spApi.getCamp('c1082').camp.builderId,
                queryHash: inspectorQueryHash
            },
            success: function (inspectorDetails) {
                console.log(inspectorDetails);
            }
        });
    }
});