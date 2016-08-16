import { ActionType, TaskResultsType } from '../actions'

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

export function showResults(tid) {
    return function (dispatch, getState) {
        const task = getState().tasks[tid]
        const algo = getState().algos.definitions[task.name]
        switch (algo.outputParam) {
            case TaskResultsType.TR_NODE_GROUP:
                dispatch({ type: ActionType.HIDE_GROUPS })
                dispatch({ type: ActionType.SHOW_GROUPS, payload: task })
                break

            case TaskResultsType.TR_PATHS:
                dispatch({ type: ActionType.HIDE_PATHS })
                dispatch({ type: ActionType.SHOW_PATHS, payload: task })
                break
        }
    }
}

export function hideResults(tid) {
    if (!tid) {
        return { type: ActionType.HIDE_RESULTS }
    }
    return function (dispatch, getState) {
        const task = getState().tasks[tid]
        const algo = getState().algos.definitions[task.name]
        switch (algo.outputParam) {
            case TaskResultsType.TR_NODE_GROUP:
                dispatch({ type: ActionType.HIDE_GROUPS, payload: task.tid })
                break

            case TaskResultsType.TR_PATHS:
                dispatch({ type: ActionType.HIDE_PATHS, payload: task.tid })
                break
        }
    }
}

export function highlightPath(pn) {
    return { type: ActionType.HIGHLIGHT_PATH, payload: pn }
}
