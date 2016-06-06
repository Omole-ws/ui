const routerActionType = {
    ROUTE_CHANGED: 'ROUTE_CHANGED',
    MODE_SET:      'MODE_SET'
}

const sessionActionType = {
    CSRF:                  'CSRF',
    REGISTER:              'REGISTER',
    LOGIN:                 'LOGIN',
    LOGOUT:                'LOGOUT',
    SESSION_DETAILS_GET: 'SESSION_DETAILS_GET',
    CLEAR_LOGIN_ERROR:     'CLEAR_LOGIN_ERROR'
}

const graphsActionType = {
    SET_CURRENT_GRAPH: 'SET_CURRENT_GRAPH',
    GRAPHS_LIST_GET: 'GRAPHS_LIST_GET',
    GRAPH_GET:       'GRAPH_GET',
    GRAPH_POST:    'GRAPH_POST',
    GRAPH_PATCH:       'GRAPH_PATCH',
    GRAPH_DELETE:      'GRAPH_DELETE',
    GRAPH_DUPLICATE:   'GRAPH_DUPLICATE'
}

const graphsExtraActionType = {
    GVA_GET: 'GVA_GET'
}

const crudActionType = {
    GVA_PAN: 'GVA_PAN',
    GVA_ZOOM: 'GVA_ZOOM',
    NODE_CREATE: 'NODE_CREATE',
    NODE_UPDATE: 'NODE_UPDATE',
    NODE_DELETE: 'NODE_DELETE',
    EDGE_CREATE: 'EDGE_CREATE',
    EDGE_UPDATE: 'EDGE_UPDATE',
    EDGE_DELETE: 'EDGE_DELETE',
    NODE_POSITION_CHANGE: 'NODE_POSITION_CHANGE',
    NODE_TYPE_CHANGE: 'NODE_TYPE_CHANGE'
}

const algosActionType = {
    ALGO_DEF_GET: 'ALGO_DEF_GET'
}

const tasksActionType = {
    TASK_PREPARE: 'TASK_PREPARE',
    TASK_PREPARE_CANCEL: 'TASK_PREPARE_CANCEL',
    TASK_CREATE: 'TASK_CREATE',
    TASK_GET: 'TASK_GET',
    TASK_LIST_GET: 'TASK_LIST_GET',
    TASK_RESULTS_GET: 'TASK_RESULTS_GET',
    SHOW_GROUPS: 'SHOW_GROUPS',
    SHOW_PATHS: 'SHOW_PATHS',
    HIGHLIGHT_PATH: 'HIGHLIGHT_PATH'
}

const operateComponentActionType = {
    SET_DESK_MODE: 'SET_DESK_MODE',
    NODE_DIALOG: 'NODE_DIALOG',
    NODE_DIALOG_CLOSE: 'NODE_DIALOG_CLOSE',
    EDGE_DIALOG: 'EDGE_DIALOG',
    EDGE_DIALOG_CLOSE: 'EDGE_DIALOG_CLOSE',
    SELECT_FROM: 'SELECT_FROM',
    SELECT_TO: 'SELECT_TO',
    RB_TOGGLE: 'RB_TOGGLE'
}

const messageCenterActionType = {
    MSG_CENTER_SHOW: 'MSG_CENTER_SHOW',
    MSG_CENTER_HIDE: 'MSG_CENTER_HIDE'
}


export default {
    ...routerActionType,
    ...sessionActionType,
    ...graphsActionType,
    ...graphsExtraActionType,
    ...crudActionType,
    ...algosActionType,
    ...tasksActionType,
    ...operateComponentActionType,
    ...messageCenterActionType
}
