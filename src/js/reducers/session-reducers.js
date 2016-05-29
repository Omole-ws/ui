import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function csrf(state = null, action) {
    switch(action.type) {
        case ActionType.CSRF:
            return action.payload

        case `${ActionType.LOGOUT}_OK`:
            return null

        default:
            return state
    }
}

function account(state = {isFetching: false, name: null, roles: []}, action) {
    switch(action.type) {
        case `${ActionType.LOGIN}_PENDING`:
        case `${ActionType.SESSION_DETAILS_GET}_PENDING`:
            return {...state, isFetching: true}

        case `${ActionType.LOGIN}_OK`:
        case `${ActionType.SESSION_DETAILS_GET}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.LOGIN}_FAIL`:
        case `${ActionType.SESSION_DETAILS_GET}_FAIL`:
            return {...state, isFetching: false}

        case `${ActionType.LOGOUT}_OK`:
            return {isFetching: false, name: null, roles: []}

        default:
            return state
    }
}

function loginError(state = null, action) {
    switch(action.type) {
        case `${ActionType.LOGIN}_PENDING`:
        case `${ActionType.LOGIN}_OK`:
        case ActionType.CLEAR_LOGIN_ERROR:
            return null

        case `${ActionType.LOGIN}_FAIL`:
            return action.error.message

        default:
            return state
    }
}

export const session = combineReducers({csrf, account, loginError})
