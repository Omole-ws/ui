import _ from 'lodash'

import { ActionType } from '../actions'


function record(store = [], action) {
    if (action.type === `${ActionType.PATCH_GRAPH}_OK`) {
        return store.slice(action.payload.length)
    } else {
        return [...store, action] 
    }
}

export function tape(store = {}, action) {
    if (action.type === ActionType.NODE_CREATE ||
        action.type === ActionType.NODE_UPDATE ||
        action.type === ActionType.NODE_DELETE ||
        action.type === ActionType.NODE_POSITION_CHANGE ||
        action.type === ActionType.NODE_TYPE_CHANGE ||
        action.type === ActionType.EDGE_CREATE ||
        action.type === ActionType.EDGE_UPDATE ||
        action.type === ActionType.EDGE_DELETE ||
        action.type === ActionType.GVA_ZOOM ||
        action.type === ActionType.GVA_PAN ||
        action.type === `${ActionType.PATCH_GRAPH}_OK`) {
        // return _.omitBy({...store, [action.payload.gid]: [...store[action.payload.gid], action]}, v => v === null)
        const gid = action.payload.gid || action.payload.id
        return _.omitBy({...store, [gid]: record(store[gid], action)}, v => v === null)
    } else {
        return store
    }
}

// export const local = combineReducers({nodes})