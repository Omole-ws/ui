import { ActionType, AlgoURI } from '../actions'
import { netAction } from '../helpers'

export function algosFetchDef() {
    return function (dispatch) {
        dispatch({type: `${ActionType.ALGO_FETCH_DEF}_PENDING`})
        dispatch(netAction({
            url: AlgoURI,
            onSuccess: payload => dispatch({type: `${ActionType.ALGO_FETCH_DEF}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.ALGO_FETCH_DEF}_FAIL`, error})
        }))
    }
}

// export fu
