import { combineReducers } from 'redux'

import { ActionType, Mode, DeskMode, AlgoInputType } from '../actions'


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

export const operating = combineReducers({nodeEditor, edgeEditor, deskMode})
