import page from 'page'

import { sessionActionType as ActionType } from './action-types'
import { createFetchError } from './helpers'

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
            if(!response.ok) {
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(changeCSRF(csrf))
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
        .catch(err => {
            console.log(err)
            dispatch({
                type: `${ActionType.LOGIN}_FAIL`,
                payload: err
            })
        })
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
            if(!response.ok) {
                return createFetchError(response)
            }
            dispatch({type: `${ActionType.LOGOUT}_OK`})
            page('#!/login')
        })
        .catch(err => {
            dispatch({
                type: `${ActionType.LOGOUT}_FAIL`,
                payload: err
            })
            page('#!/login')
        })
    }
}

export const fetchSessionDetails = () => {
    return (dispatch) => {
        dispatch({type: `${ActionType.FETCH_SESSION_DETAILS}_PENDING`})
        fetch('/auth/check', {
            credentials: 'same-origin'/*,
            method: 'post',
            headers: new Headers({'x-xsrf-token': getState().session.csrf})*/
        })
        .then(response => {
            if(!response.ok) {
                return createFetchError(response)
            }
            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(changeCSRF(csrf))
            }
            return response.json()
        })
        .then(data => setTimeout(() => dispatch({type: `${ActionType.FETCH_SESSION_DETAILS}_OK`, payload: data}), 5000))
        .catch(err => {
            dispatch({
                type: `${ActionType.FETCH_SESSION_DETAILS}_FAIL`,
                payload: err
            })
            page.redirect('#!/login')
        })
    }
}

export const clearLoginError = () => ({type: ActionType.CLEAR_LOGIN_ERROR})

export const changeCSRF = (csrf) => {
    return {
        type: ActionType.CSRF,
        payload: csrf
    }
}