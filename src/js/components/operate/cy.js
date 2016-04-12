import cytoscapeLdr from 'promise?bluebird!cytoscape'

import style from '!raw!./cy-style.css'

export default class Cy {

    constructor(elem) {
        this._cy = cytoscapeLdr().then(cytoscape => {
            let _cy = cytoscape({
                container: elem,
                selectionType: 'additive',
                autounselectify: true,
                motionBlur: true
            })
            _cy.style(style)
            _cy.resize()
            return _cy
        })
    }

    destroy() {
        this._cy.then(_cy => _cy.destroy())
    }

    layout() {
        this._cy.then(_cy => _cy.layout({
            name: 'cose',
            padding: 1,
            componentSpacing: -100,
            gravity: 400,
            nestingFactor: 1,
            idealEdgeLength: 10,
            edgeElasticity: 1000
        }))
    }


    load(graph) {
        const toLoad = {}
        if (graph && graph.edges) {
            toLoad.edges = graph.edges.map(e => Cy.edgeConverter(e))
        }
        if (graph && graph.nodes) {
            toLoad.nodes = graph.nodes.map(e => Cy.nodeConverter(e))
        }
        this._cy.then(_cy => {
            _cy.add(toLoad)
            this.layout()
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
            converted.data.label = node.info.label + '(' + node.level + ')'
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