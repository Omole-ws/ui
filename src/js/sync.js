import { store } from '../index'
import { tapeToCorrection } from './helpers'
import { Action } from './actions'

class WorkerDescriptor {
    constructor(gid, handle) {
        this.gid = gid
        this.handle = handle
        this.ctime = Date.now()
    }
    delay() {
        const now = Date.now()
        if (now - this.ctime < 60 * 1000) {
            clearTimeout(this.handle)
            this.handle = chargeSync(this.gid, store.getState().tapes[this.gid])
        }
    }
}

let tapes = {}
const workers = {}
let lev = 0
export function dataSync() {
    lev += 1
    console.log('INCONSOLANTA-(' + lev + ')');
    const newTapes = store.getState().tapes
    if (newTapes === tapes) {
        lev -= 1
        return
    }
    Reflect.ownKeys(newTapes)
        .forEach(gid => {
            if (gid in tapes && newTapes[gid] === tapes[gid]) {
                return
            }
            const tape = newTapes[gid]
            if (tape.length > 0 && !tape.isSyncing) {
                if (gid in workers) {
                    workers[gid].delay()
                } else {
                    workers[gid] = new WorkerDescriptor(gid, chargeSync(gid, tape))
                }
            }
        })
    tapes = newTapes
    lev -= 1
}

function chargeSync(gid, tape) {
    return setTimeout(() => {
        const correction = tapeToCorrection({ tape: tape, patch: true })
        const patch = _correctionToPatch(correction)
        patch.id = gid
        patch.length = tape.length
        store.dispatch(Action.patchGraph(patch))
        Reflect.deleteProperty(workers, gid)
    }, 10000)
}

function _correctionToPatch(correction) {
    const gInserts = { nodes: {}, edges: {} }
    const gUpdates = { nodes: {}, edges: {} }
    const gDeletions = { nodes: {}, edges: {} }
    const gvaUpserts = { positions: {}, nodeTypes: {} }
    const gvaDeletions = { positions: {}, nodeTypes: {} }
    Object.values(correction.nodeCreations)
        .forEach(({ type, position, ...upsert }) => {
            gInserts.nodes[upsert.id] = upsert
            gvaUpserts.positions[upsert.id] = position
            gvaUpserts.nodeTypes[upsert.id] = type
        })
    Object.values(correction.nodeUpdates)
        .forEach(({ type, position, ...upsert }) => {
            if (Reflect.ownKeys(upsert)
                .length > 1) {
                gUpdates.nodes[upsert.id] = upsert
            }
            if (position) {
                gvaUpserts.positions[upsert.id] = position
            }
            if (type) {
                gvaUpserts.nodeTypes[upsert.id] = type
            }
        })
    Reflect.ownKeys(correction.nodeDeletions)
        .forEach(nid => {
            gDeletions.nodes[nid] = true
            gvaDeletions.positions[nid] = true
            gvaDeletions.nodeTypes[nid] = true
        })
    gInserts.edges = correction.edgeCreations
    gUpdates.edges = correction.edgeUpdates
    Reflect.ownKeys(correction.edgeDeletions)
        .forEach(eid => gDeletions.edges[eid] = true)

    return { gInserts, gUpdates, gDeletions, gvaUpserts, gvaDeletions, zoom: correction.zoom, pan: correction.pan }
}

