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
        dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_PENDING`})
        dispatch(netAction({
            url: DataURI,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_OK`, payload}),
            onError: error  => dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_FAIL`, error})
        }))
    }
}

export function postNewGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.POST_NEW_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: DataURI,
            method: 'post',
            body: graph,
            onSuccess: id => dispatch({type: `${ActionType.POST_NEW_GRAPH}_OK`, payload: {...graph, id}}),
            onError: error => dispatch({type: `${ActionType.POST_NEW_GRAPH}_FAIL`, payload: graph, error})
        }))
    }
}

export function fetchGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.FETCH_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GRAPH}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_GRAPH}_FAIL`, payload: graph, error })
        }))
    }
}

export function removeGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.REMOVE_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}`,
            method: 'delete',
            onSuccess: () => dispatch({type: `${ActionType.REMOVE_GRAPH}_OK`, payload: graph}),
            onError: error => dispatch({type: `${ActionType.REMOVE_GRAPH}_FAIL`, payload: graph, error})
        }))
    }
}

export function patchGraph(patch) {
    return function(dispatch) {
        dispatch({type: `${ActionType.PATCH_GRAPH}_PENDING`, payload: patch})
        dispatch(netAction({
            url: `${DataURI}/${patch.id}`,
            method: 'patch',
            body: patch,
            onSuccess: () => dispatch({type: `${ActionType.PATCH_GRAPH}_OK`, payload: patch}),
            onError: error => dispatch({type: `${ActionType.PATCH_GRAPH}_FAIL`, payload: patch, error})
        }))
    }
}

export function duplicateGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.DUPLICATE_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${DataURI}/${graph.id}/duplicate`,
            method: 'post',
            onSuccess: payload => dispatch({type: `${ActionType.DUPLICATE_GRAPH}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.DUPLICATE_GRAPH}_FAIL`, payload: graph, error})
        }))
    }
}
