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
            name: '',
            roles: ['R', 'RR']
        },
        loginError: 'txt'
    },
    graphs: {
        isFetching: true,
        list: [
            
        ],
        map: new Map(/*this.list.map(e => [e.id, e])*/),
        lastUpdated: new Date()
    },
    currentGraph: 'gid',
    mcenter: {
        compact: false,
        visible: true,
        messages: []
    }
}

import * as routerReducers from './reducers/router-reducers'
import * as sessionReducers from './reducers/session-reducers'
import * as graphsReducers from './reducers/graphs-reducers'
import * as messageCenterReducers from './reducers/mcenter-reducers'

export default {
    ...routerReducers,
    ...sessionReducers,
    ...graphsReducers,
    ...messageCenterReducers
}
