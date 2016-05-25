import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function definitionsFetching(store = false, action) {
    switch (action.type) {
        case `${ActionType.ALGO_FETCH_DEF}_PENDING`:
            return true
        case `${ActionType.ALGO_FETCH_DEF}_OK`:
        case `${ActionType.ALGO_FETCH_DEF}_FAIL`:
            return false
        default:
            return store
    }
}

function definitionsList(store = null, action) {
    switch (action.type) {
        case `${ActionType.ALGO_FETCH_DEF}_OK`:
            return action.payload
        default:
            return store
    }
}

export const algos = combineReducers({definitions: definitionsList, isFetching: definitionsFetching})


// export const algos = combineReducers({definitions})
