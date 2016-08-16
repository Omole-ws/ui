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
        case `${ActionType.TASK_LIST_GET}_OK`:
            return action.payload
                .reduce((newState, task) => {
                    if (task.status === TaskStatus.TS_START) {
                        task.status = TaskStatus.TS_RUNNING
                    }
                    if (task.status === TaskStatus.TS_COMPLETED && (!task.results || task.results.length === 0) ) {
                        task.status = TaskStatus.TS_NOSOLUTION
                    }
                    newState[task.tid] = task
                    return newState
                }, {...state })

        case `${ActionType.TASK_CREATE}_OK`:
        case `${ActionType.TASK_GET}_OK`:
            if (action.payload.status === TaskStatus.TS_START) {
                action.payload.status = TaskStatus.TS_RUNNING
            }
            if (action.payload.status === TaskStatus.TS_COMPLETED && (!action.payload.results || action.payload.results.length === 0) ) {
                action.payload.status = TaskStatus.TS_NOSOLUTION
            }
            return {
                ...state,
                [action.payload.tid]: action.payload
            }

        case `${ActionType.TASK_RESULTS_GET}_OK`:
            return {
                ...state,
                [action.payload.tid]: {
                    ...state[action.payload.tid],
                    results: action.payload.results,
                    status: TaskStatus.TS_LOADED
                }
            }

        case `${ActionType.TASK_GET}_PENDING`:
            return {...state, [action.payload]: {...state[action.payload], status: TaskStatus.TS_FETCHING } }

        case `${ActionType.TASK_GET}_FAIL`:
            return {...state, [action.payload]: {...state[action.payload], status: TaskStatus.TS_RUNNING } }

        case `${ActionType.LOGOUT}_OK`:
            return {}

        case ActionType.SHOW_GROUPS:
            return { ...state, [action.payload.tid]: { ...state[action.payload.tid], onScreen: 'g' } }

        case ActionType.SHOW_PATHS:
            return { ...state, [action.payload.tid]: { ...state[action.payload.tid], onScreen: 'p' } }

        case ActionType.HIDE_GROUPS:
        case ActionType.HIDE_PATHS:
            if (action.payload) {
                return { ...state, [action.payload]: { ...state[action.payload], onScreen: false } }
            } else if (action.type === ActionType.HIDE_PATHS) {
                return Reflect.ownKeys(state).reduce((newState, tid) => {
                    if (state[tid].onScreen === 'p') {
                        newState[tid] = { ...state[tid], onScreen: false }
                    } else {
                        newState[tid] = state[tid]
                    }
                    return newState
                }, {})
            } else {
                return Reflect.ownKeys(state).reduce((newState, tid) => {
                    if (state[tid].onScreen === 'g') {
                        newState[tid] = { ...state[tid], onScreen: false }
                    } else {
                        newState[tid] = state[tid]
                    }
                    return newState
                }, {})
            }

        case ActionType.HIDE_RESULTS:
            return Reflect.ownKeys(state).reduce((newState, tid) => {
                if (state[tid].onScreen) {
                    newState[tid] = { ...state[tid], onScreen: false }
                } else {
                    newState[tid] = state[tid]
                }
                return newState
            }, {})



        default:
            return state
    }
}
