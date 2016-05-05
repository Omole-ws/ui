import { ActionType } from '../actions'
    
export function nodeCreate(gid, node) {

    return {
        type: ActionType.NODE_CREATE,
        payload: {gid, node}
    }
}

export function nodePositionChange(gid, nid, position) {
    return {
        type: ActionType.NODE_POSITION_CHANGE,
        payload: {gid, nid, position}
    }
}

export function nodeTypeChange(gid, nid, type) {
    return {
        type: ActionType.NODE_TYPE_CHANGE,
        payload: {gid, nid, type}
    }
}
