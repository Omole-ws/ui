import _ from 'lodash'
import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function vaItem(state, action) {
    switch (action.type) {
        case `${ActionType.GVA_GET}_PENDING`:
            return state ? {...state, isFetching: true} : null

        case `${ActionType.GVA_GET}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.GVA_GET}_FAIL`:
            return {positions: null, ...state, isFetching: false}
    }
}

function visualAttributes (state = {}, action) {
    if(action.type.startsWith(ActionType.GVA_GET)) {
        return _.omitBy({...state, [action.payload.gid]: vaItem(state[action.payload.gid], action)}, v => v === null)
    } else if (action.type === `${ActionType.LOGOUT}_OK`) {
        return {}
    } else {
        return state
    }
}

export const graphsExtra = combineReducers({visualAttributes})
