import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function definitionsFetching(state = false, action) {
    switch (action.type) {
        case `${ActionType.ALGO_DEF_GET}_PENDING`:
            return true
        case `${ActionType.ALGO_DEF_GET}_OK`:
        case `${ActionType.ALGO_DEF_GET}_FAIL`:
            return false
        default:
            return state
    }
}

function definitionsList(state = null, action) {
    switch (action.type) {
        case `${ActionType.ALGO_DEF_GET}_OK`:
            return action.payload
        default:
            return state
    }
}

export const algos = combineReducers({definitions: definitionsList, isFetching: definitionsFetching})


// export const algos = combineReducers({definitions})
