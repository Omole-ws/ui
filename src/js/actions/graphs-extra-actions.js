import { ActionType } from '../actions'
import { netAction } from '../helpers'


const resourceURL = '/app/r/vizattrs'

// export function postNewGVA(gva) {
//     return dispatch => {
//         dispatch({type: `${ActionType.POST_NEW_GVA}_PENDING`, payload: gva})
//         dispatch(netAction({
//             url: resourceURL,
//             method: 'post',
//             body: gva,
//             onSuccess: id => dispatch({type: `${ActionType.POST_NEW_GVA}_OK`, payload: {...gva, id}}),
//             onError: error => dispatch({type: `${ActionType.POST_NEW_GVA}_FAIL`, payload: gva, error})
//         }))
//     }
// }

export function fetchGVA(graph) {
    return dispatch => {
        dispatch({type: `${ActionType.FETCH_GVA}_PENDING`, payload: {gid: graph.id}})
        dispatch(netAction({
            url: `${resourceURL}/${graph.id}`,
            onSuccess: payload => dispatch({type: `${ActionType.FETCH_GVA}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.FETCH_GVA}_FAIL`, payload: {gid: graph.id}, error})
        }))
    }
}

// export function updateGVA(gva) {
//     return dispatch => {
//         dispatch({type: `${ActionType.UPDATE_GVA}_PENDING`, payload: gva})
//         dispatch(netAction({
//             url: `${resourceURL}/${gva.id}`,
//             method: 'put',
//             body: gva,
//             onSuccess: () => dispatch({type: `${ActionType.UPDATE_GVA}_OK`, payload: gva}),
//             onError: error => dispatch({type: `${ActionType.UPDATE_GVA}_FAIL`, payload: gva, error})
//         }))
//     }
// }

// export function removeGVA(gva) {
//     return dispatch => {
//         dispatch({type: `${ActionType.REMOVE_GVA}_PENDING`, payload: gva})
//         dispatch(netAction({
//             url: `${resourceURL}/${gva.id}`,
//             method: 'delete',
//             onSuccess: () => dispatch({type: `${ActionType.REMOVE_GVA}_OK`, payload: gva}),
//             onError: error => dispatch({type: `${ActionType.REMOVE_GVA}_FAIL`, payload: gva, error})
//         }))
//     }
// }
