import { ActionType, Action } from '../actions'

export function routeChanged(path) {
    return function (dispatch, getState) {
        if (getState().mcenter.onScreen) {
            dispatch(Action.hideMessageCenter())
        }
        dispatch({type: ActionType.ROUTE_CHANGED, payload: path})
    }
}

export function setMode(mode) {
    return {
        type: ActionType.SET_MODE,
        payload: mode
    }
}
