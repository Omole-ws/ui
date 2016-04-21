import { messageCenterActionType as ActionType } from './action-types'
// import * as Action  from './session-actions'
// import { createFetchError } from './helpers'

export function showMessageCenter() {
    return {type: ActionType.SHOW_MSG_CENTER}
}

export function hideMessageCenter() {
    return {type: ActionType.HIDE_MSG_CENTER} 
}