import page from 'page'
import _ from 'lodash'

import { graphsActionType as ActionType } from './action-types'
import * as Action  from './session-actions'
import { Mode } from '../actions'
import { createFetchError } from './helpers'

// import { graphs } from '../../utils/resources'

const root = '/app/r/graphs'

export function setCurrentGraph(gid) {

    return {
        type: ActionType.SET_CURRENT_GRAPH,
        payload: gid
    }
}

export function fetchGraphsList() {

    return function(dispatch, getState) {
        dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_PENDING`})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(root, {
            credentials: 'same-origin',
            headers
        })
        .then((response) => {
            if(!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            return response.json()
        })
        .then(data => dispatch({
            type: `${ActionType.FETCH_GRAPHS_LIST}_OK`,
            payload: data
        }))
        .catch(error => dispatch({
            type: `${ActionType.FETCH_GRAPHS_LIST}_FAIL`,
            payload: {error}
        }))
    }
}

export function fetchGraph(graph) {
    return function(dispatch, getState) {
        dispatch({type: `${ActionType.FETCH_GRAPH}_PENDING`, payload: graph})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(`${root}/${graph.id}`, {
            credentials: 'same-origin',
            headers
        })
        .then(response => {
            if(!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            return response.json()
        })
        .then(data => setTimeout(() => dispatch({
            type: `${ActionType.FETCH_GRAPH}_OK`,
            payload: data
        }), 1000))
        .catch(error => dispatch({
            type: `${ActionType.FETCH_GRAPH}_FAIL`,
            payload: {error, ...graph}
        }))
      
    }
}

export function postNewGraph(graph) {
    return function(dispatch, getState) {
        dispatch({type: `${ActionType.POST_NEW_GRAPH}_PENDING`, payload: graph})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf, 'content-type': 'application/json'})
        fetch(root, {
            credentials: 'same-origin',
            headers,
            method: 'post',
            body: JSON.stringify(graph)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            return response.json()
        })
        .then(data => dispatch({
            type: `${ActionType.POST_NEW_GRAPH}_OK`,
            payload: data
        }))
        .catch(error => dispatch({
            type: `${ActionType.POST_NEW_GRAPH}_FAIL`,
            payload: {error}
        }))
    }
}

export function patchGraph(graph) {
    return function(dispatch, getState) {
        const serial = _.uniqueId()
        dispatch({type: `${ActionType.PATCH_GRAPH}_PENDING`, payload: graph, serial})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf, 'content-type': 'application/json'})
        fetch(`${root}/${graph.id}`, {
            credentials: 'same-origin',
            headers,
            method: 'PATCH',
            body: JSON.stringify(graph)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            setTimeout(() => dispatch({
                type: `${ActionType.PATCH_GRAPH}_OK`,
                payload: graph,
                serial
            }), 1000)
        })
        .catch(error => dispatch({
            type: `${ActionType.PATCH_GRAPH}_FAIL`,
            payload: {error, ...graph},
            serial
        }))
    } 
} 

export function removeGraph(graph) {
    return function(dispatch, getState) {
        dispatch({type: `${ActionType.REMOVE_GRAPH}_PENDING`, payload: graph})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(`${root}/${graph.id}`, {
            credentials: 'same-origin',
            headers,
            method: 'delete'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            dispatch({
                type: `${ActionType.REMOVE_GRAPH}_OK`,
                payload: graph
            })
        })
        .catch(error => dispatch({
            type: `${ActionType.REMOVE_GRAPH}_FAIL`,
            payload: {error, ...graph}
        }))
    }
}

export function duplicateGraph(graph) {
    return function(dispatch, getState) {
        dispatch({type: `${ActionType.DUPLICATE_GRAPH}_PENDING`, payload: graph})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(`${root}/${graph.id}/duplicate`, {
            credentials: 'same-origin',
            headers,
            method: 'post'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403 && getState().mode !== Mode.LOGIN) {
                    new Promise(() => page('#!/login'))
                }
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            return response.json()
        })
        .then(data => dispatch({
            type: `${ActionType.DUPLICATE_GRAPH}_OK`,
            payload: data
        }))
        .catch(error => dispatch({
            type: `${ActionType.DUPLICATE_GRAPH}_FAIL`,
            payload: {error}
        }))
    }
}

