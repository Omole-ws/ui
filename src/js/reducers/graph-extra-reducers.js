import { combineReducers } from 'redux'

const emptyMap = new Map()
function visualAttributes (store = emptyMap, action) {
    switch (action.type) {
        default:
            return store
    }
}

export const graphExtra = combineReducers({visualAttributes})
