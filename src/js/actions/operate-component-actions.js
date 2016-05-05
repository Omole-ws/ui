import { ActionType } from '../actions'

export function setDeskMode(mode) {
    return {type: ActionType.SET_DESK_MODE, payload: mode} 
}

export function nodeDialog(node, position) {
    return {type: ActionType.NODE_DIALOG, payload: {node, position}}
}

export function nodeDialogClose() {
    return {type: ActionType.NODE_DIALOG_CLOSE}
}
