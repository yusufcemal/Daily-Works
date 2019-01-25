// OPT - 6700 - START - Ajax Listener for Custom User Attribute
if (spApi.hasParameter('/satis-unikasko')) {
    var leadSubmitAjaxListener = function (callback) {
        var originalOpenFunction = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            originalOpenFunction.apply(this, arguments);

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        try {
                            callback(url, method);
                        } catch (error) {
                            spApi.conLog('Something is crashed, Event:' + error);
                        }
                    }
                }
            });
        };
    };

    leadSubmitAjaxListener(function (url, method) {
        if (url.indexOf('/service/ukasko-check-user') > -1 && method === 'POST') {
            spApi.conLog('OPT-6700 : ', 'Lead form successfully completed...');

            spApi.storageData('ins-kasko-lead-completed', '1');

            spApi.reInitOnChange();
        }
    });
}
// OPT - 6700 - END