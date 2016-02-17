/**
* visualCtrl Module
*
*/
angular.module('ccengine')
.controller('visualCtrl', ['$http', 'eventsDeliverySvc', 'messagesSvc', 'dataSvc', 'contextSvc',
'DEFAULT_STYLE', 'defNodeConverter', 'defEdgeConverter',
function ($http, evs, msgs, data, ctx, DEFAULT_STYLE, defNodeConverter, defEdgeConverter) {
    var nodeConverter = defNodeConverter.bind(null, {ifShowLevel: false});
    var edgeConverter = defEdgeConverter;

    // ===============================================================
    // Common funcs
    function layout() {
        cy.layout({
            name: 'cose',
            padding: 1,
            componentSpacing: -100,
            gravity: 400,
            nestingFactor: 1,
            idealEdgeLength: 10,
            edgeElasticity: 1000
        });
    }
    // End of common funcs

    // ===============================================================
    // Data operations
    function reload(data) {
        cy.remove('*');
        insert(data);
        layout();
        box = {w: cy.width(), h: cy.height(), l: cy.zoom()};
    }
    function insert(data) {
        // cy.nodes().lock();
        if (data) {
            var nElems = 0;
            var toInsert = {};
            if (data.n) {
                toInsert.nodes = data.n.map(function (el) {
                    ++nElems;
                    return nodeConverter(el);
                });
            }
            if (data.e) {
                toInsert.edges = data.e.map(function (el) {
                    ++nElems;
                    return edgeConverter(el);
                });
            }
            if (nElems > 0) {
                var nAdd = cy.add(toInsert).nodes();
                if (data.n) {
                    var bb = cy.extent();
                    // var newBB = nAdd.boundingBox();
                    // bb.x1 += newBB.w / 2;
                    // bb.x2 -= newBB.w / 2;
                    // bb.y1 += newBB.h / 2;
                    // bb.y2 -= newBB.h / 2;
                    nAdd.positions(function (i, ele) {
                        var ebb = ele.boundingBox();
                        var dx = 2 * ebb.w * (Math.random() + 0.25);
                        var dy = 2 * ebb.h * (Math.random() + 0.25);
                        return {x: bb.x1 + dx, y: bb.y1 + dy};
                        // return {x: bb.x1 + ele.outerWidth() / 2, y: bb.y1 + ele.outerHeight() / 2};
                    });
                }
                // cy.resize();
                // cy.layout({name: 'random', boundingBox: cy.extent()});
            }
        }
        // cy.nodes().unlock();
    }
    function update(data) {
        if (data) {
            if (data.n) {
                data.n.forEach(function (n) {
                    var cyN = cy.nodes('#' + n.id);
                    var nConverted = nodeConverter(n);
                    cyN.data(nConverted.data);
                    cyN.removeClass('object subject-object');
                    cyN.addClass(nConverted.classes);
                });
            }
            if (data.e) {
                data.e.forEach(function (e) {
                    var cyE = cy.edges('#' + e.id);
                    var eConverted = edgeConverter(e);
                    cyE.data(eConverted.data);
                    cyE.removeClass('read write take grant');
                    if (eConverted.classes) {
                        cyE.addClass(eConverted.classes);
                    }
                });
            }
        }
    }
    function remove(data) {
        if (data) {
            if (_.isArray(data.n) && data.n.length > 0) {
                cy.nodes(data.n.map(function (n) {return '#' + n.id; }).join(',')).remove();
                // cy.nodes().filterFn(function (el) {
                //     return data.n.indexOf(el.scratch('src')) >= 0;
                // }).remove();
            }
            if (_.isArray(data.e) && data.e.length > 0) {
                cy.edges(data.e.map(function (e) {return '#' + e.id; }).join(',')).remove();
                // cy.edges().filterFn(function (el) {
                //     return data.e.indexOf(el.scratch('src')) >= 0;
                // }).remove();
            }
            // cy.fit();
        }
    }
    // -- End of Data operations

    // ===========================================================
    // Groupping API
    function Group(ids, id, label, cls) {
        // FIXME: big strings usage
        var selector = ids.map(function (el) {
            return '#' + el;
        }).join(',');
        var set = cy.nodes(selector);
        set.addClass(id);
        this.mark = '.' + id;
        this.id = id;
        this.label = label;
        this.cls = cls;
        this.active = false;

    }
    Group.groups = {};
    Group.prototype = {};
    Group.prototype.release = function () {
        cy.nodes(this.mark).removeClass(this.id);
    };
    Group.prototype.group = function () {
        this.parent = cy.add({group: 'nodes', data: {id: this.id, label: this.label}}).addClass(this.cls + ' group');
        cy.nodes(this.mark).move({parent: this.id});
        this.active = true;
    };
    Group.prototype.ungroup = function () {
        if (this.active) {
            this.parent.children().move({parent: null});
            this.parent.remove();
            this.active = false;
        }
    };
    var groupBy;
    Group.switcher = function (what) {
        if (groupBy !== what) {
            for (var id in Group.groups) {
                Group.groups[id].ungroup();
                Group.groups[id].release();
                delete Group.groups[id];
            }
            if (what !== null) {
                var count = 0;
                for (var gname in what.subGroups) {
                    var ids = what.subGroups[gname];
                    // var label = what.type === 'ISLAND' ? 'Zone ' : 'Level ';
                    // label += gname;
                    var cls = what.type === 'ISLAND' ? 'zone' : 'level';
                    var vgroup = new Group(ids, 'g_' + count++, gname, cls);
                    Group.groups[what.id + gname] = (vgroup);
                    vgroup.group();
                }
            }
        }
    };
    Group.flasher = function (what) {
        if (what === null) {
            // TODO flash groups
            what = null;
        }
        switch (what.g) {
            case 'ZONES':
                break;

            case 'LEVELS':
                break;
        }
    };
    // -- End of groupping API

    // ===============================================================
    // PATH HIGHLIGHT funcs
    function Path(p) {
        this.src = p;
        this.from = cy.nodes('#' + p.from);
        this.to = cy.nodes('#' + p.to);
        var edgesIds = p.edges.map(function (el) { return '#' + el; }).join(', ');
        this.edges = edgesIds ? cy.collection(edgesIds) : cy.collection();
        this.elements = this.edges.union(this.edges.connectedNodes());

        cy.elements().addClass('dim');
        this.elements.addClass('hl');
        this.from.addClass('hl-start');
        this.to.addClass('hl-end');
    }
    Path.prototype = {};
    Path.prototype.hideAndClean = function () {
        this.from.removeClass('hl-start');
        this.to.removeClass('hl-end');
        this.elements.removeClass('hl');
        cy.elements().removeClass('dim');
    };
    Path.prototype.play = function () {
    };

    Path.instance = null;
    Path.switcher = function (p) {
        if (Path.instance !== null && Path.instance.src != p) {
            Path.instance.hideAndClean();
            Path.instance = null;
        }
        if (p !== null) {
            Path.instance = new Path(p);
        }
    };
    // -- End of paths higlight definitions

    // ===============================================================
    // Selection operations definition
    function Selection(directed, nMax, eMax) {
        Object.defineProperties(this, {
            select: {value: this._select.bind(this)},
            unselect: {value: this._unselect.bind(this)},
            directed: {value: !eMax || eMax === 0 ? directed : false},
            nMax: {value: nMax},
            eMax: {value: eMax},
            n: {value: []},
            e: {value: []}
        });
    }
    Selection.prototype = {};
    Object.defineProperties(Selection.prototype, {
        // graph element selection handler
        _select: {value: function (ev) {
            if (ev.cyTarget.isNode()) {
                if (this.n.length < this.nMax) {
                    this.n.push(ev.cyTarget);
                    ev.cyTarget.scratch('sel', this.n.length - 1);
                    if (this.directed) {
                        if (this.n.length === 1) {
                            ev.cyTarget.addClass('sel-start');
                        } else {
                            ev.cyTarget.addClass('sel-end');
                            this.n[this.n.length - 2].removeClass('sel-end');
                        }
                    }
                    if (this.n.length === this.nMax) {
                        cy.nodes(':unselected').unselectify();
                    }
                }
            }
            if (ev.cyTarget.isEdge()) {
                if (this.e.length < this.eMax) {
                    this.e.push(ev.cyTarget);
                    ev.cyTarget.scratch('sel', this.e.length - 1);
                    if (this.e.length === this.eMax) {
                        cy.edges(':unselected').unselectify();
                    }
                }
            }
            evs.notify('SELECTION_CHANGE', this.get());
        }},
        // graph element unselection handler
        _unselect: {value: function (ev) {
            cy.off('unselect', this.unselect);
            if (ev.cyTarget.isNode()) {
                var idx = ev.cyTarget.scratch('sel');
                if (this.directed) {
                    this.n[this.n.length - 1].removeClass('sel-end');
                    if (idx === 0) {
                        ev.cyTarget.removeClass('sel-start');
                    } else if (idx > 1) {
                        this.n[idx - 1].addClass('sel-end');
                    }

                    for (var i = idx + 1; i < this.n.length; i++) {
                        this.n[i].unselect();
                        this.n[i].removeScratch('sel');
                    }
                    this.n.splice(idx, this.n.length);
                } else {
                    this.n.splice(idx, 1);
                    this.n.slice(idx).forEach(function (el, i) {
                        el.scratch('sel', idx + i);
                    });
                }
                ev.cyTarget.removeScratch('sel');
                if (this.n.length < this.nMax) {
                    cy.nodes(':unselected').selectify();
                }
            }
            if (ev.cyTarget.isEdge()) {
                this.e.splice(ev.cyTarget.scratch('sel'), 1);
                this.e.slice(ev.cyTarget.scratch('sel')).forEach(function (el, i) {
                    el.scratch('sel', idx + i);
                });
                ev.cyTarget.removeScratch('sel');
                if (this.e.length < this.eMax) {
                    cy.edges(':unselected').selectify();
                }
            }
            cy.on('unselect', this.unselect);
            evs.notify('SELECTION_CHANGE', this.get());
        }},
        get: {value: function () {
            return {
                n: this.n.map(function (el) {
                    return el.data('src');
                }),
                e: this.e.map(function (el) {
                    return el.data('src');
                })
            };
        }}
    });
    Selection.instance = null;

    Selection.run = function (cfg) {
        Selection.instance = new Selection(cfg.directed === undefined ? false : cfg.directed, cfg.n, cfg.e);
        cy.on('select', Selection.instance.select);
        cy.on('unselect', Selection.instance.unselect);
        cy.autounselectify(false);
        cy.elements().unselectify();
        if (cfg.n > 0) {
            cy.nodes().selectify();
        }
        if (cfg.e > 0) {
            cy.edges().selectify();
        }
    };

    Selection.stop = function () {
        cy.off('select', Selection.instance.select);
        cy.off('unselect', Selection.instance.unselect);
        if (Selection.instance.nMax) {
            Selection.instance.n.forEach(function (el, i) {
                el.removeScratch('sel');
                if (Selection.instance.directed) {
                    if (i === 0) {
                        el.removeClass('sel-start');
                    }
                    if (i === Selection.instance.n.length - 1) {
                        el.removeClass('sel-end');
                    }
                }
            });
        }
        if (Selection.instance.eMax) {
            Selection.instance.e.forEach(function (el) {
                el.removeScratch('sel');
            });
        }
        cy.elements(':selected').unselect();
        cy.autounselectify(true);
        delete Selection.instance;
    };
    // -- End of selection operations definitions

    // ===========================================================
    // ===========================================================
    // INItiAliZaTIon
    // ===========================================================

    evs.subscribe('DATA_RELOAD', reload);
    evs.subscribe('DATA_INSERT', insert);
    evs.subscribe('DATA_UPDATE', update);
    evs.subscribe('DATA_REMOVE', remove);
    evs.subscribe('SELECTION_REQUEST', Selection.run);
    evs.subscribe('SELECTION_DISMISS', Selection.stop);
    // evs.subscribe('ZONES_CREATED', Zones.recreate);
    // evs.subscribe('LEVELS_CREATED', Levels.recreate);
    // evs.subscribe('VIZ_ZONES_SHOW', Zones.show);
    // evs.subscribe('VIZ_LEVELS_SHOW', Levels.show);
    evs.subscribe('VIZ_GROUP_CHANGE', Group.switcher);
    // evs.subscribe('VIZ_FLASH_CHANGE', Group.flasher);
    evs.subscribe('VIZ_PATHS_CHANGE', Path.switcher);
    // evs.subscribe('VIZ_PATH_FLASH', Path.flasher);

    var cyElem = $('#viz');
    var cy = cytoscape({
        container: cyElem,
        selectionType: 'additive',
        autounselectify: true,
        motionBlur: true
    });
    var box = {};
    cyElem.on('transitionend', function (ev) {
        // box = {w: cy.width(), h: cy.height(), l: cy.zoom()};
        var nbox = {w: cy.width(), h: cy.height(), l: cy.zoom()};
        var delta = 1;
        if (Math.abs(nbox.w - box.w) > Math.abs(nbox.h - box.h)) {
            delta = nbox.w / box.w;
        } else {
            delta = nbox.h / box.h;
        }
        var bb = cy.extent();
        cy.zoom({level: nbox.l * delta, renderedPosition: {x: 0, y: 0}});
        cy.resize();
        box = nbox;
        // cy.fit();
    });
    $http.get('styles/graph-style.css').then(function (data) {
        cy.style(data.data).update();
    }, function (resp) {
        console.log('ERR: getting graph style');
        console.log(resp);
        console.log('WRN: setting default stile');
        cy.style(DEFAULT_STYLE).update();
    });
}]);
