/**
*  Module
*
* Description
*/
angular.module('ccengine')
.factory('messagesSvc', [function () {
    // ===============================================================
    // Errors & messages
    // var errors = {hasErrors: false, msgs: []};
    function Messages() {
        Array.call(this);
        Object.defineProperties(this, {
            nonEmpty: {value: false, writable: true},
            msgs: {value: []}
        });
    }
    Messages.prototype = [];
    Object.defineProperties(Messages.prototype, {
        send: {value: function (lev, msg) {
            this.nonEmpty = true;
            this.push({l: lev, m: msg});
            return this.length - 1;
        }},
        clear: {value: function (idx) {
            if (Number.isInteger(idx) && idx >= 0 && idx < this.length) {
                this.splice(idx, 1);
                if (this.length === 0) {
                    this.nonEmpty = false;
                }
            } else {
                this.splice(0, this.length);
                this.nonEmpty = false;
            }
        }}
    });
    // -- End of errors & messages

    return new Messages();
}]);
