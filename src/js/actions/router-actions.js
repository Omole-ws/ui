import { ActionType, Action } from '../actions'

export function routeChanged(path) {
    return {
        type: ActionType.ROUTE_CHANGED,
        payload: path
    }
}

export function setMode(mode) {
    return {
        type: ActionType.MODE_SET,
        payload: mode
    }
}
