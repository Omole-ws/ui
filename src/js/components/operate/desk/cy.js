import _ from 'lodash/fp'

import { store } from '../../../../index'
import { Action, DeskMode, NodeType, EdgeType, EdgeTypeInverted } from '../../../actions'

import { uuid, tapeToCorrection } from '../../../helpers'

import style from '!raw-loader!./cy-style.css'

import CyMenus from './cy-menus.js'
import CySelectFromTo from './cy-select-from-to'

const cytoscape = import('./cytoscape-bundled')
    .then(module => {
        module.cxtmenu(module.cytoscape)
        module.edgehandles(module.cytoscape)
        return module.cytoscape
    })
    .catch(err => {
        // TODO: error handling
        console.info('Error on cytoscape loading')
        console.error(err)
    })

const winMenuPatchHndl = function (e) {
    e.preventDefault()
}

export default class Cy {
    constructor(elem, c) {
        this.cy = c({
            container: elem,
            style,
            selectionType: 'additive',
            motionBlur: true // TODO: seems to be excess
        })

        this.cy.edgehandles({
            ...Cy.edgeHandlesDefaults,
            edgeType: (source, target) => {
                if (source.edgesTo(target)
                    .filterFn(e => e.hasClass(this.menus.type))
                    .length > 0) {
                    return null
                }
                return 'flat'
            },
            edgeParams: (srcNode, tgtNode) => ({
                data: {
                    id: uuid(),
                    source: srcNode.id(),
                    target: tgtNode.id(),
                    label: '',
                    note: ''//,
                    // type: this.menus.type
                },
                classes: this.menus.type
            }),
            complete: (srcNode, tgtNodes, addedEntities) => {
                this.edgeCreate({
                    id: addedEntities.id(),
                    source: srcNode.id(),
                    target: tgtNodes.id(),
                    cclabel: EdgeTypeInverted[this.menus.type],
                    weight: 1.0
                })
            }
        })
        this.menus = new CyMenus(this)
        this.modeHandlers = []
        window.addEventListener('contextmenu', winMenuPatchHndl)
    }

    setDeskMode(...args) {
        store.dispatch(Action.setDeskMode(...args))
    }
    nodeDialog(...args) {
        store.dispatch(Action.nodeDialog(...args))
    }
    nodeDelete(...args) {
        store.dispatch(Action.nodeDelete(...args))
    }
    edgeDialog(...args) {
        store.dispatch(Action.edgeDialog(...args))
    }
    edgeCreate(...args) {
        store.dispatch(Action.edgeCreate(...args))
    }
    edgeDelete(...args) {
        store.dispatch(Action.edgeDelete(...args))
    }
    nodePositionChange(...args) {
        store.dispatch(Action.nodePositionChange(...args))
    }
    gvaZoom(...args) {
        store.dispatch(Action.gvaZoom(...args))
    }
    gvaPan(...args) {
        store.dispatch(Action.gvaPan(...args))
    }


    _bindHandlers() {
        this.panHandlerID = null
        this.cy.on('pan', () => {
            const pan = this.cy.pan()
            if (pan.x !== this.pan.x || pan.y !== pan.y) {
                clearTimeout(this.panHandlerID)
                this.panHandlerID = setTimeout(() => {
                    this.gvaPan(this.cy.pan())
                    this.pan = pan
                }, 2000)
            }
        })
        this.zoomHandlerID = null
        this.cy.on('zoom', () => {
            const zoom = this.cy.zoom()
            if (zoom !== this.zoom) {
                clearTimeout(this.zoomHandlerID)
                this.zoomHandlerID = setTimeout(() => {
                    this.gvaZoom(this.cy.zoom())
                    this.zoom = zoom
                }, 2000)
            }
        })
        this.positionHandleID = {}
        this.cy.on('position', 'node', ev => {
            if (ev.target.hasClass('edgehandles-ghost')) { // TODO: seems to be useless, as this class has removed
                return
            }
            const nid = ev.target.id()
            clearTimeout(this.positionHandleID[nid])
            this.positionHandleID[nid] = setTimeout(() => this.nodePositionChange(nid, ev.target.position()), 1000)
        })
    }

    destroy() {
        if (this.menus) {
            this.menus.destroy()
        }
        this.modeHandlers.forEach(handler => handler.destroy())
        this.modeHandlers = []
        window.removeEventListener('contextmenu', winMenuPatchHndl)
        this.cy.destroy()
    }

    setMode(mode, oldMode) {
        this.menus.setup(mode)
        this.modeHandlers = this.modeHandlers.filter(handler => {
            const ifPersist = handler.shouldPersist(mode, oldMode)
            if (!ifPersist) {
                handler.destroy()
            }
            return ifPersist
        })
        switch (mode) {
            case DeskMode.SELECT_FROM_TO:
                this.modeHandlers.push(new CySelectFromTo(this.cy))
                break
        }
    }

    populate(graph, visualAttributes, tape) {
        const base = {
            nodeCreations: {},
            nodeUpdates: {},
            nodeDeletions: {},
            edgeCreations: {},
            edgeUpdates: {},
            edgeDeletions: {},
            zoom: visualAttributes.zoom,
            pan: visualAttributes.pan
        }

        if (graph && graph.edges) {
            base.edgeCreations = graph.edges.reduce((acc, val) => ({...acc, [val.id]: val }), {})
        }
        if (graph && graph.nodes) {
            let nodeCreations = graph.nodes.slice(0)
            if (visualAttributes.positions) {
                nodeCreations = nodeCreations.map(n => ({...n, position: visualAttributes.positions[n.id] || { x: 0, y: 0 } }))
                    //TODO set ini positions for old graphs
            }
            if (visualAttributes.nodeTypes) {
                nodeCreations = nodeCreations.map(n => ({...n, type: visualAttributes.nodeTypes[n.id] }))
            }
            base.nodeCreations = nodeCreations.reduce((acc, val) => ({...acc, [val.id]: val }), {})
        }
        this.applyChanges(tape, base)
        this.pan = this.cy.pan()
        this.zoom = this.cy.zoom()
        this._bindHandlers()
    }

    applyChanges(tape, base) {
        if (tape || base) {
            const correction = tapeToCorrection({ tape, base })
            const nodes = Reflect.ownKeys(correction.nodeCreations)
                .map(nid => Cy.nodeConverter(correction.nodeCreations[nid]))
            const edges = Reflect.ownKeys(correction.edgeCreations)
                .map(eid => Cy.edgeConverter(correction.edgeCreations[eid]))
            // HACK: We need any one node already rendered, look at the end of function
            // const controlNode = this.cy.nodes().slice(0,1)
            this.cy.startBatch()
            this.cy.add({ nodes, edges })
            Reflect.ownKeys(correction.nodeUpdates)
                .map(nid => {
                    const node = correction.nodeUpdates[nid]
                    return [node, Cy.nodeConverter(node), this.cy.nodes(`#${node.id}`)]
                })
                .forEach(([node, convertedNode, cyNode]) => {
                    cyNode.data(convertedNode.data)
                    node.type && cyNode.classes(convertedNode.classes)
                })
            Reflect.ownKeys(correction.edgeUpdates)
                .map(eid => {
                    const edge = correction.edgeUpdates[eid]
                    return [Cy.edgeConverter(edge), this.cy.edges(`#${edge.id}`)]
                })
                .forEach(([convertedEdge, cyEdge]) => {
                    cyEdge.data(convertedEdge.data)
                    cyEdge.classes(convertedEdge.classes)
                })

            this.cy.collection(Object.values(correction.edgeDeletions))
                .remove()
            this.cy.collection(Object.values(correction.nodeDeletions))
                .remove()
            if (base) {
                correction.zoom && this.cy.zoom(correction.zoom)
                correction.pan && this.cy.pan(correction.pan)
            }
            this.cy.endBatch()
            // HACK: ugly hack, witthout this newly added nodes will disapear on next tap on the viewport
            // and will appear only after some grafics changed (selection, node move, but not pan/zoom)
            // controlNode.select()
            // controlNode.unselect()
        }
    }

    layout() {
        this.cy.layout({
            fit: false,
            name: 'cose',
            padding: 1,
            componentSpacing: -100,
            gravity: 400,
            nestingFactor: 1,
            idealEdgeLength: 10,
            edgeElasticity: 1000
        })
    }

    showGroups(groups, id) {
        this.cy.startBatch()
        Reflect.ownKeys(groups)
            .filter(g => !id || Array.isArray(id) && id.some(el => el === g) )
            .forEach(g => {
                const id = g.replace(/:/g, '-')
                this.cy.add({ group: 'nodes', data: { id, label: g }, classes: 'group' })
                this.cy.nodes(groups[g].map(nid => `#${nid}`)
                        .join(','))
                    .move({ parent: id })
            })
        this.cy.endBatch()
    }

    hideGroups(groups) {
        this.cy.startBatch()
        const gRepresentation = Reflect.ownKeys(groups)
            .reduce((acc, g) => {
                const groupRoot = this.cy.nodes(`#${g.replace(/:/g, '-')}`)
                return {
                    parents: acc.parents.add(groupRoot),
                    children: acc.children.add(groupRoot.children())
                }
            }, { parents: this.cy.collection(), children: this.cy.collection() })
        gRepresentation.children.move({ parent: null })
        this.cy.remove(gRepresentation.parents)
        this.cy.endBatch()
    }

    static buildPathsEdgeSelector(paths) {
        return Array.from(
                paths.reduce((acc, path) => {
                    return path.edges.reduce((accInner, eid) => accInner.add(`#${eid}`), acc)
                }, new Set())
            )
            .join(',')

    }

    showPaths(paths) {
        const selector = Cy.buildPathsEdgeSelector(paths)
        let pathEles = this.cy.edges(selector)
        pathEles = pathEles.add(pathEles.connectedNodes())
        this.cy.startBatch()
        this.cy.elements().addClass('dim')
        pathEles.removeClass('dim')
        this.cy.nodes('.group').removeClass('dim')
        this.cy.endBatch()
    }

    hidePaths() {
        this.cy.startBatch()
        this.cy.elements().removeClass('dim')
        this.cy.endBatch()
    }

    highlightPath(path) {
        this.cy.startBatch()
        path.edges
            .forEach((eid, i) => {
                this.cy.edges(`#${eid}`)
                    .addClass('path-hl')
                    .data('plabel', i + 1)
            })
        this.cy.nodes(`#${path.from}`)
            .addClass('path-from')
        this.cy.nodes(`#${path.to}`)
            .addClass('path-to')
        this.cy.endBatch()
    }

    dimPath(path) {
        this.cy.startBatch()
        path.edges
            .forEach(eid => {
                this.cy.edges(`#${eid}`)
                    .removeClass('path-hl')
                    .data('plabel', null)
            })
        this.cy.nodes(`#${path.from}`)
            .removeClass('path-from')
        this.cy.nodes(`#${path.to}`)
            .removeClass('path-to')
        this.cy.endBatch()
    }

    //       _______ _______ _______ _______ _____ _______ _______
    //       |______    |    |_____|    |      |   |       |______
    //       ______|    |    |     |    |    __|__ |_____  ______|


    static edgeHandlesDefaults = {
        preview: true, // whether to show added edges preview before releasing selection
        stackOrder: 50, // Controls stack order of edgehandles canvas element by setting it's z-index
        handleSize: 10, // the size of the edge handle put on nodes
        handleHitThreshold: 6, // a threshold for hit detection that makes it easier to grab the handle
        handleIcon: false, // an image to put on the handle
        handleColor: '#ff0000', // the colour of the handle and the line drawn from it
        handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
        handleLineWidth: 1, // width of handle line in pixels
        handleOutlineColor: '#000000', // the colour of the handle outline
        handleOutlineWidth: 0, // the width of the handle outline in pixels
        handleNodes: node => !node.isParent(), // selector/filter function for whether edges can be made from a given node
        handlePosition: 'middle top', // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
        hoverDelay: 150, // time spend over a target node before it is considered a target selection
        cxt: false, // whether cxt events trigger edgehandles (useful on touch)
        enabled: false, // whether to start the extension in the enabled state
        toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
        edgeType( /*sourceNode, targetNode*/ ) {
            // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
            // returning null/undefined means an edge can't be added between the two nodes
            return 'flat'
        },
        loopAllowed( /*node*/ ) {
            // for the specified node, return whether edges from itself to itself are allowed
            return false
        },
        nodeLoopOffset: -50, // offset for edgeType: 'node' loops
        nodeParams( /*sourceNode, targetNode*/ ) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for intermediary node
            return {}
        },
        edgeParams( /*sourceNode, targetNode, i*/ ) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for edge
            // NB: i indicates edge index in case of edgeType: 'node'
            return {}
        },
        start( /*sourceNode*/ ) {
            // fired when edgehandles interaction starts (drag on handle)
        },
        complete( /*sourceNode, targetNodes, addedEntities*/ ) {},
        stop( /*sourceNode*/ ) {
            // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
        },
        cancel: function( sourceNode, renderedPosition ) {
            // fired when edgehandles are cancelled ( incomplete - nothing has been added ) - renderedPosition is where the edgehandle was released
        }
    }

    static create(elem, ok) {
        cytoscape
            .then(c => {
                const cy = new Cy(elem, c)
                    // cy.setDeskMode = setDeskMode
                ok(cy)
            })
            .catch(err => {
                // TODO: error handling
                console.error(err)
            })
    }

    // node converter from storage format to cytoscape node
    static nodeConverter(node, opts) {
        const converted = {
            data: {
                id: node.id,
                label: node.label,
                note: node.comment,
                active: node.active,
                type: node.type || node.active
            },
            position: node.position || { x: 0, y: 0 }
        }
        converted.classes = NodeType[node.active]
        if (node.type) {
            converted.classes = `${converted.classes} ${node.type}`
        }
        if (opts && opts.ifShowLevel) {
            converted.data.label = `${node.label}(${node.level})`
        }
        return converted
    }

    // edge converter from storage format to cytoscape edge
    static edgeConverter(edge) {
        // ===============================================================
        const converted = {
            data: {
                id: edge.id,
                label: edge.label || '',
                note: edge.comment || '',
                source: edge.source,
                target: edge.target//,
                // cclabel: EdgeType[edge.cclabel]
            }
        }
        converted.data.weight = _.isNumber(edge.weight) && edge.weight >= 0 && edge.weight <= 1 ? edge.weight : 1.0
        converted.classes = EdgeType[edge.cclabel]
        return converted
    }
}
