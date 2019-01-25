// OPT-8355 start
if (
    spApi.hasParameter('/rsv/rsv_lst.aspx') &&
    (((spApi.getPaidProducts() || [])[0] || {}).url || '').split('&lang')[0].split('id=').pop() === '26'
) {
    // OPT-8355 end
    spApi.customBounce = function (callback) {
        // OPT - 9135 - START -> I increased the threshold value for IE  
        var topDistanceThreshold = spApi.getBrowser() === 'IE' ? 5 : 0;
        
        // OPT - 9135 - END
        spApi.insIsUserBounced = false;

        if (typeof callback === 'function') {
            sQuery(document).on('mouseleave.insiderCustomBounce', function (event) {
                if (event.pageY - sQuery(window).scrollTop() <= topDistanceThreshold && !spApi.insIsUserBounced) {
                    spApi.insIsUserBounced = true;

                    sQuery(document).off('mouseleave.insiderCustomBounce');

                    callback();
                }
            });
        }
    };

    spApi.customBounce(function () {
        var camp = spApi.getCamp(spApi.userSegments[119]).camp;

        spApi.showCamp(camp);
    });
}

false;