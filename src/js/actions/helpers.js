/**
 * Creates error message object from response returned by fetch
 * @arg {object} response fetch result
 * @return {object} error message object {error: '...', message: '...'} wrapped with Promise.reject
 */
export function createFetchError(response) {
    if(!response.ok) {
        let type = response.headers.get('content-type')
        if (type) {
            type = type.split(';')[0]
            if (type === 'application/json') {
                return response.json().then(e => Promise.reject(e))
            } else if (type === 'text/plain') {
                return response.text().then(msg => Promise.reject(msg)).catch(message => Promise.reject({error: response.statusText, message}))
            }
        }
        return Promise.reject({error: response.statusText, message: ''})
    } else {
        return Promise.reject({error: 'No errors', message: ''})
    }
}
