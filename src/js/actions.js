import * as routerActions from './actions/router-actions'
import * as sessionActions from './actions/session-actions'
import * as graphsActions from './actions/graphs-actions'
import * as messageCenterActions from './actions/mcenter-actions'


export const Action = {
    ...routerActions,
    ...sessionActions,
    ...graphsActions,
    ...messageCenterActions
}

export ActionType from './actions/action-types'

export const Mode = {
    LOGIN: 'LOGIN',
    REGISTRATION: 'REGISTRATION',
    LIST: 'LIST',
    OPERATE: 'OPERATE'
}
