import * as routerActions from './actions/router-actions'
import * as sessionActions from './actions/session-actions'
import * as graphsActions from './actions/graphs-actions'


export const Action = { ...routerActions, ...sessionActions, ...graphsActions }

export ActionType from './actions/action-types'

export const Mode = {
    LOGIN: 'LOGIN',
    REGISTRATION: 'REGISTRATION',
    LIST: 'LIST',
    OPERATE: 'OPERATE'
}
