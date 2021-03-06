import { ActionType, GvaURL } from '../actions'
import { netAction } from '../helpers'

export function fetchGVA(graph) {
    return function(dispatch) {
        dispatch({type: `${ActionType.GVA_GET}_PENDING`, payload: {gid: graph.id}})
        netAction({
            url: `${GvaURL}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.GVA_GET}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.GVA_GET}_FAIL`, payload: {gid: graph.id}, error})
        })
    }
}
