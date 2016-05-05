import _ from 'lodash'
import page from 'page'

import { Action, Mode } from './actions'


/**
 * Creates error message object from response returned by fetch
 * @arg {object} response fetch result
 * @return {object} error message object {error: '...', message: '...'} wrapped with Promise.reject
 */
function createFetchError(response, error, contentType) {
    let errPromise
    if (contentType === 'application/json') {
        errPromise = response.json()
        .then(e => {
            return Promise.reject(`${e.error || ''}, ${e.message || ''}\nRaw: ${JSON.stringify(e, null, 8)}`)
        })
    } else if (contentType) {
        errPromise = response.text().then(msg => Promise.reject(msg))
    } else {
        errPromise = Promise.reject('')
    }

    return errPromise .catch(e => {
        const err = new Error(`${error.message}\nDebug: ${e}`)
        err.auth = error.auth
        err.http = error.http
        return Promise.reject(err)
    })
}

export function netAction(opts) {
    return function (dispatch, getState) {
        //TODO: parse form to query if GET or HEAD
        const csrfHeader = !opts.registration ? {'x-xsrf-token': getState().session.csrf} : null
        const contentType = _.isPlainObject(opts.body) && {'content-type': 'application/json'} ||
            _.isString(opts.body) && {'content-type': 'application/json'} ||
            null
        const body = opts.body ? {body: _.isPlainObject(opts.body) ? JSON.stringify(opts.body) : opts.body} : null
        fetch(opts.url, {
            method: (opts.method || 'GET').toUpperCase(),
            credentials: 'same-origin',
            headers: {
                ...csrfHeader,
                ...contentType
            },
            ...body
        })
        .then(response => {
            const contentType = (response.headers.get('content-type') || '').split(';')[0]

            if(!response.ok) {
                const error = new Error(`error(${response.status}) ${response.statusText}`)
                error.auth = response.status === 401
                error.http = response.status
                if (!production) {
                    return createFetchError(response, error, contentType)
                } else {
                    return Promise.reject(error)
                }
            }

            const csrf = response.headers.get('x-xsrf-token')
            if (csrf) {
                dispatch(Action.changeCSRF(csrf))
            }

            if (contentType === 'application/json') {
                return response.json()
            } else if (contentType) {
                return response.text()
            }
            return Promise.resolve(null)
        })
        .then(data => opts.onSuccess(data))
        .catch(error => {
            opts.onError(error)
            if (error.auth && getState().mode !== Mode.LOGIN && !opts.registration) {
                new Promise(() => page('#!/login'))
            }
        })
    }
}


export function uuid(a /*placeholder*/){
    return a ?          // if the placeholder was passed, return
        (              // a random number from 0 to 15
            a ^            // unless a is 8,
            // Math.random()  // in which case
            // * 16           // a random number from
            crypto.getRandomValues(new Uint8Array(1))[0]
            % 16
            >> a/4         // 8 to 11
        ).toString(16) // in hexadecimal
    :
        ( // or otherwise a concatenated string: 10000000 + -1000 + -4000 + -80000000 + -100000000000,
            [1e7] + -1e3 + -4e3 + -8e3 + -1e11
        ).replace(     // replacing zeroes, ones, and eights with random hex digits
            /[018]/g, uuid
        )
}
