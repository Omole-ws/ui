import { ActionType, Mode } from '../actions'


export function router(store = { path: '#!/', prevPath: '#!/' }, action) {
    switch (action.type) {
        case ActionType.ROUTE_CHANGED:
            return {
                ...store,
                path: action.payload,
                prevPath: store.path === '/login' || store.path === '/registration' ? '/' : store.path
            }

        default:
            return store
    }
}

export function mode(store = Mode.LIST, action) {
    switch (action.type) {
        case ActionType.SET_MODE:
            return action.payload

        default:
            return store
    }
}
