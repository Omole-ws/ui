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
    FETCH_GRAPHS_LIST: 'FETCH_GRAPHS_LIST',
    FETCH_GRAPH: 'FETCH_GRAPH',
    SET_CURRENT_GRAPH: 'SET_CURRENT_GRAPH'
}

export default { ...routerActionType, ...sessionActionType, ...graphsActionType }