angular.module('ccengine')
.factory('dataSvc', ['$q', '$http', 'configSvc', 'messagesSvc', 'eventsDeliverySvc', 'graphSvc', 'nodeGroupsSvc', 'pathGroupsSvc',
    function ($q, $http, cfg, msgs, evs, gSvc, ngSvc, pgSvc) {

        // ===============================================================
        // Core data operations
        var graph = {id: null, info: {}, nodes: [], edges: []};
        function Data(gid) {
            Object.defineProperties(this, {
                gid: {value: gid, writable: true},
                graph: {value: {id: gid, info: {}, nodes: [], edges: []}, writable: true},
                nodes: {get: function () {return this.graph.nodes;}},
                edges: {get: function () {return this.graph.edges;}},
                estampo: {value: 0, writable: true}
            });
        }
        Data.prototype = {};
        Data.prototype.reset = function () {
            this.nodes.splice(0, this.nodes.length);
            this.edges.splice(0, this.edges.length);
        };
        Data.prototype.nodesSort = function (ns) {
            if (ns) {
                ns.sort(function (a, b) {
                    return a.info.label.localeCompare(b.info.label);
                });
            }
        };
        Data.prototype.nodeById = function (id) {
            return this.nodes.find(function (el) {
                return el.id == id;
            });
        };
        Data.prototype.edgesSort = function (es) {
            var self = this;
            if (es) {
                es.sort(function (a, b) {
                    var aN = self.nodeById(a.source);
                    var bN = self.nodeById(b.source);
                    var rc = aN.info.label.localeCompare(bN.info.label);
                    if (rc !== 0) {
                        return rc;
                    } else {
                        aN = self.nodeById(a.target);
                        bN = self.nodeById(b.target);
                        return aN.info.label.localeCompare(bN.info.label);
                    }
                });
            }
        };
        Data.prototype.get = function () {
            var self = this;
            var mID = msgs.send('inf', 'Loading data...');
            this.reset();
            gSvc.get({id: this.gid}).$promise.then((function (resp) {
                msgs.clear(mID);
                _.merge(self.graph, resp);
                self.nodesSort(self.nodes);
                self.edgesSort(self.edges);
                self.estampo = Date.now();
                evs.notify('DATA_RELOAD', {n: self.nodes, e: self.edges});
            }).bind(this), function (err) {
                msgs.clear(mID);
                msgs.send('err', 'Failed to retrieve data. Server: ' + err.statusText);
            });
        };
        Data.prototype.insert = function (data) {
            if (data) {
                var self = this;
                var mID = msgs.send('inf', 'Inserting...');
                gSvc.update({id: this.gid}, {nodes: data.n, edges: data.e}).$promise
                .then(function  (resp) {
                    var ev_data = {nodes: [], edges: []};
                    ['nodes', 'edges'].forEach(function (name) {
                        if (_.isArray(resp[name])) {
                            resp[name].forEach(function (el) {
                                self[name].push(el);
                                ev_data[name].push(el);
                            });
                        }
                    });
                    self.nodesSort(self.nodes);
                    self.edgesSort(self.edges);
                    evs.notify('DATA_INSERT', {n: ev_data.nodes, e: ev_data.edges});
                }, function (err) {
                    msgs.send('err', 'Some of inserts failed. Server: ' + err.statusText);
                })
                .finally(function () {
                    msgs.clear(mID);
                });
            }
        };
        Data.prototype.update = function (data) {
            if (data) {
                var self = this;
                var mID = msgs.send('inf', 'Updating...');
                gSvc.update({id: this.gid}, {nodes: data.n, edges: data.e}).$promise
                .then(function (resp) {
                    var ev_data = {nodes: [], edges: []};
                    ['nodes', 'edges'].forEach(function (name) {
                        if (_.isArray(resp[name])) {
                            self[name].forEach(function (el) {
                                var upd = _.findWhere(resp[name], {id: el.id});
                                if (upd) {
                                    _.merge(el, upd);
                                    ev_data[name].push(el);
                                }
                            });
                        }
                    });
                    self.nodesSort(self.nodes);
                    self.edgesSort(self.edges);
                    evs.notify('DATA_UPDATE', {n: ev_data.nodes, e: ev_data.edges});
                }, function (err) {
                    msgs.send('err', 'Fail to update, Server: ' + err.statusText);
                })
                .finally(function () {
                    msgs.clear(mID);
                });
            }
        };
        Data.prototype.remove = function (data) {
            if (data) {
                var self = this;
                var mID = msgs.send('inf', 'Removing...');
                gSvc.update({id: this.gid, rm: true}, {nodes: data.n, edges: data.e}).$promise
                .then(function (resp) {
                    var ev_data = {nodes: [], edges: []};
                    ['nodes', 'edges'].forEach(function (name) {
                        if (_.isArray(resp[name])) {
                            var ids = _.pluck(resp[name], 'id');
                            _.remove(self[name], function (el) {
                                if (_.contains(ids, el.id)) {
                                    ev_data[name].push(el);
                                    return true;
                                }
                                return false;
                            });
                        }
                    });
                    evs.notify('DATA_REMOVE', {n: ev_data.nodes, e: ev_data.edges});
                }, function (err) {
                    msgs.send('err', 'Fail to remove, Server: ' + err.statusText);
                })
                .finally(function () {
                    msgs.clear(mID);
                });
            }
        };
        // -- End of core data operation

        // ===============================================================
        // NODE GROUPS
        function NodeGroup(g) {
            _.assign(this, g);
            Object.defineProperties(this, {
                subGroups: {value: _.invert(this.mappings, true)}
            });
        }
        // -- End of NODE GROUPS

        // ===============================================================
        // Paths object definition

        function Path(data, kind, paths) {
            Array.call(this);
            Object.defineProperties(this, {
                data: {value: data},
                kind: {value: kind},
                estampo: {value: 0, writable: true}
            });
            this.splice.bind(this, 0, 0).apply(this, paths);
            this.estampo = Date.now();
        }
        Path.prototype = [];
        Object.defineProperty(this, 'valid', {get: function () {
            return this.estampo >= this.data.estampo;
        }});
        // -- End of Path object definition

        dataObj = new Data();
        Object.defineProperties(dataObj, {
            setupDesk: {value: function (gid) {
                this.gid = gid;
                this.groups.splice(0, this.groups.length);
                this.paths.splice(0, this.paths.length);
                this.get();
                var self = this;
                // $q.all([this.nodes.$promise, this.edges.$promise]).then(function (resp) {
                //     self.zones = new Zones(gid, self);
                //     self.levels = new Levels(gid, self);
                //     // self.bridges = new Bridges(gid, self);
                //     self.paths = [];
                // });
            }},
            algos: {value: []},
            // algos: {value: [
            //     {
            //         name: 'Build zones',
            //         // url: 'http://localhost:57057/',
            //         url: 'http://localhost:8081/ccisland',
            //         in: ['gid'],
            //         out: 'NODE_GROUP',
            //         running: false,
            //         checkInProgress: false
            //     }
            // ]},
            groups: {value: []},
            paths: {value: []}
        });
        $http.get(cfg.algoServicesBaseURL + '/').then(function (resp) {
            _.merge(dataObj.algos, resp.data);
        });
        Object.defineProperty(dataObj.algos, 'checkURL', {value: cfg.algoServicesBaseURL + '/cctask'});
        Object.defineProperty(dataObj.algos, 'domain', {value: cfg.algoServicesBaseURL + '/'});
        Object.defineProperty(dataObj.groups, 'add', {value: function (id) {
            var self = this;
            ngSvc.get({id: id}).$promise.then(function (resp) {
                var group = new NodeGroup(resp);
                var idx = _.findIndex(self, {type: resp.type});
                if (idx >= 0) {
                    self.splice(idx, 1, group);
                } else {
                    self.push(group);
                }
                evs.notify('GROUP_NEW', group);
            }, function (err) {
                msgs.send('err', 'Fail to retrieve node group. Server: ' + err.statusText);
            });
        }});
        Object.defineProperty(dataObj.paths, 'add', {value: function (ids) {
            var self = this;
            var promises = ids.map(function (id) {
                return pgSvc.get({id: id}).$promise;
            });
            $q.all(promises).then(function (resp) {
                var group = new Path(dataObj, null, resp);
                if (resp[0].type === 'BRIDGE') {
                    group.type = 'BRIDGE';
                    var idx = _.findIndex(self, {type: resp.type});
                    if (idx >= 0) {
                        self.splice(idx, 1, group);
                    } else {
                        self.push(group);
                    }
                } else {
                    self.push(group);
                }
                evs.notify('PATH_NEW', group[0]);
            }, function (err) {
                msgs.send('err', 'Fail to retrieve node group. Server: ' + err.statusText);
            });
        }});

        return dataObj;
    }
]);
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
