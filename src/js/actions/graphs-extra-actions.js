import { ActionType, GvaURI } from '../actions'
import { netAction } from '../helpers'

export function fetchGVA(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.FETCH_GVA}_PENDING`, payload: {gid: graph.id}})
        dispatch(netAction({
            url: `${GvaURI}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GVA}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_GVA}_FAIL`, payload: {gid: graph.id}, error})
        }))
    }
}
