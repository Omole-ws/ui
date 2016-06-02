import { ActionType } from '../actions'

export function setDeskMode(mode) {
    return { type: ActionType.SET_DESK_MODE, payload: mode }
}

export function nodeDialog(node, position) {
    return { type: ActionType.NODE_DIALOG, payload: { node, position } }
}

export function nodeDialogClose() {
    return { type: ActionType.NODE_DIALOG_CLOSE }
}

export function edgeDialog(edge) {
    return { type: ActionType.EDGE_DIALOG, payload: { edge } }
}

export function edgeDialogClose() {
    return { type: ActionType.EDGE_DIALOG_CLOSE }
}

export function selectFrom({ id, name }) {
    return { type: ActionType.SELECT_FROM, payload: { id, name } }
}

export function selectTo({ id, name }) {
    return { type: ActionType.SELECT_TO, payload: { id, name } }
}

export function toggleResultBoard() {
    return { type: ActionType.RB_TOGGLE }
}
