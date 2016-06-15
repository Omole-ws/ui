import { ActionType } from '../actions'
    
export function nodeCreate(node) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_CREATE,
            payload: {gid: getState().currentGraph, nid: node.id, node}
        })
    }
}

export function nodeUpdate(nid, update) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_UPDATE,
            payload: {gid: getState().currentGraph, nid, update}
        }) 
    }
}

export function nodeDelete(node) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.NODE_DELETE,
            payload: {gid: getState().currentGraph, nid: node.id(), node}
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
            payload: {gid: getState().currentGraph, eid: edge.id, edge}
        })
    }
}

export function edgeUpdate(eid, update) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.EDGE_UPDATE,
            payload: {gid: getState().currentGraph, eid, update}
        }) 
    }
}

export function edgeDelete(edge) {
    return function (dispatch, getState) {
        dispatch({
            type: ActionType.EDGE_DELETE,
            payload: {gid: getState().currentGraph, eid: edge.id(), edge}
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
