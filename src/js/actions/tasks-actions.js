import { ActionType, AlgoURI } from '../actions'
import { netAction } from '../helpers'

const TaskListURI = '/app/t/cctasklist'
const TaskURI = '/app/t/cctasklist'

export function prepareTask(payload) {
    return {type: ActionType.TASK_PREPARE, payload}
}

export function createTask({algo, params}) {
    return function(dispatch) {
        dispatch({type: `${ActionType.CREATE_TASK}_PENDING`, payload: {algo, params}})
        const qs = Reflect.ownKeys(params)
        .map(p => {
            const name = encodeURIComponent(p)
            const value = encodeURIComponent(params[p])
            return `${name}=${value}`
        })
        .join('&')
        dispatch(netAction({
            url: `${AlgoURI}/${algo.url}?${qs}`,
            onSuccess: payload => dispatch({type: `${ActionType.CREATE_TASK}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.CREATE_TASK}_FAIL`, error})
        }))
    }
}

export function fetchTaskList() {
    return function(dispatch) {
        dispatch({type: `${ActionType.FETCH_TASK_LIST}_PENDING`})
        dispatch(netAction({
            url: TaskListURI,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_TASK_LIST}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_TASK_LIST}_FAIL`, error})
        }))
    }
}

export function fetchTask(id) {
    return function(dispatch) {
        dispatch({type: `${ActionType.FETCH_TASK}_PENDING`})
        dispatch(netAction({
            url: `${TaskURI}?cckey=${encodeURIComponent(id)}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_TASK}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_TASK}_FAIL`, error})
        }))
    }
}
