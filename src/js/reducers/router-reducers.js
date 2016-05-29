import { ActionType, Mode } from '../actions'


export function router(state = { path: '#!/', prevPath: '#!/' }, action) {
    switch (action.type) {
        case ActionType.ROUTE_CHANGED:
            return {
                ...state,
                path: action.payload,
                prevPath: state.path === '/login' || state.path === '/registration' ? '/' : state.path
            }

        default:
            return state
    }
}

export function mode(state = Mode.LIST, action) {
    switch (action.type) {
        case ActionType.MODE_SET:
            return action.payload

        default:
            return state
    }
}
