angular.module('ccengine')
.factory('contextSvc', ['$rootScope', 'eventsDeliverySvc', 'messagesSvc', 'dataSvc',
function (ROOT, evs, msgs, data) {
    function Selection() {
        this.n = [];
        this.e = [];
        this.change = this._change.bind(this);
    }
    Selection.prototype = {};
    Selection.prototype._change = function (sel) {
        ROOT.$apply((function () {
            if (sel) {
                if (sel.n) {
                    this.n.splice.bind(this.n, 0, this.n.length).apply(this.n, sel.n);
                }
                if (sel.e) {
                    this.e.splice.bind(this.e, 0, this.e.length).apply(this.e, sel.e);
                }
            }
        }).bind(this));
    };
    Selection.run = function (cfg) {
        var sel = new Selection();
        evs.subscribe('SELECTION_CHANGE', sel.change);
        evs.notify('SELECTION_REQUEST', cfg);
        return sel;
    };
    Selection.stop = function (sel) {
        evs.notify('SELECTION_DISMISS');
        evs.unsubscribe(sel.change);
    };
    // -- End of SELECTION

    function Context() {
        var groupBy = null;
        var activePath = null;
        // var groupFlash = null;
        var sel = null;
        Object.defineProperties(this, {
            groupBy: {get: function () {
                return groupBy;
            }, set: function (v) {
                if (v === groupBy) {
                    v = null;
                }
                groupBy = v;
                evs.notify('VIZ_GROUP_CHANGE', v);
            }},
            activePath: {get: function () {
                return activePath;
            }, set: function (p) {
                if (p === activePath) {
                    p = null;
                }
                activePath = p;
                evs.notify('VIZ_PATHS_CHANGE', p);
            }},
            sel: {get: function () {
                return sel;
            }, enumerable: true}
        });

        this.selRun = function (cfg) {
            sel = Selection.run(cfg);
        };
        this.selStop = function () {
            Selection.stop(sel);
            sel = null;
        };
    }

    Context.prototype = {};

    // ==========================================================
    // Generating SERVICE
    var ctx = new Context();
    evs.subscribe('GROUP_NEW', function (gr) {
        ctx.groupBy = gr;
    });
    evs.subscribe('PATH_NEW', function (p) {
        ctx.activePath = p;
    });
    return ctx;
}]);
