import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function onScreen(store = false, action) {
    switch(action.type) {
        case ActionType.SHOW_MSG_CENTER:
            return true

        case ActionType.HIDE_MSG_CENTER:
            return false

        default:
            return store
    }
}


    // LOGOUT:                'LOGOUT',
    // FETCH_SESSION_DETAILS: 'FETCH_SESSION_DETAILS',
    // FETCH_GRAPHS_LIST: 'FETCH_GRAPHS_LIST',
    // FETCH_GRAPH:       'FETCH_GRAPH',
    // POST_NEW_GRAPH:    'POST_NEW_GRAPH',
    // REMOVE_GRAPH:      'REMOVE_GRAPH'

function messages(store = [], action) {
    switch(action.type) {
        case `${ActionType.PATCH_GRAPH}_PENDING`:
            return store.concat({
                type: 'info',
                msg: `Updating graph '${action.payload.info.label}'`,
                id: action.serial
            })

        case `${ActionType.PATCH_GRAPH}_OK`:
            return store.filter(m => m.id !== action.serial).concat({
                type: 'success',
                msg: `Graph '${action.payload.info.label}' has updated`
            })

        case `${ActionType.PATCH_GRAPH}_FAIL`:
            return store.filter(m => m.id !== action.serial).concat({
                type: 'error',
                msg: `Update of graph '${action.payload.info.label}' has failed. (${action.payload.error})`
            })

        default:
            return store
    }
}


export const mcenter = combineReducers({onScreen, messages})
