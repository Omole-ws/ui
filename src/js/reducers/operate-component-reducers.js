import { combineReducers } from 'redux'

import { ActionType, Mode, DeskMode } from '../actions'


function onScreen(store = false, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return true

        case ActionType.NODE_CREATE:
        case ActionType.NODE_DIALOG_CLOSE:
            return false
            
        default:
            return store
    }
}

function node(store = null, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return action.payload.node

        case ActionType.NODE_DIALOG_CLOSE:
            return null

        default:
            return store
    }
}

function position(store = {x: 0, y: 0}, action) {
    switch (action.type) {
        case ActionType.NODE_DIALOG:
            return action.payload.position || null

        case ActionType.NODE_DIALOG_CLOSE:
            return null
        
        default:
            return store
    }
}

const nodeEditor = combineReducers({onScreen, node, position})

function deskMode(store = DeskMode.BASIC, action) {
    switch (action.type) {
        case ActionType.SET_DESK_MODE:
            return action.payload

        case ActionType.SET_MODE:
            return action.payload === Mode.OPERATE ? DeskMode.BASIC : store

        default:
            return store
    }
}

export const operating = combineReducers({nodeEditor, deskMode})