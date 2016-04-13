import page from 'page'

import { graphsActionType as ActionType } from './action-types'
import * as Action  from './session-actions'

// import { graphs } from '../../utils/resources'

const root = '/app/r/graphs'

export const fetchGraphsList = () => {

    return (dispatch, getState) => {
        dispatch({type: `${ActionType.FETCH_GRAPHS_LIST}_PENDING`})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(root, {
            credentials: 'same-origin',
            headers
        })
        .then((response) => {
            if(response.status !== 200) {
                if (response.status === 403) {
                    new Promise(() => page.redirect('#!/login'))
                }
                return Promise.reject(response.statusText)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }
            return response.json()
        })
        .then((data) => dispatch({
            type: `${ActionType.FETCH_GRAPHS_LIST}_OK`,
            payload: data
        }))
        .catch((err) => {
            dispatch({
                type: `${ActionType.FETCH_GRAPHS_LIST}_FAIL`,
                payload: {err},
                error: true
            })
        })
    }
}

export const fetchGraph = (gid) => {
    return (dispatch, getState) => {
        dispatch({type: `${ActionType.FETCH_GRAPH}_PENDING`, payload: {id: gid}})
        const headers = new Headers({'x-xsrf-token': getState().session.csrf})
        fetch(`${root}/${gid}`, {
            credentials: 'same-origin',
            headers
        })
        .then(response => {
            if(response.status !== 200) {
                if (response.status === 403) {
                    new Promise(() => page.redirect('#!/login'))
                }
                return Promise.reject(response.statusText)
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
        .catch((err) => {
            dispatch({
                type: `${ActionType.FETCH_GRAPH}_FAIL`,
                payload: {id: gid, err},
                error: true
            })
        })
      
    }
}

export const setCurrentGraph = gid => ({
    type: ActionType.SET_CURRENT_GRAPH,
    payload: gid
})