import { ActionType } from '../actions'

export function genError(state = null, action) {
    switch (action.type) {
        case `${ActionType.TASK_CREATE}_FAIL`:
        case `${ActionType.TASK_GET}_FAIL`:
            return action.error.message

        case ActionType.DROP_GENERROR:
            return null

        default:
            return state

    }
}
