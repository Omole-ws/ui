import { ActionType } from '../actions'
import { combineReducers } from 'redux'

function lang(state = 'en', action) {
    switch (action.type) {
        case ActionType.LANG_SET:
            return action.payload

        default:
            return state
    }
}

function disclaimer(state = { value: 'Be happy', ts: '', isFetching: false }, action ) {
    switch (action.type) {
        case `${ActionType.DISCLAIMER_GET}_PENDING`:
            return { ...state, isFetching: true }

        case `${ActionType.DISCLAIMER_GET}_FAIL`:
            return { ...state, isFetching: false }

        case `${ActionType.DISCLAIMER_GET}_OK`:
            return { value: action.payload.value, ts: action.payload.ts, isFetching: false }

        default:
            return state

    }
}

export const globall = combineReducers({lang, disclaimer})
