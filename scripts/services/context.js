angular.module('ccengine')
.factory('contextSvc', ['$rootScope', 'eventsDeliverySvc', 'messagesSvc', 'dataSvc',
function (ROOT, evs, msgs, data) {
    // function Groups(tipo) {
    //     Object.defineProperty(this, 'tipo', {value: tipo});
    // }
    // Groups.getF = function (field) {
    //     return field.v;
    // };
    // Groups.setF = function (field, id, v) {
    //     if (v !== field.v) {
    //         field.v = v;
    //         // TODO insert notification;
    //         evs.notify('VIZ_' + this.tipo + '_SHOW', id, v);
    //         msgs.send('scs', 'VIZ_' + this.tipo + '_SHOW: ' + id + ' -> ' + v);
    //     }
    // };
    // Groups.prototype = {};
    // Object.defineProperties(Groups.prototype, {
    //     none: {get: function () {
    //         for (var i in this) {
    //             if (this[i] === true) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }, set: function (v) {
    //         if (v) {
    //             for (var i in this) {
    //                 this[i] = false;
    //             }
    //         }
    //     }},
    //     default: {get: function () {
    //         for (var i in this) {
    //             if (i == 0 && this[i] === true) {
    //                 return false;
    //             }
    //             if (i != 0 && this[i] === false) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }, set: function (v) {
    //         if (v) {
    //             for (var i in this) {
    //                 this[i] = (i != 0);
    //             }
    //         }
    //     }},
    //     clear: {value: function () {
    //         for (var z in this) {
    //             delete this[z];
    //         }
    //     }},
    //     add: {value: function (id) {
    //         var value = {v: id != 0};
    //         Object.defineProperty(this, id, {
    //             get: Groups.getF.bind(this, value),
    //             set: Groups.setF.bind(this, value, id),
    //             enumerable: true,
    //             configurable: true
    //         });
    //     }}
    // });

    // ==========================================================
    // Path groups
    // function function_name (argument) {
    //     // body...
    // }
    // --End of path groups

    // ==========================================================
    // SELECTION
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
        // this.n.splice(0, this.n.length);
        // this.e.splice(0, this.e.length);
    };
    // -- End of SELECTION

    function Context() {
        var groupBy = null;
        var activePath = null;
        // var groupFlash = null;
        var sel = null;
        Object.defineProperties(this, {
            // groupFlash: {get: function () {
            //     return groupFlash;
            // }, set: function (v) {
            //     groupFlash = v;
            //     // TODO
            //     msgs.send('scs', 'VIZ_FLASH_CHANGE: ' + JSON.stringify(v));
            // }},
            groupBy: {get: function () {
                return groupBy;
            }, set: function (v) {
                if (v === groupBy) {
                    v = null;
                }
                groupBy = v;
                // msgs.send('scs', 'VIZ_GROUP_CHANGE: ' + v);
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
        // this.zones = new Groups('ZONES');
        // this.levels = new Groups('LEVELS');
        // this.bridges = {show: false, flash: null};
        // this.paths = new Groups('PATHS');

        this.selRun = function (cfg) {
            sel = Selection.run(cfg);
        };
        this.selStop = function () {
            Selection.stop(sel);
            sel = null;
            // delete sel;
        };
        // this.sel = new Selection();

    }
    Context.prototype = {};

    // ==========================================================
    // Generating SERVICE
    var ctx = new Context();
    // evs.subscribe('ZONES_CREATED', function (zones) {
    //     ctx.zones.clear();
    //     for (var z in zones) {
    //         ctx.zones.add(z);
    //     }
    // });
    // evs.subscribe('LEVELS_CREATED', function (levels) {
    //     ctx.levels.clear();
    //     for (var z in levels) {
    //         ctx.levels.add(z);
    //     }
    // });
    // evs.subscribe('BRIDGES_CREATED', function (bridges) {
    // });
    evs.subscribe('GROUP_NEW', function (gr) {
        ctx.groupBy = gr;
    });
    evs.subscribe('PATH_NEW', function (p) {
        ctx.activePath = p;
        // ctx.paths.add(p);
    });
    // var handle = ctx.sel.change.bind(ctx.sel);
    // evs.subscribe('SELECTION_CHANGE', handle);
    // evs.unsubscribe('SELECTION_CHANGE', handle);
    return ctx;
}])
.value('DEFAULT_STYLE', [
    {
        selector: 'node',
        style: {
            shape: 'ellipse',
            color: '#000000',
            label: 'data(info.label)',
            'background-color': '#546e7a',
            'border-width': '1px',
            'border-style': 'solid',
            'border-color': '#ffffff'
        }
    },
    {
        selector: 'node[active="OBJECT"]',
        style: {
            'pie-size': '80%',
            'pie-1-background-color': '#ffffff',
            'pie-1-background-size': '100%'
        }
    },
    {
        selector: 'node[active="SUBJECT_OR_OBJECT"]',
        style: {
            'pie-size': '80%',
            'pie-1-background-color': '#ffffff',
            'pie-1-background-size': '50%'
        }
    },
    {
        selector: 'edge',
        style: {
            width: '3px',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle-backcurve',
            'target-arrow-fill': 'filled'
        }
    },
    {
        selector: 'edge[cclabel="READ"]',
        style: {
            'line-color': '#827717',
            'line-style': 'solid',
            'target-arrow-color': '#827717'
        }
    },
    {
        selector: 'edge[cclabel="WRITE"]',
        style: {
            'line-color': '#e65100',
            'line-style': 'solid',
            'target-arrow-color': '#e65100'
        }
    },
    {
        selector: 'edge[cclabel="TAKE"]',
        style: {
            'line-color': '#827717',
            'line-style': 'dashed',
            'target-arrow-color': '#827717'
        }
    },
    {
        selector: 'edge[cclabel="GRANT"]',
        style: {
            'line-color': '#e65100',
            'line-style': 'dashed',
            'target-arrow-color': '#e65100'
        }
    },
    {
        selector: '.dimmed',
        style: {
            opacity: 0.2
        }
    },
    {
        selector: '.highlighted',
        style: {
            'overlay-color': 'blue',
            'overlay-opacity': 0.7
        }
    },
    {
        selector: '.highlighted.start',
        style: {
            'overlay-color': 'green'
        }
    },
    {
        selector: '.highlighted.end',
        style: {
            'overlay-color': 'red'
        }
    }
])
.value('defNodeConverter', function (opts, node) {
    // ===============================================================
    // node converter from storage format to cytoscape node
    var converted = {
        data: {
            id: node.id,
            label: node.info.label,
            // label: node.info.label + '(' + node.level + ')',
            // attr: node.info.atrib,
            // status: node.info.status,
            // active: node.active,
            // level: node.level,
            // zone: node.zone
        // },
        // scratch: {
            src: node
        },
        position: {
            x: 0,
            y: 0
        }
    };
    switch (node.active) {
        case 'OBJECT':
            converted.classes = 'object';
            break;
        case 'SUBJECT_OR_OBJECT':
            converted.classes = 'subject-object';
            break;
    }
    if (opts && opts.ifShowLevel) {
        converted.data.label = node.info.label + '(' + node.level + ')';
    }
    return converted;
    // -- End node converter
})
.value('defEdgeConverter', function (edge) {
    // ===============================================================
    // edge converter from storage format to cytoscape edge
    var converted = {
        data: {
            id: edge.id,
            // label: edge.info.label,
            // attr: edge.info.atrib,
            // status: edge.info.status,
            // cclabel: edge.cclabel,
            source: edge.source,
            target: edge.target,
        // },
        // scratch: {
            src: edge
        }
    };
    switch (edge.cclabel) {
        case 'R_ONLY':
            converted.classes = 'r-only';
            break;
        case 'W_ONLY':
            converted.classes = 'w-only';
            break;
        case 'READ':
            converted.classes = 'read';
            break;
        case 'WRITE':
            converted.classes = 'write';
            break;
        case 'TAKE':
            converted.classes = 'take';
            break;
        case 'GRANT':
            converted.classes = 'grant';
            break;
    }
    return converted;
    // -- End edge converter
});
