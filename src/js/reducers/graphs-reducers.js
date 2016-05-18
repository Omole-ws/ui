import _ from 'lodash'

import { ActionType } from '../actions'

function _patch(graph, patch) {
    const patchedGraph = {...graph, isFetching: false}
    if (patch.info) {
        patchedGraph.info = {...graph.info, ...patch.info}
    }
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

function graph(store = {isFetching: false, lastUpdated: null}, action) {

    // if (store.id !== action.payload.id) {
    //     return store
    // }
    switch(action.type) {
        case `${ActionType.FETCH_GRAPH}_PENDING`:
        case `${ActionType.PATCH_GRAPH}_PENDING`:
        case `${ActionType.REMOVE_GRAPH}_PENDING`:
            return {...store, isFetching: true}

        case `${ActionType.FETCH_GRAPH}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.PATCH_GRAPH}_OK`:
            return _patch(store, action.payload)
            // return {...store, ...action.payload, info: {...store.info, ...action.payload.info}, isFetching: false}

        case `${ActionType.REMOVE_GRAPH}_OK`:
            return null

        case `${ActionType.FETCH_GRAPH}_FAIL`:
            if (_.isEqual(store, {id: action.payload.id})) {return null}
        case `${ActionType.PATCH_GRAPH}_FAIL`:
        case `${ActionType.REMOVE_GRAPH}_FAIL`:
            return {...store, isFetching: false}
        
        default:
            return store
    }
}

export function graphs(store = {isFetching: false, list: []}, action) {

    switch(action.type) {
        case `${ActionType.FETCH_GRAPHS_LIST}_PENDING`:
            return {...store, isFetching: true}

        case `${ActionType.FETCH_GRAPHS_LIST}_OK`:
            return {
                list: action.payload.map(g => ({
                    ...store.list.find(gr => gr.id === g.id),
                    ...g
                })),
                isFetching: false
            }

        case `${ActionType.FETCH_GRAPHS_LIST}_FAIL`:
            return {...store, isFetching: false}



        case `${ActionType.POST_NEW_GRAPH}_OK`:
            return {
                isFetching: store.isFetching,
                list: store.list.concat(action.payload)
            }

        case `${ActionType.FETCH_GRAPH}_PENDING`:
            if (!store.list.some(g => g.id === action.payload.id)) {store.list.push({id: action.payload.id, info: {label: ''}})}
        case `${ActionType.FETCH_GRAPH}_OK`:
        case `${ActionType.FETCH_GRAPH}_FAIL`:
        case `${ActionType.PATCH_GRAPH}_PENDING`:
        case `${ActionType.PATCH_GRAPH}_OK`:
        case `${ActionType.PATCH_GRAPH}_FAIL`:
        case `${ActionType.REMOVE_GRAPH}_PENDING`:
        case `${ActionType.REMOVE_GRAPH}_OK`:
        case `${ActionType.REMOVE_GRAPH}_FAIL`:
            return {
                isFetching: store.isFetching,
                list: store.list.map(g => g.id === action.payload.id ? graph(g, action) : g).filter(g => g !== null)
            }

        case `${ActionType.DUPLICATE_GRAPH}_OK`:
            return {
                isFetching: store.isFetching,
                list: store.list.concat(action.payload)
            }

        default:
            return store
    }
}

export function currentGraph(store = null, action) {
    if (action.type === ActionType.SET_CURRENT_GRAPH) {
        return action.payload
    } else {
        return store
    }
}
