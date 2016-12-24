import { ActionType, DisclaimerURL } from '../actions'
import { netAction } from '../helpers'

export function setLang(lang) {
    return {
        type: ActionType.LANG_SET,
        payload: lang
    }
}

export function getDiaclaimer(lang) {
    return function(dispatch) {
        dispatch({ type: `${ActionType.DISCLAIMER_GET}_PENDING` })
        netAction({
            url: DisclaimerURL[lang],
            onSuccess: ret => dispatch({ type: `${ActionType.DISCLAIMER_GET}_OK`, payload: { value: ret, ts: '' } }),
            onError: error  => dispatch({ type: `${ActionType.DISCLAIMER_GET}_FAIL`, error })
        })
    }
}
