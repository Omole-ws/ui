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
    FETCH_GVA: 'FETCH_GVA',
    UPDATE_GVA: 'UPDATE_GVA',
    POST_NEW_GVA: 'POST_NEW_GVA',
    REMOVE_GVA: 'REMOVE_GVA'
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
    ...messageCenterActionType
}
