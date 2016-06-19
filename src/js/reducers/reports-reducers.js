import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function definitionsFetching(state = true, action) {
    switch (action.type) {
        case `${ActionType.REPORT_DEF_GET}_PENDING`:
            return true
        case `${ActionType.REPORT_DEF_GET}_OK`:
        case `${ActionType.REPORT_DEF_GET}_FAIL`:
            return false

        case `${ActionType.LOGOUT}_OK`:
            return true

        default:
            return state
    }
}

function definitionsList(state = {}, action) {
    switch (action.type) {
        case `${ActionType.REPORT_DEF_GET}_OK`:
            return action.payload.reduce((obj, val) => {
                obj[val.name] = val
                return obj
            }, {})

        case `${ActionType.LOGOUT}_OK`:
            return {}

        default:
            return state
    }
}

export const reports = combineReducers({definitions: definitionsList, isFetching: definitionsFetching})


// export const algos = combineReducers({definitions})
