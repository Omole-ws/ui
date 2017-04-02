
import React from 'react'
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
        value: 'Register',
        hidden: !props.registration
    }


    return (
        <form className="ui large form" onSubmit={props.onSubmit}>
            <div className="ui field">
                <div className={`ui left icon input ${props.error ? 'error' : ''}`}>
                    <i className="ui user icon"/>
                    <input type="text" name="login" placeholder="Login" onChange={props.onFieldChange}/>
                </div>
            </div>
            { props.registration && MailField }
            <div className="ui field">
                <div className={`ui left icon input ${props.error ? 'error' : ''}`}>
                    <i className="ui lock icon"/>
                    <input type="password" name="password" placeholder="Password" onChange={props.onFieldChange}/>
                </div>
            </div>
            <input {...submitProps}/>
            { props.error &&
                <div className="ui small negative message">
                    <i className="ui close icon" onClick={props.clearError}/>
                    <div className="header">Failed</div>
                    <pre className="ui left aligned container">{props.error}</pre>
                </div>
            }
        </form>
    )
}
LRForm.propTypes = {
    error: React.PropTypes.string,
    registration: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired,
    onFieldChange: React.PropTypes.func.isRequired,
    clearError: React.PropTypes.func.isRequired
}
export default LRForm
