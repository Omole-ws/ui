import { ActionType } from '../actions'


const graph = (store = {isFetching: false, lastUpdated: null}, action) => {

    if (store.id !== action.payload.id) {
        return store
    }
    switch(action.type) {
        case `${ActionType.FETCH_GRAPH}_PENDING`:
            return {...store, isFetching: true}

        case `${ActionType.FETCH_GRAPH}_OK`:
            return {...action.payload, isFetching: false, lastUpdated: new Date()}

        case `${ActionType.FETCH_GRAPH}_FAIL`:
            return {...store, ...action.payload, isFetching: false}

        default:
            return store
    }
}

export const graphs = (store = {isFetching: false, lastUpdated: null, list: [], lmap: new Map()}, action) => {

    switch(action.type) {
        case `${ActionType.FETCH_GRAPHS_LIST}_PENDING`:
            return {...store, isFetching: true}

        case `${ActionType.FETCH_GRAPHS_LIST}_OK`:
            let list = action.payload.map(e => ({...e, isFetching: false, lastUpdated: null}))
            return {
                ...store,
                list,
                lmap: new Map(list.map(e => [e.id, e])),
                isFetching: false,
                lastUpdated: new Date()
            }

        case `${ActionType.FETCH_GRAPHS_LIST}_FAIL`:
            return {...store, isFetching: false}

        case `${ActionType.FETCH_GRAPH}_PENDING`:
            if (!store.lmap.has(action.payload.id)) {
                // console.group('DEBUG')
                // console.log('Creating noe')
                // console.log(ac)
                // console.groupEnd()
                store.list.push({isFetching: false, lastUpdated: null, id: action.payload.id})
            }
        case `${ActionType.FETCH_GRAPH}_OK`:
        case `${ActionType.FETCH_GRAPH}_FAIL`:
            list = store.list.map(e => graph(e, action))
            return {
                ...store,
                list: list.map(e => graph(e, action)),
                lmap: new Map(list.map(e => [e.id, e]))
            }

        default:
            return store
    }
}

export const currentGraph = (store = null, action) => {
    if (action.type === ActionType.SET_CURRENT_GRAPH) {
        return action.payload
    } else {
        return store
    }
}
