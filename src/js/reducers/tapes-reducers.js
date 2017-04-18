import _ from 'lodash'

import { ActionType } from '../actions'


function tape(state = [], action) {
    let newState = [...state]
    switch (action.type) {
        case `${ActionType.GRAPH_PATCH}_PENDING`:
            newState.isSyncing = true
            return newState

        case `${ActionType.GRAPH_PATCH}_OK`:
            newState = state.slice(action.payload.length)
            newState.isSyncing = false
            return newState

        case `${ActionType.GRAPH_PATCH}_FAIL`:
            newState.isSyncing = false
            return newState

        default:
            return [...state, action]

    }
}

export function tapes(state = {}, action) {
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
        action.type.startsWith(ActionType.GRAPH_PATCH)) {
        const gid = action.payload.gid || action.payload.id
        return _.omitBy({...state, [gid]: tape(state[gid], action)}, v => v === null || v.length === 0)
    } else if (action.type === `${ActionType.LOGOUT}_OK`) {
        return {}
    } else {
        return state
    }
}
