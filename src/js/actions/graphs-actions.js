import { ActionType, DataURL } from '../actions'
import { netAction } from '../helpers'

export function setCurrentGraph(gid) {
    return {
        type: ActionType.SET_CURRENT_GRAPH,
        payload: gid
    }
}

export function getGraphList() {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPHS_LIST_GET}_PENDING`})
        netAction({
            url: DataURL,
            onSuccess: payload => dispatch({type: `${ActionType.GRAPHS_LIST_GET}_OK`, payload}),
            onError: error  => dispatch({type: `${ActionType.GRAPHS_LIST_GET}_FAIL`, error})
        })
    }
}

export function createGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_CREATE}_PENDING`, payload: graph})
        netAction({
            url: DataURL,
            method: 'post',
            body: graph,
            onSuccess: info => dispatch({type: `${ActionType.GRAPH_CREATE}_OK`, payload: { ...graph, ...info }}),
            onError: error => dispatch({type: `${ActionType.GRAPH_CREATE}_FAIL`, payload: graph, error})
        })
    }
}

export function getGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_GET}_PENDING`, payload: graph})
        netAction({
            url: `${DataURL}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.GRAPH_GET}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.GRAPH_GET}_FAIL`, payload: graph, error })
        })
    }
}

export function deleteGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_DELETE}_PENDING`, payload: graph})
        netAction({
            url: `${DataURL}/${graph.id}`,
            method: 'delete',
            onSuccess: () => dispatch({type: `${ActionType.GRAPH_DELETE}_OK`, payload: graph}),
            onError: error => dispatch({type: `${ActionType.GRAPH_DELETE}_FAIL`, payload: graph, error})
        })
    }
}

export function patchGraph(patch) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_PATCH}_PENDING`, payload: patch})
        netAction({
            url: `${DataURL}/${patch.id}`,
            method: 'patch',
            body: patch,
            onSuccess: info => dispatch({type: `${ActionType.GRAPH_PATCH}_OK`, payload: patch, info}),
            onError: error => dispatch({type: `${ActionType.GRAPH_PATCH}_FAIL`, payload: patch, error})
        })
    }
}

export function duplicateGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GRAPH_DUPLICATE}_PENDING`, payload: graph})
        netAction({
            url: `${DataURL}/${graph.id}/duplicate`,
            method: 'post',
            onSuccess: payload => dispatch({type: `${ActionType.GRAPH_DUPLICATE}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.GRAPH_DUPLICATE}_FAIL`, payload: graph, error})
        })
    }
}
