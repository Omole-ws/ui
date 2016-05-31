import { combineReducers } from 'redux'

import { ActionType } from '../actions'

function onScreen(state = false, action) {
    switch (action.type) {
        case ActionType.TASK_PREPARE:
            return true

        case ActionType.TASK_PREPARE_CANCEL:
        case `${ActionType.TASK_CREATE}_PENDING`:
            return false

        default:
            return state
    }
}

function title(state = '', action) {
    if (action.type === ActionType.TASK_PREPARE) {
        return action.payload.name
    } else {
        return state
    }
}

function kind(state = '', action) {
    if (action.type === ActionType.TASK_PREPARE) {
        return action.payload.inputParam
    } else {
        return state
    }
}

function from(state = {}, action) {
    if (action.type === ActionType.SELECT_FROM) {
        return action.payload
    } else {
        return state
    }
}

function to(state = {}, action) {
    if (action.type === ActionType.SELECT_TO) {
        return action.payload
    } else {
        return state
    }
}

export const pendingAlgo = combineReducers({ onScreen, title, kind, from, to })

export function tasks(state = [], action) {
    return state
}
