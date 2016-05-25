import _ from 'lodash'
import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function vaItem(store, action) {
    switch (action.type) {
        case `${ActionType.FETCH_GVA}_PENDING`:
            return store ? {...store, isFetching: true} : null

        case `${ActionType.FETCH_GVA}_OK`:
            return {...action.payload, isFetching: false}

        case `${ActionType.FETCH_GVA}_FAIL`:
            return {positions: null, ...store, isFetching: false}
    }
}

function visualAttributes (store = {}, action) {
    if(action.type.startsWith(ActionType.FETCH_GVA)) {
        return _.omitBy({...store, [action.payload.gid]: vaItem(store[action.payload.gid], action)}, v => v === null)
    } else {
        return store
    }
}

export const graphsExtra = combineReducers({visualAttributes})
