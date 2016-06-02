import _ from 'lodash'

import { ActionType } from '../actions'

function _patch(graph, patch) {
    const patchedGraph = {...graph, isFetching: false}
    patchedGraph.label = patch.label || patchedGraph.label
    patchedGraph.comment = patch.comment || patchedGraph.comment
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

function graph(state = {isFetching: false, lastUpdated: null}, action) {

    // if (state.id !== action.payload.id) {
    //     return state
    // }
    switch(action.type) {
        case `${ActionType.GRAPH_GET}_PENDING`:
        case `${ActionType.GRAPH_PATCH}_PENDING`:
        case `${ActionType.GRAPH_DELETE}_PENDING`:
            return {...state, isFetching: true}

        case `${ActionType.GRAPH_GET}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.GRAPH_PATCH}_OK`:
            return _patch(state, action.payload)

        case `${ActionType.GRAPH_DELETE}_OK`:
            return null

        case `${ActionType.GRAPH_GET}_FAIL`:
            if (_.isEqual(state, {id: action.payload.id})) {return null}
            // break is omitted intentionally
        case `${ActionType.GRAPH_PATCH}_FAIL`:
        case `${ActionType.GRAPH_DELETE}_FAIL`:
            return {...state, isFetching: false}

        default:
            return state
    }
}

export function graphs(state = {isFetching: false, list: []}, action) {

    switch(action.type) {
        case `${ActionType.GRAPHS_LIST_GET}_PENDING`:
            return {...state, isFetching: true}

        case `${ActionType.GRAPHS_LIST_GET}_OK`:
            return {
                list: action.payload.map(g => ({
                    ...state.list.find(gr => gr.id === g.id),
                    ...g
                })),
                isFetching: false
            }

        case `${ActionType.GRAPHS_LIST_GET}_FAIL`:
            return {...state, isFetching: false}



        case `${ActionType.GRAPH_POST}_OK`:
            return {
                isFetching: state.isFetching,
                list: state.list.concat(action.payload)
            }

        case `${ActionType.GRAPH_GET}_PENDING`:
            if (!state.list.some(g => g.id === action.payload.id)) {
                state.list.push({ id: action.payload.id, label: '' })
            }
            // break is omitted intentionally
        case `${ActionType.GRAPH_GET}_OK`:
        case `${ActionType.GRAPH_GET}_FAIL`:
        case `${ActionType.GRAPH_PATCH}_PENDING`:
        case `${ActionType.GRAPH_PATCH}_OK`:
        case `${ActionType.GRAPH_PATCH}_FAIL`:
        case `${ActionType.GRAPH_DELETE}_PENDING`:
        case `${ActionType.GRAPH_DELETE}_OK`:
        case `${ActionType.GRAPH_DELETE}_FAIL`:
            return {
                isFetching: state.isFetching,
                list: state.list.map(g => g.id === action.payload.id ? graph(g, action) : g).filter(g => g !== null)
            }

        case `${ActionType.GRAPH_DUPLICATE}_OK`:
            return {
                isFetching: state.isFetching,
                list: state.list.concat(action.payload)
            }

        default:
            return state
    }
}

export function currentGraph(state = null, action) {
    if (action.type === ActionType.SET_CURRENT_GRAPH) {
        return action.payload
    } else {
        return state
    }
}
