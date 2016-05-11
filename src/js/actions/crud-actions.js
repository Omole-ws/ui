import { ActionType } from '../actions'
    
export function nodeCreate(node) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_CREATE,
            payload: {gid: getState().currentGraph, node}
        })
    }
}

export function nodePositionChange(nid, position) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_POSITION_CHANGE,
            payload: {gid: getState().currentGraph, nid, position}
        })
    }
}

export function nodeTypeChange(nid, type) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_TYPE_CHANGE,
            payload: {gid: getState().currentGraph, nid, type}
        })
    }
}

export function edgeCreate(edge) {
    return function(dispatch, getState) {
        dispatch({
            type: ActionType.EDGE_CREATE,
            payload: {gid: getState().currentGraph, edge}
        })
    }
}

export function gvaZoom(zoom) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.GVA_ZOOM,
            payload: {gid: getState().currentGraph, zoom}
        })
    }
}

export function gvaPan(pan) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.GVA_PAN,
            payload: {gid: getState().currentGraph, pan}
        })
    }
}
