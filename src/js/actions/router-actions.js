import { routerActionType as ActionType } from './action-types'

export function routeChanged(path) {
    return {
        type: ActionType.ROUTE_CHANGED,
        payload: path
    }
}

export function setMode(mode) {
    return {
        type: ActionType.SET_MODE,
        payload: mode
    }
}
