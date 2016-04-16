export const routerActionType = {
    ROUTE_CHANGED: 'ROUTE_CHANGED',
    SET_MODE: 'SET_MODE'
}

export const sessionActionType = {
    CSRF: 'CSRF',
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    FETCH_SESSION_DETAILS: 'FETCH_SESSION_DETAILS',
    CLEAR_LOGIN_ERROR: 'CLEAR_LOGIN_ERROR'
}

export const graphsActionType = {
    SET_CURRENT_GRAPH: 'SET_CURRENT_GRAPH',
    FETCH_GRAPHS_LIST: 'FETCH_GRAPHS_LIST',
    FETCH_GRAPH: 'FETCH_GRAPH',
    POST_NEW_GRAPH: 'POST_NEW_GRAPH',
    REMOVE_GRAPH: 'REMOVE_GRAPH'
}


export default {
    ...routerActionType, 
    ...sessionActionType, 
    ...graphsActionType
}
