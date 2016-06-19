import _ from 'lodash'
import {
    ActionType,
    AlgoURL,
    ReportURL,
    TaskListURL,
    ReportTaskListURL,
    TRNodeGroupURL,
    TRPathsURL,
    TaskResultsType
} from '../actions'
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
        const baseUrl = Reflect.has(getState().algos.definitions, algo.name) ? AlgoURL : ReportURL
        const qs = Reflect.ownKeys(params)
            .map(p => {
                const name = encodeURIComponent(p)
                const value = encodeURIComponent(params[p])
                return `${name}=${value}`
            })
            .concat(`ts=${getState().graphs[params.gid].tstamp}`)
            .join('&')
        netAction({
            url: `${baseUrl}/${algo.url}?${qs}`,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_CREATE}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_CREATE}_FAIL`, error, payload: { algo, params } })
        })
    }
}

export function getTaskList() {
    return function (dispatch) {
        dispatch({ type: `${ActionType.TASK_LIST_GET}_PENDING` })
        netAction({
            url: TaskListURL,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_LIST_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_LIST_GET}_FAIL`, error })
        })
        dispatch({ type: `${ActionType.TASK_LIST_GET}_PENDING` })
        netAction({
            url: ReportTaskListURL,
            onSuccess: payload => dispatch({ type: `${ActionType.TASK_LIST_GET}_OK`, payload }),
            onError: error => dispatch({ type: `${ActionType.TASK_LIST_GET}_FAIL`, error })
        })
    }
}

export function getTask(id) {
    return function (dispatch, getState) {
        const baseUrl =
            Reflect.has(getState().algos.definitions, getState().tasks[id].name) ? TaskListURL : ReportTaskListURL
        dispatch({ type: `${ActionType.TASK_GET}_PENDING`, payload: id })
        netAction({
            url: `${baseUrl}/${encodeURIComponent(id)}`,
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
