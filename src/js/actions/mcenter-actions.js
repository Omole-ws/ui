import { ActionType } from '../actions'
// import * as Action  from './session-actions'
// import { createFetchError } from './helpers'

export function showMessageCenter() {
    return {type: ActionType.MSG_CENTER_SHOW}
}

export function hideMessageCenter() {
    return {type: ActionType.MSG_CENTER_HIDE} 
}
