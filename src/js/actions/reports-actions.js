import { ActionType, ReportURL } from '../actions'
import { netAction } from '../helpers'

export function reportsFetchDef() {
    return function (dispatch) {
        dispatch({type: `${ActionType.REPORT_DEF_GET}_PENDING`})
        netAction({
            url: ReportURL,
            onSuccess: payload => dispatch({type: `${ActionType.REPORT_DEF_GET}_OK`, payload}),
            onError: error => dispatch({type: `${ActionType.REPORT_DEF_GET}_FAIL`, error})
        })
    }
}

// export fu
