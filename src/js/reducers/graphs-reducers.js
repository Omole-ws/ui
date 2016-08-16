import { ActionType } from '../actions'

function _patch(graph, patch, info) {
    const patchedGraph = { ...graph, ...info }
    if (patch.gInserts) {
        let nodes = graph.nodes
        if (Reflect.ownKeys(patch.gDeletions.nodes).length > 0) {
            nodes = nodes.filter(node => !patch.gDeletions.nodes[node.id])
        }
        if (Reflect.ownKeys(patch.gUpdates.nodes).length > 0) {
            nodes = nodes.map(node => ({...node, ...patch.gUpdates.nodes[node.id]}))
        }
        patchedGraph.nodes = nodes.concat(Object.values(patch.gInserts.nodes))

        let edges = graph.edges
        if (Reflect.ownKeys(patch.gDeletions.edges).length > 0) {
            edges = edges.filter(edge => !patch.gDeletions.edges[edge.id])
        }
        if (Reflect.ownKeys(patch.gUpdates.edges).length > 0) {
            edges = edges.map(edge => ({...edge, ...patch.gUpdates.edges[edge.id]}))
        }
        patchedGraph.edges = edges.concat(Object.values(patch.gInserts.edges))
    }
    return patchedGraph
}

function graph(state, action) {
    switch(action.type) {
        case `${ActionType.GRAPHS_LIST_GET}_OK`:
            return { ...state, ...action.payload }

        case `${ActionType.GRAPH_GET}_PENDING`:
            if (state) {
                return { ...state, isSyncing: true }
            } else {
                return state
            }

        case `${ActionType.GRAPH_PATCH}_PENDING`:
        case `${ActionType.GRAPH_DELETE}_PENDING`:
            return { ...state, isSyncing: true }

        case `${ActionType.GRAPH_CREATE}_OK`:
        case `${ActionType.GRAPH_DUPLICATE}_OK`:
        case `${ActionType.GRAPH_IMPORT}_OK`:
        case `${ActionType.GRAPH_GET}_OK`:
            return { ...action.payload, isFetching: false }

        case `${ActionType.GRAPH_PATCH}_OK`:
            return { ..._patch(state, action.payload, action.info), isSyncing: false }

        case `${ActionType.GRAPH_GET}_FAIL`:
            return { ...state, isFetching: false }

        case `${ActionType.GRAPH_PATCH}_FAIL`:
        case `${ActionType.GRAPH_DELETE}_FAIL`:
            return { ...state, isSyncing: false }
    }
}

export function graphs(state = { isFetching: false }, action) {
    let newState
    switch(action.type) {
        case `${ActionType.GRAPHS_LIST_GET}_PENDING`:
            return { ...state, isFetching: true }

        case `${ActionType.GRAPHS_LIST_GET}_OK`:
            return action.payload.reduce((newState, info) => ({
                ...newState,
                [info.id]: graph(state[info.id], { type: action.type, payload: info })
            }), { ...state, isFetching: false })

        case `${ActionType.GRAPHS_LIST_GET}_FAIL`:
            return { ...state, isFetching: false }


        case `${ActionType.GRAPH_CREATE}_OK`:
        case `${ActionType.GRAPH_DUPLICATE}_OK`:
        case `${ActionType.GRAPH_IMPORT}_OK`:
        case `${ActionType.GRAPH_GET}_PENDING`:
        case `${ActionType.GRAPH_GET}_OK`:
        case `${ActionType.GRAPH_GET}_FAIL`:
        case `${ActionType.GRAPH_PATCH}_PENDING`:
        case `${ActionType.GRAPH_PATCH}_OK`:
        case `${ActionType.GRAPH_PATCH}_FAIL`:
        case `${ActionType.GRAPH_DELETE}_PENDING`:
        case `${ActionType.GRAPH_DELETE}_FAIL`:
            return {
                ...state,
                [action.payload.id]: graph(state[action.payload.id], action)
            }

        case `${ActionType.GRAPH_DELETE}_OK`:
            newState = { ...state }
            Reflect.deleteProperty(newState, action.payload.id)
            return newState

        case `${ActionType.LOGOUT}_OK`:
            return { isFetching: false }

        default:
            return state
    }
}

export function currentGraph(state = null, action) {
    switch (action.type) {
        case ActionType.SET_CURRENT_GRAPH:
            return action.payload

        case `${ActionType.LOGOUT}_OK`:
            return null

        default:
            return state
    }
}
