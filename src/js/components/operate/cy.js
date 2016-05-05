import _ from 'lodash'
import loadCytoscape from 'promise?bluebird!cytoscape'
// import loadCxtMenu from 'promise?bluebird!cytoscape-cxtmenu'
import loadCxtMenu from 'promise?bluebird!cytoscape-cxtmenu'
import loadEdgeHandles from 'promise?bluebird!cytoscape-edgehandles'

import style from '!raw!./cy-style.css'

import { uuid } from '../../helpers'
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
        this.cy.edgehandles(Cy.edgeHandlesDefaults)
    }

    destroy() {
        this.cy.destroy()
        if (this.menus) {
            this.menus.destroy()
        }
    }

    setMenus(mode) {
        if (this.menus) {
            this.menus.destroy()
        }
        this.menus = new CyMenus(this, mode)
    }

    populate(graph, visualAttributes) {
        if (visualAttributes.zoom && visualAttributes.pan) {
            this.cy.viewport({zoom: visualAttributes.zoom, pan: visualAttributes.pan})
        }

        let edges = [], nodes = []
        if (graph && graph.edges) {
            edges = graph.edges.map(e => Cy.edgeConverter(e))
        }
        if (graph && graph.nodes) {
            nodes = graph.nodes.map(e => Cy.nodeConverter(e))
        }
        if (visualAttributes.positions) {
            nodes = nodes.map(n => ({...n, position: visualAttributes.positions[n.data.id] || {x:0, y:0}}))
        }
        this.cy.add({nodes, edges})
        if (!visualAttributes.positions) {
            this.layout()
        }
    }

    layout() {
        this.cy.layout({
            name: 'cose',
            padding: 1,
            componentSpacing: -100,
            gravity: 400,
            nestingFactor: 1,
            idealEdgeLength: 10,
            edgeElasticity: 1000
        })
    }


    addNode(ele) {
        const node = {
            data: {
                id: uuid(),
                label: ele.label,
                'text-valign': 'center'
            },
            position: ele.position || {x: 0, y: 0 },
            classes : ele.type
        }
        this.cy.add({nodes: [node]})
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
        edgeType: function(/*sourceNode, targetNode*/) {
            // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
            // returning null/undefined means an edge can't be added between the two nodes
            return 'flat'
        },
        loopAllowed: function(/*node*/) {
            // for the specified node, return whether edges from itself to itself are allowed
            return false
        },
        nodeLoopOffset: -50, // offset for edgeType: 'node' loops
        nodeParams: function(/*sourceNode, targetNode*/) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for intermediary node
            return {}
        },
        edgeParams: function(/*sourceNode, targetNode, i*/) {
            // for edges between the specified source and target
            // return element object to be passed to cy.add() for edge
            // NB: i indicates edge index in case of edgeType: 'node'
            return {}
        },
        start: function(/*sourceNode*/) {
            // fired when edgehandles interaction starts (drag on handle)
        },
        complete: function(/*sourceNode, targetNodes, addedEntities*/) {
            // fired when edgehandles is done and entities are added
        },
        stop: function(/*sourceNode*/) {
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
                label: node.info.label
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
            position: {
                x: 0,
                y: 0
            }
        }
        switch (node.active) {
            case 'OBJECT':
                converted.classes = 'object'
                break
            case 'SUBJECT_OR_OBJECT':
                converted.classes = 'subject-object'
                break
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
        }
        switch (edge.cclabel) {
            case 'R_ONLY':
                converted.classes = 'r-only'
                break
            case 'W_ONLY':
                converted.classes = 'w-only'
                break
            case 'READ':
                converted.classes = 'read'
                break
            case 'WRITE':
                converted.classes = 'write'
                break
            case 'TAKE':
                converted.classes = 'take'
                break
            case 'GRANT':
                converted.classes = 'grant'
                break
        }
        return converted
    }
}
