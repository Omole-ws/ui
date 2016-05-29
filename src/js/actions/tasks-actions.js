import { ActionType, AlgoURI } from '../actions'
import { netAction } from '../helpers'

const TaskListURI = '/app/t/cctasklist'
const TaskURI = '/app/t/cctasklist'

export function prepareTask(payload) {
    return { type: ActionType.TASK_PREPARE, payload }
}

export function cancelTaskPrepare() {
    return { type: ActionType.TASK_PREPARE_CANCEL }
}

export function createTask({ algo, params }) {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_CREATE}_PENDING`, payload: { algo, params } })
        const qs = Reflect.ownKeys(params)
            .map(p => {
                const name = encodeURIComponent(p)
                const value = encodeURIComponent(params[p])
                return `${name}=${value}`
            })
            .join('&')
        dispatch(netAction({
            url: `${AlgoURI}/${algo.url}?${qs}`,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_CREATE}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_CREATE}_FAIL`, error })
        }))
    }
}

export function fetchTaskList() {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_LIST_GET}_PENDING` })
        dispatch(netAction({
            url: TaskListURI,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_LIST_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_LIST_GET}_FAIL`, error })
        }))
    }
}

export function fetchTask(id) {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_GET}_PENDING` })
        dispatch(netAction({
            url: `${TaskURI}?cckey=${encodeURIComponent(id)}`,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_GET}_FAIL`, error })
        }))
    }
}
