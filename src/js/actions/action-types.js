const routerActionType = {
    ROUTE_CHANGED: 'ROUTE_CHANGED',
    SET_MODE:      'SET_MODE'
}

const sessionActionType = {
    CSRF:                  'CSRF',
    REGISTER:              'REGISTER',
    LOGIN:                 'LOGIN',
    LOGOUT:                'LOGOUT',
    FETCH_SESSION_DETAILS: 'FETCH_SESSION_DETAILS',
    CLEAR_LOGIN_ERROR:     'CLEAR_LOGIN_ERROR'
}

const graphsActionType = {
    SET_CURRENT_GRAPH: 'SET_CURRENT_GRAPH',
    FETCH_GRAPHS_LIST: 'FETCH_GRAPHS_LIST',
    FETCH_GRAPH:       'FETCH_GRAPH',
    POST_NEW_GRAPH:    'POST_NEW_GRAPH',
    PATCH_GRAPH:       'PATCH_GRAPH',
    REMOVE_GRAPH:      'REMOVE_GRAPH',
    DUPLICATE_GRAPH:   'DUPLICATE_GRAPH'
}

const graphsExtraActionType = {
    FETCH_GVA: 'FETCH_GVA'
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
    ALGO_FETCH_DEF: 'ALGO_FETCH_DEF'
}

const tasksActionType = {
    CREATE_TASK: 'CREATE_TASK',
    FETCH_TASK: 'FETCH_TASK',
    FETCH_TASK_LIST: 'FETCH_TASK_LIST'
}

const operateComponentActionType = {
    SET_DESK_MODE: 'SET_DESK_MODE',
    NODE_DIALOG: 'NODE_DIALOG',
    NODE_DIALOG_CLOSE: 'NODE_DIALOG_CLOSE',
    EDGE_DIALOG: 'EDGE_DIALOG',
    EDGE_DIALOG_CLOSE: 'EDGE_DIALOG_CLOSE'
}

const messageCenterActionType = {
    SHOW_MSG_CENTER: 'SHOW_MSG_CENTER',
    HIDE_MSG_CENTER: 'HIDE_MSG_CENTER'
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
