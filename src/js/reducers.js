// STATE OBJECT REPRESENTATION
export const store_EXPLAIN = {
    router: {
        path: '',
        params: null
    },
    mode: 'list' || 'operate' || 'report' || 'TA' || 'DBA',
    list: {
        sort: {
            by: 'name',
            asc: true
        }
    },
    session: {
        csrfToken: null,
        account: {
            isFetching: false,
            name: null,
            roles: []
        },
        loginError: 'txt'
    },
    graphs: {
        isFetching: true,
        ['gid']: {
            isFetching: false,
            isSyncing: false,
            id: 'str',
            uid: 'str',
            label: 'str',
            comment:'',
            nodes: [],
            edges: []
        }
    },
    graphsExtra: {
        visualAttributes: {
            ['gid']: {
                isFetching: false
            }
        }
    },
    currentGraph: 'gid',
    tapes: {
        ['gid']: []
    },
    algos: {
        definitions: {},
        isFetching: false
    },
    tasks: {
        list: {}
    },
    pendingAlgo: {
        onScreen: false,
        algo: {},
        from: { id: '', name: ''},
        to: { id: '', name: ''}
    },
    operating: {
        nodeEditor: {
            onScreen: false,
            node: true,
            position: {x: 0, y: 0}
        },
        edgeEditor: {
            onScreen: false,
            edge: null
        },
        resultBoard: {
            onScreen: false,
            hasNew: false,
            groupByType: true,
            filter: 'LOADED' & 'NEW'
        },
        group: null,
        paths: null,
        deskMode: 'NODE_CREATE' || 'CONNECT' || 'BASIC' || 'SELECT_FROM_TO'
    },
    mcenter: {
        onScreen: false,
        messages: []
    }
}

import * as routerReducers from './reducers/router-reducers'  // router, mode
import * as sessionReducers from './reducers/session-reducers'  // session
import * as graphsReducers from './reducers/graphs-reducers'  // graphs, currentGraph
import * as messageCenterReducers from './reducers/mcenter-reducers'
import * as graphsExtraReducers from './reducers/graphs-extra-reducers' // graphsExtra
import * as tapesReducers from './reducers/tapes-reducers' // tape
import * as algosReducers from './reducers/algos-reducers'
import * as reportsReducers from './reducers/reports-reducers'
import * as tasksReducers from './reducers/tasks-reducers'
import * as listComponentReducers from './reducers/list-component-reducers'
import * as operateComponentReducers from './reducers/operate-component-reducers'

export default {
    ...routerReducers,
    ...sessionReducers,
    ...graphsReducers,
    ...messageCenterReducers,
    ...graphsExtraReducers,
    ...tapesReducers,
    ...algosReducers,
    ...reportsReducers,
    ...tasksReducers,
    ...listComponentReducers,
    ...operateComponentReducers
}
