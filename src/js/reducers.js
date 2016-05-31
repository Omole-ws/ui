// STATE OBJECT REPRESENTATION
export const store_EX = {
    router: {
        path: '',
        params: null
    },
    mode: 'list' || 'operate' || 'report' || 'TA' || 'DBA',
    list: {
        new: false,
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
        list: [
            {
                isFetching: false,
                id: 'str',
                uid: 'str',
                info: {label: 'str', comment:''},
                nodes: [],
                edges: []
            }
        ]
    },
    graphsExtra: {
        visualAttributes: {
            ['gid']: {
                isFetching: false
            }
        }
    },
    currentGraph: 'gid',
    tape: {
        ['gid']: []
    },
    algos: {
        definitions: [],
        isFetching: false
    },
    tasks: {
        list: {}
    },
    pendingAlgo: {
        onScreen: false,
        title: '',
        kind: ''
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
import * as tapeReducers from './reducers/tape-reducers' // tape
import * as algosReducers from './reducers/algos-reducers'
import * as tasksReducers from './reducers/tasks-reducers'
import * as operateComponentReducers from './reducers/operate-component-reducers'

export default {
    ...routerReducers,
    ...sessionReducers,
    ...graphsReducers,
    ...messageCenterReducers,
    ...graphsExtraReducers,
    ...tapeReducers,
    ...algosReducers,
    ...tasksReducers,
    ...operateComponentReducers
}
