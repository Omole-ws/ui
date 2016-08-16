import _ from 'lodash'
import * as routerActions from './actions/router-actions'
import * as sessionActions from './actions/session-actions'
import * as graphsActions from './actions/graphs-actions'
import * as graphsExtraActions from './actions/graphs-extra-actions'
import * as crudActions from './actions/crud-actions'
import * as algosActions from './actions/algos-actions'
import * as reportsActions from './actions/reports-actions'
import * as tasksActions from './actions/tasks-actions'
import * as operateComponentActions from './actions/operate-component-actions'
import * as messageCenterActions from './actions/mcenter-actions'
import * as errorActions from './actions/error-actions'

export const DataURL = '/app/d/graphs'
export const GvaURL = '/app/d/vizattrs'
export const AlgoURL = '/app/t'
export const ReportURL = '/app/r/ccutils'
export const TaskListURL = '/app/t/cctasks'
export const ReportTaskListURL = '/app/r/cctasks'
export const TRNodeGroupURL = '/app/d/nodegroups'
export const TRPathsURL = '/app/d/paths'

export const Action = {
    ...routerActions,
    ...sessionActions,
    ...graphsActions,
    ...graphsExtraActions,
    ...crudActions,
    ...algosActions,
    ...reportsActions,
    ...tasksActions,
    ...operateComponentActions,
    ...messageCenterActions,
    ...errorActions
}

import ActionTypeI from './actions/action-types'
export const ActionType = ActionTypeI

export const Mode = {
    LOGIN: 'LOGIN',
    REGISTRATION: 'REGISTRATION',
    TASKMAN: 'TASKMAN',
    LIST: 'LIST',
    OPERATE: 'OPERATE',
    REPORTS: 'REPORTS'
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

export const TaskStatus = {
    TS_START: 'TSTART',
    TS_COMPLETED: 'TCOMPLETE',
    TS_RUNNING: 'TRUN',
    TS_ERROR: 'TERROR',
    TS_FETCHING: '_FETCH',
    TS_NOSOLUTION: '_NOSOLUTION',
    TS_LOADED: '_LOADED'
}
export const TaskResultsType = {
    TR_NODE_GROUP: 'OUTPUT_VERTEXMAP',
    TR_PATHS: 'OUTPUT_PATHES'
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
    DATA_DIODE: 'data-diode',
    OBJECT: 'object',
    SUBJECT: 'subject',
    SUBJECT_OR_OBJECT: 'subject-or-object'
}

export const NodeTypeInverted = _.invert(NodeType)

export const NodeRole = {
    [NodeType.USER]: 'SUBJECT',
    [NodeType.PROGRAMM]: 'SUBJECT',
    [NodeType.STORAGE]: 'OBJECT',
    [NodeType.DATA_OR_FILE]: 'OBJECT',
    [NodeType.BUFFER]: 'OBJECT',
    [NodeType.REMOVABLE_MEDIA]: 'OBJECT',
    [NodeType.SERVER]: 'SUBJECT',
    [NodeType.CLIENT]: 'SUBJECT',
    [NodeType.FIREWALL]: 'SUBJECT',
    [NodeType.GATE]: 'SUBJECT',
    [NodeType.DATA_DIODE]: 'OBJECT',
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
