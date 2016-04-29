import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function csrf(store = null, action) {
    switch(action.type) {
        case ActionType.CSRF:
            return action.payload

        case `${ActionType.LOGOUT}_OK`:
            return null

        default:
            return store
    }
}

function account(store = {isFetching: false, name: null, roles: []}, action) {
    switch(action.type) {
        case `${ActionType.LOGIN}_PENDING`:
        case `${ActionType.FETCH_SESSION_DETAILS}_PENDING`:
            return {...store, isFetching: true}

        case `${ActionType.LOGIN}_OK`:
        case `${ActionType.FETCH_SESSION_DETAILS}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.LOGIN}_FAIL`:
        case `${ActionType.FETCH_SESSION_DETAILS}_FAIL`:
            return {...store, isFetching: false}

        case `${ActionType.LOGOUT}_OK`:
            return {isFetching: false, name: null, roles: []}

        default:
            return store
    }
}

function loginError(store = null, action) {
    switch(action.type) {
        case `${ActionType.LOGIN}_PENDING`:
        case `${ActionType.LOGIN}_OK`:
        case ActionType.CLEAR_LOGIN_ERROR:
            return null

        case `${ActionType.LOGIN}_FAIL`:
            return action.error.message

        default:
            return store
    }
}

export const session = combineReducers({csrf, account, loginError})
