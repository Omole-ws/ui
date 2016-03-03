angular.module('ccengine')
.factory('dataSvc', ['$q', '$http', 'messagesSvc', 'eventsDeliverySvc', 'graphSvc', 'gvattrsSvc',
     'nodeGroupsSvc', 'pathGroupsSvc',
    function ($q, $http, msgs, evs, gSvc, gvattrsSvc, ngSvc, pgSvc) {

        // ===============================================================
        // Core data operations
        // var graph = {id: null, info: {}, nodes: [], edges: []};
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
            return gSvc.get({id: this.gid}).$promise.then((function (resp) {
                msgs.clear(mID);
                _.merge(self.graph, resp);
                self.nodesSort(self.nodes);
                self.edgesSort(self.edges);
                self.estampo = Date.now();
            }).bind(this), function (err) {
                msgs.clear(mID);
                msgs.send('err', 'Failed to retrieve data. Server: ' + err.statusText);
                return $q.reject(err);
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
                    $http.get('/app/t/ccgraphevict?gid=' + self.gid, {headers: {Accept: 'text/plain'}});
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
                                var upd = _.find(resp[name], {id: el.id});
                                if (upd) {
                                    _.merge(el, upd);
                                    ev_data[name].push(el);
                                }
                            });
                        }
                    });
                    self.nodesSort(self.nodes);
                    self.edgesSort(self.edges);
                    $http.get('/app/t/ccgraphevict?gid=' + self.gid, {headers: {Accept: 'text/plain'}});
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
                            var ids = _.map(resp[name], 'id');
                            _.remove(self[name], function (el) {
                                if (_.includes(ids, el.id)) {
                                    ev_data[name].push(el);
                                    return true;
                                }
                                return false;
                            });
                        }
                    });
                    $http.get('/app/t/ccgraphevict?gid=' + self.gid, {headers: {Accept: 'text/plain'}});
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
        // GRAPH VISUAL ATTRIBUTES
        function GVAttrs(gid) {
            this.gid = gid;
            var zoom;
            var pan;
            var positions;
        }
        GVAttrs.prototype.get = function () {
            var self = this;
            return gvattrsSvc.get({id: this.gid}).$promise.then(function (data) {
                self.id = data.id;
                self.zoom = data.zoom;
                self.pan = data.pan;
                self.positions = data.positions;
            }, function (err) {
                return gvattrsSvc.insert({gid: self.gid}).$promise.then(function (resp) {
                    self.id = resp.id;
                }, function (err) {
                    return $q.reject(err);
                });
            });
        };
        GVAttrs.prototype.create = function (zoom, pan, positions) {
            gvattrsSvc.insert({gid: this.gid, zoom: zoom, pan: pan, positions: positions});
        };
        GVAttrs.prototype.save = function (zoom, pan, positions) {
            gvattrsSvc.save({id: this.id}, {gid: this.gid, zoom: zoom, pan: pan, positions: positions});
        };
        // ===============================================================

        // ===============================================================
        // NODE GROUPS
        function NodeGroup(g) {
            _.assign(this, g);
            Object.defineProperties(this, {
                subGroups: {value: _.invertBy(this.mappings)}
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
                this.gvattrs = new GVAttrs(gid);
                this.groups.splice(0, this.groups.length);
                this.paths.splice(0, this.paths.length);
                var d = this.get();
                var gva = this.gvattrs.get();
                var self = this;
                $q.all([d, gva]).then(function () {
                    evs.notify('DATA_RELOAD', {n: self.nodes, e: self.edges});
                });
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
        $http.get('/app/t').then(function (resp) {
            _.merge(dataObj.algos, resp.data);
        });
        Object.defineProperty(dataObj.algos, 'checkURL', {value: '/app/t/cctask'});
        Object.defineProperty(dataObj.algos, 'domain', {value: '/app/t/'});
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
