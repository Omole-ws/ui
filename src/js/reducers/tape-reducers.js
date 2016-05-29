import _ from 'lodash'

import { ActionType } from '../actions'


function record(state = [], action) {
    if (action.type === `${ActionType.GRAPH_PATCH}_OK`) {
        return state.slice(action.payload.length)
    } else {
        return [...state, action]
    }
}

export function tape(state = {}, action) {
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
        action.type === `${ActionType.GRAPH_PATCH}_OK`) {
        // return _.omitBy({...state, [action.payload.gid]: [...state[action.payload.gid], action]}, v => v === null)
        const gid = action.payload.gid || action.payload.id
        return _.omitBy({...state, [gid]: record(state[gid], action)}, v => v === null)
    } else {
        return state
    }
}

// export const local = combineReducers({nodes})
