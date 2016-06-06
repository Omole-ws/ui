import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function onScreen(state = false, action) {
    switch(action.type) {
        case ActionType.MSG_CENTER_SHOW:
            return true

        case ActionType.MSG_CENTER_HIDE:
            return false

        case `${ActionType.LOGOUT}_OK`:
            return false

        default:
            return state
    }
}


    // LOGOUT:                'LOGOUT',
    // SESSION_DETAILS_GET: 'SESSION_DETAILS_GET',
    // GRAPHS_LIST_GET: 'GRAPHS_LIST_GET',
    // GRAPH_GET:       'GRAPH_GET',
    // GRAPH_POST:    'GRAPH_POST',
    // GRAPH_DELETE:      'GRAPH_DELETE'

function messages(state = [], action) {
    switch(action.type) {
        case `${ActionType.GRAPH_PATCH}_PENDING`:
            return state.concat({
                type: 'info',
                msg: `Updating graph '${action.payload.id}'`,
                id: action.serial
            })

        case `${ActionType.GRAPH_PATCH}_OK`:
            return state.filter(m => m.id !== action.serial).concat({
                type: 'success',
                msg: `Graph '${action.payload.id}' has updated`
            })

        case `${ActionType.GRAPH_PATCH}_FAIL`:
            return state.filter(m => m.id !== action.serial).concat({
                type: 'error',
                msg: `Update of graph '${action.payload.id}' has failed. (${action.payload.error})`
            })

        case `${ActionType.LOGOUT}_OK`:
            return []

        default:
            return state
    }
}


export const mcenter = combineReducers({onScreen, messages})
