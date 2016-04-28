import { ActionType } from '../actions'
import { netAction } from '../helpers'


const resourceURL = '/app/r/graphs'

export function postNewGraphExtra(extra) {
    return dispatch => {
        dispatch({type: `${ActionType.POST_NEW_GRAPH_EXTRA}_PENDING`, payload: extra})
        dispatch(netAction({
            url: resourceURL,
            method: 'post',
            body: extra,
            onSuccess: payload => dispatch({type: `${ActionType.POST_NEW_GRAPH_EXTRA}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.POST_NEW_GRAPH_EXTRA}_FAIL`, payload: extra, error})
        }))
    }
}

export function fetchGraphExtra(graph) {
    return dispatch => {
        dispatch({type: `${ActionType.FETCH_GRAPH_EXTRA}_PENDING`, payload: graph})
        dispatch(netAction({
            url: `${resourceURL}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GRAPH_EXTRA}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_GRAPH_EXTRA}_FAIL`, payload: graph, error})
        }))
    }
}

export function updateGraphExtra(extra) {
    return dispatch => {
        dispatch({type: `${ActionType.UPDATE_GRAPH_EXTRA}_PENDING`, payload: extra})
        dispatch(netAction({
            url: `${resourceURL}/${extra.id}`,
            method: 'put',
            body: extra,
            onSuccess: () => dispatch({type: `${ActionType.UPDATE_GRAPH_EXTRA}_OK`, payload: extra}),
            onError: error => dispatch({type: `${ActionType.UPDATE_GRAPH_EXTRA}_FAIL`, payload: extra, error})
        }))
    }
}

export function removeGraphExtra(extra) {
    return dispatch => {
        dispatch({type: `${ActionType.REMOVE_GRAPH_EXTRA}_PENDING`, payload: extra})
        dispatch(netAction({
            url: `${resourceURL}/${extra.id}`,
            method: 'delete',
            onSuccess: () => dispatch({type: `${ActionType.REMOVE_GRAPH_EXTRA}_OK`, payload: extra}),
            onError: error => dispatch({type: `${ActionType.REMOVE_GRAPH_EXTRA}_FAIL`, payload: extra, error})
        }))
    }
}