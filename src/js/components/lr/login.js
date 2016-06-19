import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/header.css'
// import '../../../../semantic/dist/components/image.css'
// import '../../../../semantic/dist/components/menu.css'
import '../../../../semantic/dist/components/divider.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/button.css'
// import '../../../../semantic/dist/components/list.css'
import '../../../../semantic/dist/components/message.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import { connect } from 'react-redux'

import  { Action, Mode } from '../../actions'
import Nav from '../nav/nav'
import LoginTmpl from '!jade-react!./login.jade'
import logo from '../../../img/logo.png'

import _ from 'lodash'
// import cloneDeep from 'lodash-es/cloneDeep'

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: ''
        }
        this.handleFieldChange = (...args) => this._handleFieldChange(...args)
        this.loginTo = (...args) => this._loginTo(...args)
    }

    static propTypes = {
        error:      React.PropTypes.string,
        login:      React.PropTypes.func.isRequired,
        clearError: React.PropTypes.func.isRequired
    }

    /**
     * Maps form fields to local state
     * @arg {object} ev event triggered
     * @return {void}
     */
    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    /**
     * fire async login action
     * @arg {string} [login] accaunt name
     * @arg {string} [password] accaunt password
     * @arg {Object} ev submit event that have triggered login action
     * @return {void}
     */
    _loginTo(login, password, ev) {
        // let ev = args[0]
        if (_.isObject(login)) {
            ev = login
            if (ev.type !== 'submit') {
                return
            }
            login = this.state.login
            password = this.state.password
        }
        this.props.login(login, password)
        ev.preventDefault()
    }

    render() {
        return (
            <div>
                <Nav mode={Mode.LOGIN}/>
                <LoginTmpl logo={logo} handleFieldChange={this.handleFieldChange} loginTo={this.loginTo}
                    error={this.props.error} clearError={this.props.clearError}/>
            </div>
        )
    }
}

//                                                      888
//                                                      888
//                                                      888
//  .d8888b .d88b.  88888b.  88888b.   .d88b.   .d8888b 888888
// d88P"   d88""88b 888 "88b 888 "88b d8P  Y8b d88P"    888
// 888     888  888 888  888 888  888 88888888 888      888
// Y88b.   Y88..88P 888  888 888  888 Y8b.     Y88b.    Y88b.
//  "Y8888P "Y88P"  888  888 888  888  "Y8888   "Y8888P  "Y888
//
//
//

function mapStateToProps(state) {
    return { error: state.session.loginError }
}

const mapDispatchToProps = {
    login: Action.login,
    clearError: Action.clearLoginError
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
