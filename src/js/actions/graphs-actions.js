import { ActionType } from '../actions'
import { netAction } from '../helpers'


const resourceURL = '/app/r/graphs'

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
            url: resourceURL,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_OK`, payload}),
            onError: error  => dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_FAIL`, error})
        }))
    }
}

export function postNewGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.POST_NEW_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: resourceURL,
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
            url: `${resourceURL}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GRAPH}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_GRAPH}_FAIL`, payload: graph, error })
        }))
    }
}

export function removeGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.REMOVE_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${resourceURL}/${graph.id}`,
            method: 'delete',
            onSuccess: () => dispatch({type: `${ActionType.REMOVE_GRAPH}_OK`, payload: graph}),
            onError: error => dispatch({type: `${ActionType.REMOVE_GRAPH}_FAIL`, payload: graph, error})
        }))
    }
}

export function patchGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.PATCH_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${resourceURL}/${graph.id}`,
            method: 'patch',
            body: graph,
            onSuccess: () => dispatch({type: `${ActionType.PATCH_GRAPH}_OK`, payload: graph}),
            onError: error => dispatch({type: `${ActionType.PATCH_GRAPH}_FAIL`, payload: graph, error})
        }))
    } 
} 

export function duplicateGraph(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.DUPLICATE_GRAPH}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${resourceURL}/${graph.id}/duplicate`,
            method: 'post',
            onSuccess: payload => dispatch({type: `${ActionType.DUPLICATE_GRAPH}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.DUPLICATE_GRAPH}_FAIL`, payload: graph, error})
        }))
    }
}
