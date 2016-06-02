import _ from 'lodash'
import { store } from '../index'
import { Action, TaskStatus } from './actions'


export function taskCheck() {
    const tasks = store.getState().tasks
    const activeTIDs = Reflect
        .ownKeys(tasks)
        .filter(tid => tasks[tid].status === TaskStatus.TS_START || tasks[tid].status === TaskStatus.TS_RUNNING)

    activeTIDs.forEach(tid => setTimeout(watch, 2000, tid))
}

function watch(tid) {
    store.dispatch(Action.fetchTask(tid))
}
