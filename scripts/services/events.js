angular.module('ccengine')
.provider('eventsDeliverySvc', function () {
    // ===============================================================
    // event delivery staff
    var subscriptions = {};
    function subscribe(evType, fn) {
        if (!(evType in subscriptions)) {
            subscriptions[evType] = [];
        }
        subscriptions[evType].push(fn);
    }
    function unsubscribe(evType, fn) {
        if (subscriptions[evType]) {
            var idx = subscriptions[evType].indexOf(fn);
            if (idx >= 0) {
                subscriptions[evType].splice(idx, 1);
            }
        }
    }
    function notify(evType) {
        var _len = arguments.length;
        var _start = notify.length;
        var toPass = new Array(_len - _start);
        for (var _i = _start; _i < _len; ++_i) {
            toPass[_i - _start] = arguments[_i];
        }
        if (evType in subscriptions) {
            for (var i = 0; i < subscriptions[evType].length; i++) {
                subscriptions[evType][i].apply(null, toPass);
            }
        }
    }
    // -- End event delivery staff

    this.$get = [function () {
        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            notify: notify
        };
    }];
});
