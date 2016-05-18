import { tapeToCorrection } from './helpers'

export default class Sync {
    constructor(tape, patchGraph) {
        this.tape = tape
        this.patchGraph = patchGraph

        console.log('SYNC CONSTRUCT')
    }

    changeTape(tape) {
        this.tape = tape
    }

    run() {
        this.workerHandle = setInterval(this.worker.bind(this), 10000)
        console.log('SYNC RUN')
    }

    stop() {
        clearInterval(this.workerHandle)
    }

    worker() {
        console.log('SYNC GONA HAPPEN')
        for (const gid in this.tape) {
            if (this.tape[gid].length > 0) {
                const correction = tapeToCorrection({tape: this.tape[gid], patch: true})
                const patch = this._correctionToPatch(correction)
                patch.id = gid
                patch.length = this.tape[gid].length
                this.patchGraph(patch)
            }
        }
    }

    _correctionToPatch(correction) {
        const gInserts = {nodes: {}, edges: {}}
        const gUpdates = {nodes: {}, edges: {}}
        const gDeletions = {nodes: {}, edges: {}}
        const gvaUpserts = {positions: {}, nodeTypes: {}}
        const gvaDeletions = {positions: {}, nodeTypes: {}}
        Object.values(correction.nodeCreations).forEach(({type, position, ...upsert}) => {
            gInserts.nodes[upsert.id] = upsert
            gvaUpserts.positions[upsert.id] = position
            gvaUpserts.nodeTypes[upsert.id] = type
        })
        Object.values(correction.nodeUpdates).forEach(({type, position, ...upsert}) => {
            if (Reflect.ownKeys(upsert).length > 1) {
                gUpdates.nodes[upsert.id] = upsert
            }
            if (position) {
                gvaUpserts.positions[upsert.id] = position
            }
            if (type) {
                gvaUpserts.nodeTypes[upsert.id] = type
            }
        })
        Reflect.ownKeys(correction.nodeDeletions).forEach(nid => {
            gDeletions.nodes[nid] = true
            gvaDeletions.positions[nid] = true
            gvaDeletions.nodeTypes[nid] = true
        })
        gInserts.edges = correction.edgeCreations
        gUpdates.edges = correction.edgeUpdates
        Reflect.ownKeys(correction.edgeDeletions).forEach(eid => gDeletions.edges[eid] = true)

        return {gInserts, gUpdates, gDeletions, gvaUpserts, gvaDeletions, zoom: correction.zoom, pan: correction.pan}
    }
}