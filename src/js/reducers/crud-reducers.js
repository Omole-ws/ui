import _ from 'lodash'

import { ActionType } from '../actions'


function record(store = [], action) {
    return [...store, action] 
}

export function tape(store = {}, action) {
    if (action.type === ActionType.NODE_CREATE ||
        action.type === ActionType.NODE_DELETE ||
        action.type === ActionType.NODE_POSITION_CHANGE ||
        action.type === ActionType.NODE_TYPE_CHANGE ||
        action.type === ActionType.EDGE_CREATE ||
        action.type === ActionType.EDGE_DELETE ||
        action.type === ActionType.GVA_ZOOM ||
        action.type === ActionType.GVA_PAN) {
        // return _.omitBy({...store, [action.payload.gid]: [...store[action.payload.gid], action]}, v => v === null)
        return _.omitBy({...store, [action.payload.gid]: record(store[action.payload.gid], action)}, v => v === null)
    } else {
        return store
    }
}

// export const local = combineReducers({nodes})