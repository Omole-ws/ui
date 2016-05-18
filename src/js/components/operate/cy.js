import loadCytoscape from 'promise?bluebird!cytoscape'
// import loadCxtMenu from 'promise?bluebird!cytoscape-cxtmenu'
import loadCxtMenu from 'promise?bluebird!cytoscape-cxtmenu'
import loadEdgeHandles from 'promise?bluebird!cytoscape-edgehandles'

import style from '!raw!./cy-style.css'

import { ActionType, NodeType, EdgeType, EdgeTypeInverted } from '../../actions'
import { uuid, tapeToCorrection } from '../../helpers'
import CyMenus from './cy-menus.js'

const cytoscape = Promise.all([loadCytoscape(), loadCxtMenu(), loadEdgeHandles()])
.then(([cytoscape, cxtmenu, edgehandles]) => {
    cxtmenu(cytoscape, $)
    edgehandles(cytoscape, $)
    return cytoscape
})
.catch(err => {
    // TODO: error handling
    console.error(err)
})

export default class Cy {
    constructor(elem, c) {
        this.cy = c({
            container: elem,
            style,
            selectionType: 'additive',
            // autounselectify: true,
            motionBlur: true
        })
        this.cy.edgehandles({
            ...Cy.edgeHandlesDefaults,
            edgeParams: () => ({data: {id: uuid()}, classes: this.menus.type}),
            complete: (sourceNode, targetNodes, addedEntities) => {
                this.edgeCreate({
                    id: addedEntities.id(),
                    source: sourceNode.id(),
                    target: targetNodes.id(), 
                    cclabel: EdgeTypeInverted[this.menus.type]
                })
            }
        })
        this.panHandlerID = null
        this.cy.on('pan', () => {
            clearTimeout(this.panHandlerID)
            setTimeout(() => this.gvaPan(this.cy.pan()), 2)
        })
        this.menus = new CyMenus(this)
    }

    destroy() {
        this.cy.destroy()
        if (this.menus) {
            this.menus.destroy()
        }
    }

    setMenus(mode) {
        this.menus.setup(mode)
    }

    populate(graph, visualAttributes, tape) {
        const ifPanZoom = tape && tape
            .map(a => a.type)
            .filter(t => t === ActionType.GVA_ZOOM || t === ActionType.GVA_PAN)
            .reduce((acc, val) => ({...acc, [val]: true}), {})
            || {}
        if (visualAttributes.zoom) {
            this.cy.zoom(visualAttributes.zoom)
        } else if (!ifPanZoom[ActionType.GVA_ZOOM]) {
            this.gvaZoom(this.cy.zoom())
        }
        if (visualAttributes.pan) {
            this.cy.pan(visualAttributes.pan)
        } else if (!ifPanZoom[ActionType.GVA_PAN]) {
            this.gvaPan(this.cy.pan())
        }

        let edgeCreations = [], nodeCreations = []
        if (graph && graph.edges) {
            edgeCreations = graph.edges
                .map(e => Cy.edgeConverter(e))
                .reduce((acc, val) => ({...acc, [val.data.id]: val}), {})
        }
        if (graph && graph.nodes) {
            if (visualAttributes.positions) {
                nodeCreations = graph.nodes.map(n => ({...n, position: visualAttributes.positions[n.id] || {x:0, y:0}}))
                //TODO set ini positions for old graphs
            }
            if (visualAttributes.nodeTypes) {
                nodeCreations = nodeCreations.map(n => ({...n, type: visualAttributes.nodeTypes[n.id]}))
            }
            nodeCreations = nodeCreations
                .map(e => Cy.nodeConverter(e))
                .reduce((acc, val) => ({...acc, [val.data.id]: val}), {})
        }
        this.applyChanges(tape, {nodeCreations, edgeCreations})
    }

    applyChanges(tape, base) {
        if (tape) {
            const correction = tapeToCorrection(tape, base)
            const nodes = Object.values(correction.nodeCreations).map(node => Cy.nodeConverter(node))
            const edges = base && Object.values(correction.edgeCreations).map(edge => Cy.edgeConverter(edge)) || []
            this.cy.startBatch()
            this.cy.add({nodes, edges})
            Object.values(correction.nodeUpdates)
                .map(node => [node, Cy.nodeConverter(node), this.cy.$(`#${node.id}`)])
                .forEach(([node, convertedNode, cyNode]) => {
                    cyNode.data(convertedNode.data)
                    node.type && cyNode.classes(convertedNode.classes)
                })
            Object.values(correction.edgeUpdates)
                .map(edge => [Cy.edgeConverter(edge), this.cy.$(`#${edge.id}`)])
                .forEach(([convertedEdge, cyEdge]) => {
                    cyEdge.data(convertedEdge.data)
                    cyEdge.classes(convertedEdge.classes)
                })

            this.cy.collection(Object.values(correction.edgeDeletions)).remove()
            this.cy.collection(Object.values(correction.nodeDeletions)).remove()
            correction.zoom && this.cy.zoom(correction.zoom)
            correction.pan && this.cy.pan(correction.pan)
            this.cy.endBatch()
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


// ++++++++++++++++++++++++++++++++
// +++++++++++ STATICS ++++++++++++
// ++++++++++++++++++++++++++++++++

    static edgeHandlesDefaults = {
        preview: true, // whether to show added edges preview before releasing selection
        stackOrder: 4, // Controls stack order of edgehandles canvas element by setting it's z-index
        handleSize: 10, // the size of the edge handle put on nodes
        handleColor: '#ff0000', // the colour of the handle and the line drawn from it
        handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
        handleLineWidth: 1, // width of handle line in pixels
        handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
        hoverDelay: 150, // time spend over a target node before it is considered a target selection
        cxt: false, // whether cxt events trigger edgehandles (useful on touch)
        enabled: false, // whether to start the extension in the enabled state
        toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
        edgeType(/*sourceNode, targetNode*/) {
            // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
            // returning null/undefined means an edge can't be added between the two nodes
            return 'flat'
        },
        loopAllowed(/*node*/) {
            // for the specified node, return whether edges from itself to itself are allowed
            return false
        },
        nodeLoopOffset: -50, // offset for edgeType: 'node' loops
        nodeParams(/*sourceNode, targetNode*/) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for intermediary node
            return {}
        },
        edgeParams(/*sourceNode, targetNode, i*/) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for edge
            // NB: i indicates edge index in case of edgeType: 'node'
            return {}
        },
        start(/*sourceNode*/) {
            // fired when edgehandles interaction starts (drag on handle)
        },
        complete(/*sourceNode, targetNodes, addedEntities*/) {
        },
        stop(/*sourceNode*/) {
            // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
        }
    }

    static create(elem, ok) {
        cytoscape.then(c => {
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
                label: node.info.label,
                note: node.info.comment,
                active: node.active
                // label: node.info.label + '(' + node.level + ')',
                // attr: node.info.atrib,
                // status: node.info.status,
                // active: node.active,
                // level: node.level,
                // zone: node.zone
            // },
            // scratch: {
                // src: node
            },
            position: node.position || {x: 0, y: 0}
        }
        converted.classes = NodeType[node.active]
        if (node.type) {
            converted.classes = `${converted.classes} ${node.type}`
        }
        if (opts && opts.ifShowLevel) {
            converted.data.label = `${node.info.label}(${node.level})`
        }
        return converted
    }

    // edge converter from storage format to cytoscape edge
    static edgeConverter(edge) {
        // ===============================================================
        const converted = {
            data: {
                id: edge.id,
                label: edge.info && edge.info.label || null,
                note: edge.info && edge.info.comment || null,
                // attr: edge.info.atrib,
                // status: edge.info.status,
                // cclabel: edge.cclabel,
                source: edge.source,
                target: edge.target
            // },
            // scratch: {
                // src: edge
            }
        }
        converted.classes = EdgeType[edge.cclabel]
        return converted
    }
}
