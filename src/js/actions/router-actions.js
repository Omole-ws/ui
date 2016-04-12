import { routerActionType as ActionType } from './action-types'

export const routeChanged = (path) => {
    return {
        type: ActionType.ROUTE_CHANGED,
        payload: path
    }
}

export const setMode = (mode) => {
    return {
        type: ActionType.SET_MODE,
        payload: mode
    }
}
