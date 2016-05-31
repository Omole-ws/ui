import _ from 'lodash'
import * as routerActions from './actions/router-actions'
import * as sessionActions from './actions/session-actions'
import * as graphsActions from './actions/graphs-actions'
import * as graphsExtraActions from './actions/graphs-extra-actions'
import * as crudActions from './actions/crud-actions'
import * as algosActions from './actions/algos-actions'
import * as tasksActions from './actions/tasks-actions'
import * as operateComponentActions from './actions/operate-component-actions'
import * as messageCenterActions from './actions/mcenter-actions'

export const DataURI = '/app/r/graphs'
export const GvaURI = '/app/r/vizattrs'
export const AlgoURI = '/app/t'

export const Action = {
    ...routerActions,
    ...sessionActions,
    ...graphsActions,
    ...graphsExtraActions,
    ...crudActions,
    ...algosActions,
    ...tasksActions,
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
    CONNECT: 'CONNECT',
    SELECT_FROM_TO: 'SELECT_FROM_TO'
}

export const AlgoInputType = {
    G: 'INPUT_GID',
    GL: 'INPUT_GID_LABEL',
    GLFT: 'INPUT_GID_FROM_TO_LABEL'
}

export const NodeType = {
    USER: 'user',
    PROGRAM: 'programm',
    STORAGE: 'storage',
    DATA_OR_FILE: 'data-or-file',
    BUFFER: 'buffer',
    REMOVABLE_MEDIA: 'removable_media',
    SERVER: 'server',
    CLIENT: 'client',
    FIREWALL: 'firewall',
    GATE: 'gate',
    OBJECT: 'object',
    SUBJECT: 'subject',
    SUBJECT_OR_OBJECT: 'subject-or-object'
}

export const NodeTypeInverted = _.invert(NodeType)

export const NodeRole = {
    [NodeType.USER]: 'SUBJECT',
    [NodeType.PROGRAMM]: 'SUBJECT_OR_OBJECT',
    [NodeType.STORAGE]: 'OBJECT',
    [NodeType.DATA_OR_FILE]: 'OBJECT',
    [NodeType.BUFFER]: 'OBJECT',
    [NodeType.REMOVABLE_MEDIA]: 'OBJECT',
    [NodeType.SERVER]: 'OBJECT',
    [NodeType.CLIENT]: 'SUBJECT',
    [NodeType.FIREWALL]: 'SUBJECT_OR_OBJECT',
    [NodeType.GATE]: 'OBJECT',
    [NodeType.OBJECT]: 'OBJECT',
    [NodeType.SUBJECT]: 'SUBJECT',
    [NodeType.SUBJECT_OR_OBJECT]: 'SUBJECT_OR_OBJECT'
}

export const EdgeType = {
    R_ONLY: 'r-only',
    W_ONLY: 'w-only',
    READ: 'read',
    WRITE: 'write',
    TAKE: 'take',
    GRANT: 'grant'
}

export const EdgeTypeInverted = _.invert(EdgeType)
