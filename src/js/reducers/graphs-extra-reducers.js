import _ from 'lodash'
import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function vaItem(store, action) {
    switch (action.type) {
        case `${ActionType.FETCH_GVA}_PENDING`:
        case `${ActionType.UPDATE_GVA}_PENDING`:
        case `${ActionType.REMOVE_GVA}_PENDING`:
            return store ? {...store, isFetching: true} : null

        case `${ActionType.POST_NEW_GVA}_OK`:
            return {...action.payload, isFetching: false}
        case `${ActionType.FETCH_GVA}_OK`:
            return {...action.payload, isFetching: false}
        case `${ActionType.UPDATE_GVA}_OK`:
            return {...action.payload, isFetching: false}
        case `${ActionType.REMOVE_GVA}_OK`:
            return null
            
        case `${ActionType.FETCH_GVA}_FAIL`:
            let newStore = store ? {...store, isFetching: false} : null
            newStore = newStore === null && action.error.http === 404 ? {positions: null, isFetching: false} : null
            return newStore
        case `${ActionType.UPDATE_GVA}_FAIL`:
            return {...store, isFetching: false}
        case `${ActionType.REMOVE_GVA}_FAIL`:
            return {...store, isFetching: false}
    }
}

function visualAttributes (store = {}, action) {
    // switch (action.type) {
        // case `${ActionType.POST_NEW_GVA}_PENDING`:
            // return {[action.payload.gid]: store ? {...store, isFetching: true} : {isNew: true, isFetching: true}}
    //     case `${ActionType.FETCH_GVA}_PENDING`:
    //         if (store[action.payload.gid]) {

    //         }
    //     case `${ActionType.UPDATE_GVA}_PENDING`:
    //     case `${ActionType.REMOVE_GVA}_PENDING`:
    //         return {[action.payload.gid]: store ? {...store, isFetching: true} : {isNew: true, isFetching: true}}

    //     case `${ActionType.POST_NEW_GVA}_OK`:
    //         return {[action.payload.gid]: {...store,}}
    //     case `${ActionType.FETCH_GVA}_OK`:
    //     case `${ActionType.UPDATE_GVA}_OK`:
    //     case `${ActionType.REMOVE_GVA}_OK`:

    //     default:
    //         return store
    // }
    if (action.type.startsWith(ActionType.POST_NEW_GVA) ||
        action.type.startsWith(ActionType.FETCH_GVA) ||
        action.type.startsWith(ActionType.UPDATE_GVA) ||
        action.type.startsWith(ActionType.REMOVE_GVA)) {
        return _.omitBy({...store, [action.payload.gid]: vaItem(store[action.payload.gid], action)}, v => v === null)
        // const item = vaItem(store[action.payload.gid], action)
        // if (item) {
        //     return {...store, [action.payload.gid]: item}
        // } else if (item === undefined) {
        //     delete store[action.payload.gid]
        //     return store
        // }
    } else {
        return store
    }
}

export const graphsExtra = combineReducers({visualAttributes})
