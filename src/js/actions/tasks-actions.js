import _ from 'lodash'
import { ActionType, AlgoURL, TaskListURL, TRNodeGroupURL, TRPathsURL, TaskResultsType } from '../actions'
import { netAction } from '../helpers'

export function taskPrepare(payload) {
    return { type: ActionType.TASK_PREPARE, payload }
}

export function cancelTaskPrepare() {
    return { type: ActionType.TASK_PREPARE_CANCEL }
}

export function createTask({ algo, params }) {
    return function (dispatch, getState) {
        dispatch({ type: `${ActionType.TASK_CREATE}_PENDING`, payload: { algo, params } })
        const qs = Reflect.ownKeys(params)
            .map(p => {
                const name = encodeURIComponent(p)
                const value = encodeURIComponent(params[p])
                return `${name}=${value}`
            })
            .concat(`ts=${getState().graphs.list.find(g => g.id === params.gid).tstamp}`)
            .join('&')
        netAction({
            url: `${AlgoURL}/${algo.url}?${qs}`,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_CREATE}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_CREATE}_FAIL`, error, payload: { algo, params } })
        })
    }
}

export function fetchTaskList() {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_LIST_GET}_PENDING` })
        netAction({
            url: TaskListURL,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_LIST_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_LIST_GET}_FAIL`, error })
        })
    }
}

export function fetchTask(id) {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_GET}_PENDING`, payload: id })
        netAction({
            url: `${TaskListURL}/${encodeURIComponent(id)}`,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_GET}_FAIL`, error, payload: id })
        })
    }
}

export function getTaskResults(task) {
    return function (dispatch, getState) {
        const algo = getState().algos.definitions[task.name]
        let url = null
        switch (algo.outputParam) {
            case TaskResultsType.TR_NODE_GROUP:
                url = `${TRNodeGroupURL}/${task.results[0]}`
                break

            case TaskResultsType.TR_PATHS:
                url = `${TRPathsURL}?${task.results.map(rid => `id=${rid}`).join('&')}`
                break

            default:
                return { type: `${ActionType.TASK_RESULTS_GET}_FAIL`, payload: task, error: 'Unknown result type' }
        }

        dispatch({ type: `${ActionType.TASK_RESULTS_GET}_PENDING`, payload: task })
        netAction({
            url,
            onSuccess: results => {
                if (algo.outputParam === TaskResultsType.TR_NODE_GROUP) {
                    results.mappings = _.invertBy(results.mappings)
                }
                dispatch({
                    type: `${ActionType.TASK_RESULTS_GET}_OK`,
                    payload: { results, tid: task.tid }
                })
            },
            onError: error => dispatch({type: `${ActionType.TASK_RESULTS_GET}_FAIL`, payload: task, error })
        })
    }
}
