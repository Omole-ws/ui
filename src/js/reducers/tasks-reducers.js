import { combineReducers } from 'redux'

import { ActionType, TaskStatus } from '../actions'

function onScreen(state = false, action) {
    switch (action.type) {
        case ActionType.TASK_PREPARE:
            return true

        case ActionType.TASK_PREPARE_CANCEL:
        case `${ActionType.TASK_CREATE}_PENDING`:
            return false

        case `${ActionType.LOGOUT}_OK`:
            return false

        default:
            return state
    }
}

function algo(state = {}, action) {
    if (action.type === ActionType.TASK_PREPARE) {
        return action.payload
    } else {
        return state
    }
}

// function kind(state = '', action) {
//     if (action.type === ActionType.TASK_PREPARE) {
//         return action.payload.inputParam
//     } else {
//         return state
//     }
// }

function from(state = {}, action) {
    switch (action.type) {
        case ActionType.SELECT_FROM:
            return action.payload

        case ActionType.TASK_PREPARE:
            return {}

        default:
            return state
    }
}

function to(state = {}, action) {
    switch (action.type) {
        case ActionType.SELECT_TO:
            return action.payload

        case ActionType.TASK_PREPARE:
            return {}

        default:
            return state
    }
}

export const pendingAlgo = combineReducers({ onScreen, algo, from, to })

export function tasks(state = {}, action) {
    switch (action.type) {
        case `${ActionType.TASK_CREATE}_OK`:
        case `${ActionType.TASK_GET}_OK`:
            return { ...state, [action.payload.tid]: action.payload }

        case `${ActionType.TASK_RESULTS_GET}_OK`:
            return {
                ...state,
                [action.payload.tid]: {
                    ...state[action.payload.tid],
                    results: action.payload.results,
                    loaded: true
                }
            }

        case `${ActionType.TASK_GET}_PENDING`:
            return { ...state, [action.payload]: { ...state[action.payload], status: TaskStatus.TS_FETCHING } }

        case `${ActionType.TASK_GET}_FAIL`:
            return { ...state, [action.payload]: { ...state[action.payload], status: TaskStatus.TS_RUNNING } }

        case `${ActionType.LOGOUT}_OK`:
            return {}

        default:
            return state
    }
}
