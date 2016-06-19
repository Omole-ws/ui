import { combineReducers } from 'redux'

function sort(state = { by: 'age', asc: true }) {
    return state
}

export const list = combineReducers({ sort })
