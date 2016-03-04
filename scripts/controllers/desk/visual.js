/**
* visualCtrl Module
*
*/
angular.module('ccengine')

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
})

.controller('visualCtrl', ['$interval', '$http', 'eventsDeliverySvc', 'messagesSvc', 'dataSvc', 'contextSvc',
'DEFAULT_STYLE', 'defNodeConverter', 'defEdgeConverter',
function ($interval, $http, evs, msgs, data, ctx, DEFAULT_STYLE, defNodeConverter, defEdgeConverter) {
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
    function reload(data_toi) {
        cy.remove('*');
        insert(data_toi);

        cy.ready(function () {
            if (data.gvattrs.zoom && data.gvattrs.pan) {
                cy.viewport({zoom: data.gvattrs.zoom, pan: data.gvattrs.pan});
            } else {
                cy.viewport({zoom:1, pan: {x: 0, y: 0}});
            }
            // layout();
            box = {w: cy.width(), h: cy.height(), l: cy.zoom()};
        });
    }
    function insert(data_toi) {
        // cy.nodes().lock();
        if (data_toi) {
            var nElems = 0;
            var toInsert = {};
            if (data_toi.n) {
                toInsert.nodes = data_toi.n.map(function (el) {
                    ++nElems;
                    return nodeConverter(el);
                });
            }
            if (data_toi.e) {
                toInsert.edges = data_toi.e.map(function (el) {
                    ++nElems;
                    return edgeConverter(el);
                });
            }
            if (nElems > 0) {
                var nAdd = cy.add(toInsert).nodes();
                if (data_toi.n) {
                    var bb = cy.extent();
                    // var newBB = nAdd.boundingBox();
                    // bb.x1 += newBB.w / 2;
                    // bb.x2 -= newBB.w / 2;
                    // bb.y1 += newBB.h / 2;
                    // bb.y2 -= newBB.h / 2;
                    cy.ready(function () {
                        nAdd.positions(function (i, ele) {
                            if (data.gvattrs && data.gvattrs.positions && data.gvattrs.positions[ele.id()]) {
                                return data.gvattrs.positions[ele.id()];
                            }
                            var ebb = ele.boundingBox();
                            var dx = 2 * ebb.w * (Math.random() + 0.25);
                            var dy = 2 * ebb.h * (Math.random() + 0.25);
                            return {x: bb.x1 + dx, y: bb.y1 + dy};
                            // return {x: bb.x1 + ele.outerWidth() / 2, y: bb.y1 + ele.outerHeight() / 2};
                        });
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
                    if (nConverted.classes) {
                        cyN.addClass(nConverted.classes);
                    }
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
    function remove(data_tor) {
        if (data_tor) {
            if (_.isArray(data_tor.n) && data_tor.n.length > 0) {
                if (!data_tor.e) {
                    data_tor.e = [];
                }
                var nodesToRemove = cy.nodes(data_tor.n.map(function (n) {return '#' + n.id; }).join(','));
                var etr = nodesToRemove.connectedEdges();
                var detr = etr.map(function (ele) {
                    var idx = _.findIndex(data.edges, {id: ele.id()});
                    if (idx >= 0) {
                        return data.edges[idx];
                    } else {
                        throw 'Assert there should be an edge!!';
                    }
                });
                data.remove({e: detr});
                nodesToRemove.remove();
                // cy.nodes().filterFn(function (el) {
                //     return data_tor.n.indexOf(el.scratch('src')) >= 0;
                // }).remove();
            }
            if (_.isArray(data_tor.e) && data_tor.e.length > 0) {
                cy.edges(data_tor.e.map(function (e) {return '#' + e.id; }).join(',')).remove();
                // cy.edges().filterFn(function (el) {
                //     return data_tor.e.indexOf(el.scratch('src')) >= 0;
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
    evs.subscribe('VIZ_APPLY_LAYOUT', layout);

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
    var pendingSaveState = $interval(function () {}, 1, 1);
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
        $interval.cancel(pendingSaveState);
        pendingSaveState = $interval(function () {
            data.gvattrs.save(cy.zoom(), cy.pan(),
                _.fromPairs(cy.nodes().map(function (ele) {
                    return [ele.id(), ele.position()];
                }))
            );
        }, 2000, 1);
        // cy.fit();
    });
    cy.on('layoutstop pan zoom position', function (ev) {
        $interval.cancel(pendingSaveState);
        pendingSaveState = $interval(function () {
            data.gvattrs.save(cy.zoom(), cy.pan(),
                _.fromPairs(cy.nodes().map(function (ele) {
                    return [ele.id(), ele.position()];
                }))
            );
        }, 2000, 1);
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