import { ActionType, DataURI } from '../actions'
import { netAction } from '../helpers'

export function setCurrentGraph(gid) {
    return {
        type: ActionType.SET_CURRENT_GRAPH,
        payload: gid
    }
}

export function fetchGraphsList() {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPHS_LIST_GET}_PENDING`})
        dispatch(netAction({
            url: DataURI,
            onSuccess: payload => dispatch({type: `${ActionType.GRAPHS_LIST_GET}_OK`, payload}),
            onError: error  => dispatch({type: `${ActionType.GRAPHS_LIST_GET}_FAIL`, error})
        }))
    }
}

export function postNewGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_POST}_PENDING`, payload: graph})
        dispatch(netAction({
            url: DataURI,
            method: 'post',
            body: graph,
            onSuccess: id => dispatch({type: `${ActionType.GRAPH_POST}_OK`, payload: {...graph, id}}),
            onError: error => dispatch({type: `${ActionType.GRAPH_POST}_FAIL`, payload: graph, error})
        }))
    }
}

export function fetchGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_GET}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.GRAPH_GET}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.GRAPH_GET}_FAIL`, payload: graph, error })
        }))
    }
}

export function removeGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_DELETE}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}`,
            method: 'delete',
            onSuccess: () => dispatch({type: `${ActionType.GRAPH_DELETE}_OK`, payload: graph}),
            onError: error => dispatch({type: `${ActionType.GRAPH_DELETE}_FAIL`, payload: graph, error})
        }))
    }
}

export function patchGraph(patch) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_PATCH}_PENDING`, payload: patch})
        dispatch(netAction({
            url: `${DataURI}/${patch.id}`,
            method: 'patch',
            body: patch,
            onSuccess: () => dispatch({type: `${ActionType.GRAPH_PATCH}_OK`, payload: patch}),
            onError: error => dispatch({type: `${ActionType.GRAPH_PATCH}_FAIL`, payload: patch, error})
        }))
    }
}

export function duplicateGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_DUPLICATE}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}/duplicate`,
            method: 'post',
            onSuccess: payload => dispatch({type: `${ActionType.GRAPH_DUPLICATE}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.GRAPH_DUPLICATE}_FAIL`, payload: graph, error})
        }))
    }
}
