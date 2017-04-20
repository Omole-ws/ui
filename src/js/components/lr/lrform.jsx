import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const LRForm = props => {
    const MailField =
        <div className="field">
            <div className={cs('ui left icon input', {error: props.error})}>
                <i className="mail icon"/>
                <input type="email" name="mail" placeholder="E-mail" onChange={props.onFieldChange}/>
            </div>
        </div>
    const submitProps = {
        className: props.registration ? 'ui fluid large orange submit button' : '',
        type: 'submit',
        hidden: !props.registration
    }


    return (
        <form className="ui large form" onSubmit={props.onSubmit}>
            <div className="field">
                <div className={`ui left icon input ${props.error ? 'error' : ''}`}>
                    <i className="user icon"/>
                    <input type="text" name="login" placeholder="Login" onChange={props.onFieldChange}/>
                </div>
            </div>
            { props.registration && MailField }
            <div className="field">
                <div className={`ui left icon input ${props.error ? 'error' : ''}`}>
                    <i className="lock icon"/>
                    <input type="password" name="password" placeholder="Password" onChange={props.onFieldChange}/>
                </div>
            </div>
            <button {...submitProps}>Register</button>
            { props.error &&
                <div className="ui small negative message">
                    <i className="close icon" onClick={props.clearError}/>
                    <div className="ui header">Failed</div>
                    <pre className="ui left aligned container">{props.error}</pre>
                </div>
            }
        </form>
    )
}
LRForm.propTypes = {
    error: PropTypes.string,
    registration: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired
}
export default LRForm
