(function (self) {
    self.builderId = '4';
    self.campId = spApi.userSegments[self.builderId] || 'Development';
    self.customClass = 'sp-custom-' + self.campId + '-';

    self.init = function () {
        self.reset();
        self.createHtml();
        self.setEvents();
    };

    self.reset = function () {
        var inputPlaceHolder = sQuery('#personalPhone').attr('placeholder').replace('*', '');

        sQuery('#personalPhone').attr('placeholder', inputPlaceHolder);

        sQuery('[class *= "optional"]:eq(1)').remove();

        sQuery('button[type = "submit"]').off('click.ins5402');

        sQuery('button[type = "submit"]').removeClass(self.customClass + '1');
    };

    self.createHtml = function () {
        var optionalTextElement = sQuery('[class *= "optional"]').clone();
        var inputPlaceHolder = (sQuery('#personalPhone').attr('placeholder') || '') + '*';

        if (inputPlaceHolder !== '*') {
            sQuery('#personalPhone').attr('placeholder', inputPlaceHolder);
        }

        sQuery('form > fieldset > div:eq(3)').append(optionalTextElement);
    };

    self.setEvents = function () {
        sQuery('button[type = "submit"]').off('click.ins5402').on('click.ins5402', function (event) {
            if (sQuery('#personalPhone').val() === '' && sQuery('#personalName').val() !== '') {
                event.preventDefault();

                sQuery(this).off('click.ins5402');
                sQuery('#personalPhone').val('00000000');
                sQuery(this).trigger('click');
            }
        });

        sQuery('button[type = "submit"]').addClass(self.customClass + '1');
    };

    setTimeout(self.init, 1000);
})({});

true;