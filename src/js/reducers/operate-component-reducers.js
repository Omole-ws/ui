import { combineReducers } from 'redux'

import { ActionType, Mode, DeskMode, AlgoInputType, TaskStatus } from '../actions'


function nodeEditorOnScreen(state = false, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return true

        case ActionType.NODE_DIALOG_CLOSE:
            return false

        default:
            return state
    }
}

function node(state = null, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return action.payload.node

        case ActionType.NODE_DIALOG_CLOSE:
            return null

        default:
            return state
    }
}

function position(state = {x: 0, y: 0}, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return action.payload.position || null

        case ActionType.NODE_DIALOG_CLOSE:
            return null

        default:
            return state
    }
}

const nodeEditor = combineReducers({onScreen: nodeEditorOnScreen, node, position})

function edgeEditorOnScreen(state = false, action) {
    switch (action.type) {
        case ActionType.EDGE_DIALOG:
            return true

        case ActionType.EDGE_DIALOG_CLOSE:
            return false

        default:
            return state
    }
}

function edge(state = null, action) {
    switch (action.type) {
        case ActionType.EDGE_DIALOG:
            return action.payload.edge

        case ActionType.EDGE_DIALOG_CLOSE:
            return null

        default:
            return state
    }
}

const edgeEditor = combineReducers({onScreen: edgeEditorOnScreen, edge})

function rbOnScreen(state = false, action) {
    switch (action.type) {
        case ActionType.RB_TOGGLE:
            return !state

        default:
            return state
    }
}

function hasNew(state = false, action) {
    switch (action.type) {
        case `${ActionType.TASK_CREATE}_OK`:
        case `${ActionType.TASK_GET}_OK`:
            return action.payload.status === TaskStatus.TS_COMPLETED

        case ActionType.RB_TOGGLE:
            return false

        default:
            return state
    }
}

function groupByType(state = false, action) {
    // TODO implement RB_GROUP_BY_TYPE reducer
    return state
}

function filter(state = null, action) {
    // TODO implement RB_FILTER reducer
    return state
}

const resultBoard = combineReducers({onScreen: rbOnScreen, hasNew, groupByType, filter})

function groups(state = null, action) {
    switch (action.type) {
        case ActionType.SHOW_GROUPS:
            return action.payload

        default:
            return state
    }
}

function paths(state = null, action) {
    switch (action.type) {
        case ActionType.SHOW_PATHS:
            return action.payload

        default:
            return state
    }
}

function deskMode(state = DeskMode.BASIC, action) {
    switch (action.type) {
        case ActionType.SET_DESK_MODE:
            return action.payload

        case ActionType.MODE_SET:
            return action.payload === Mode.OPERATE ? DeskMode.BASIC : state

        case ActionType.TASK_PREPARE:
            if (action.payload.inputParam === AlgoInputType.GLFT) {
                return DeskMode.SELECT_FROM_TO
            } else {
                return state
            }

        case `${ActionType.TASK_CREATE}_PENDING`:
        case ActionType.TASK_PREPARE_CANCEL:
            return DeskMode.BASIC

        default:
            return state
    }
}

export const operating = combineReducers({nodeEditor, edgeEditor, resultBoard, groups, paths, deskMode})
