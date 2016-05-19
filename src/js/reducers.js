// STATE OBJECT REPRESENTATION
const state = {
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
        definitions: null,
        isFetching: false
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
        deskMode: 'node-create' || 'connect' || 'basic'
    },
    mcenter: {
        onScreen: false,
        messages: []
    }
}

import * as routerReducers from './reducers/router-reducers'
import * as sessionReducers from './reducers/session-reducers'
import * as graphsReducers from './reducers/graphs-reducers'
import * as messageCenterReducers from './reducers/mcenter-reducers'
import * as graphsExtraReducers from './reducers/graphs-extra-reducers'
import * as tapeReducers from './reducers/tape-reducers'
import * as algosReducers from './reducers/algos-reducers'
import * as operateComponentReducers from './reducers/operate-component-reducers'

export default {
    ...routerReducers,
    ...sessionReducers,
    ...graphsReducers,
    ...messageCenterReducers,
    ...graphsExtraReducers,
    ...tapeReducers,
    ...algosReducers,
    ...operateComponentReducers
}
