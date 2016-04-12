import page from 'page'

import { sessionActionType as ActionType } from './action-types'

export const login = (login, password) => {

    const data = new FormData()
    data.append('login', login)
    data.append('password', password)


    return (dispatch, getState) => {
        dispatch({type: `${ActionType.LOGIN}_PENDING`})
        fetch('/auth/login', {
            credentials: 'same-origin',
            method: 'post',
            body: data
        })
        .then(response => {
            if(response.status != 200) {
                return Promise.reject(response.statusText)
            }
            let csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(changeCsrf(csrf))
            }
            return response.json()
        })
        .then(data => {
            dispatch({
                type: `${ActionType.LOGIN}_OK`,
                payload: data
            })
            page.redirect(getState().router.prevPath)
        })
        .catch(err => dispatch({
            type: `${ActionType.LOGIN}_FAIL`,
            payload: err
        }))
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        dispatch({type: `${ActionType.LOGOUT}_PENDING`})
        fetch('/auth/logout', {
            credentials: 'same-origin',
            method: 'post',
            headers: new Headers({'x-xsrf-token': getState().session.csrf})
        })
        .then(response => {
            if(response.status != 204) {
                return Promise.reject(response.statusText)
            }
            page('#!/login')
            dispatch({type: `${ActionType.LOGOUT}_OK`})
        })
        .catch(err => {
            page.redirect('#!/login')
            dispatch({
                type: `${ActionType.LOGOUT}_FAIL`,
                payload: err,
                error: true
            })
        })
    }
}

export const fetchSessionDetails = () => {
    return (dispatch, getState) => {
        dispatch({type: `${ActionType.FETCH_SESSION_DETAILS}_PENDING`})
        fetch('/auth/check', {
            credentials: 'same-origin'/*,
            method: 'post',
            headers: new Headers({'x-xsrf-token': getState().session.csrf})*/
        })
        .then(response => {
            if(response.status != 200) {
                return Promise.reject(response.statusText)
            }
            let csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(changeCsrf(csrf))
            }
            return response.json()
        })
        .then(data => setTimeout(() => dispatch({type: `${ActionType.FETCH_SESSION_DETAILS}_OK`, payload: data}), 5000))
        .catch(err => {
            dispatch({
                type: `${ActionType.FETCH_SESSION_DETAILS}_FAIL`,
                payload: err,
                error: true
            })
            page.redirect('#!/login')
        })
    }
}

export const clearLoginError = () => ({type: ActionType.CLEAR_LOGIN_ERROR})

export const changeCsrf = (csrf) => {
    return {
        type: ActionType.CSRF,
        payload: csrf
    }
}