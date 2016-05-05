import * as routerActions from './actions/router-actions'
import * as sessionActions from './actions/session-actions'
import * as graphsActions from './actions/graphs-actions'
import * as graphsExtraActions from './actions/graphs-extra-actions'
import * as crudActions from './actions/crud-actions'
import * as operateComponentActions from './actions/operate-component-actions'
import * as messageCenterActions from './actions/mcenter-actions'


export const Action = {
    ...routerActions,
    ...sessionActions,
    ...graphsActions,
    ...graphsExtraActions,
    ...crudActions,
    ...operateComponentActions,
    ...messageCenterActions
}

import ActionTypeI from './actions/action-types'
export const ActionType = ActionTypeI

export const Mode = {
    LOGIN: 'LOGIN',
    REGISTRATION: 'REGISTRATION',
    LIST: 'LIST',
    OPERATE: 'OPERATE'
}

export const DeskMode = {
    BASIC: 'BASIC',
    NODE_CREATE: 'NODE_CREATE',
    CONNECT: 'CONNECT'
}

export const NodeType = {
    USER: 'USER',
    PROGRAM: 'PROGRAM',
    STORAGE: 'STORAGE',
    'DATA/FILE': 'DATA/FILE',
    BUFFER: 'BUFFER',
    REMOVABLE_MEDIA: 'REMOVABLE_MEDIA',
    SERVER: 'SERVER',
    CLIENT: 'CLIENT',
    FIREWALL: 'FIREWALL',
    GATE: 'GATE'
}
