import { store } from '../index'
import { Action, TaskStatus } from './actions'

const pending = {}

export function taskCheck() {
    const tasks = store.getState().tasks
    const activeTIDs = Reflect
        .ownKeys(tasks)
        .filter(tid => tasks[tid].status === TaskStatus.TS_RUNNING && !Reflect.has(pending, tid))

    activeTIDs.forEach(tid => chargeChecker(tid))
}

function chargeChecker(tid) {
// function watch(tid) {
    pending[tid] = true
    setTimeout(_tid => {
        store.dispatch(Action.getTask(_tid))
        Reflect.deleteProperty(pending, _tid)
    }, 2000, tid)
}
