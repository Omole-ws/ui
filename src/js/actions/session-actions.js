import page from 'page'

import { ActionType } from '../actions'
import { netAction } from '../helpers'

export function register({login, mail, password}) {
    return function (dispatch) {
        dispatch({type: `${ActionType.REGISTER}_PENDING`})
        dispatch(netAction({
            registration: true,
            url: '/auth/registration',
            method: 'post',
            body: {login, mail, password},
            onSuccess: () => {
                dispatch({type: `${ActionType.REGISTER}_OK`})
                page.redirect('#!/login')
            },
            onError: error => dispatch({type: `${ActionType.REGISTER}_FAIL`, error})
        }))
    }
}

export function login(login, password) {
    const form = new FormData()
    form.append('login', login)
    form.append('password', password)

    return function (dispatch, getState) {
        dispatch({type: `${ActionType.LOGIN}_PENDING`})
        dispatch(netAction({
            url: '/auth/login',
            method: 'post',
            body: form,
            onSuccess: payload => {
                dispatch({type: `${ActionType.LOGIN}_OK`, payload})
                page.redirect(getState().router.prevPath)
            },
            onError: error => dispatch({type: `${ActionType.LOGIN}_FAIL`, error})
        }))
    }
}

export function logout() {
    return function(dispatch) {
        dispatch({type: `${ActionType.LOGOUT}_PENDING`})
        dispatch(netAction({
            url: '/auth/logout',
            method: 'post',
            onSuccess: () => {
                dispatch({type: `${ActionType.LOGOUT}_OK`})
                page('#!/login')
            },
            onError: error => dispatch({type: `${ActionType.LOGOUT}_FAIL`, error})
        }))
    }
}

export function fetchSessionDetails() {
    return function(dispatch) {
        dispatch({type: `${ActionType.SESSION_DETAILS_GET}_PENDING`})
        dispatch(netAction({
            url: '/auth/check',
            onSuccess: payload => dispatch({type: `${ActionType.SESSION_DETAILS_GET}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.SESSION_DETAILS_GET}_FAIL`, error})
        }))
    }
}

export function clearLoginError() {
    return {type: ActionType.CLEAR_LOGIN_ERROR}
}

export function changeCSRF(csrf) {
    return {
        type: ActionType.CSRF,
        payload: csrf
    }
}
