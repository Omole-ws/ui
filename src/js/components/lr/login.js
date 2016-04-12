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

import VisualLoginTmpl from '!jade-react!./login.jade'
import logo from '../../../img/logo.png'

import _ from 'lodash'
// import cloneDeep from 'lodash-es/cloneDeep'

class VisualLogin extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: ''
        }
        this.changeField = (...args) => this._changeField(...args)
        this.loginTo = (...args) => this._loginTo(...args)
    }

    /**
     * Maps form fields to local state
     * @arg {string} name of local state parameter to update from name form field
     */
    _changeField(name, e) {
        this.setState({[name]: e.target.value})
    }

    /**
     * fire async login action
     * @arg {string} [login] accaunt name
     * @arg {string} [password] accaunt password
     * @arg {Object} ev submit event that have triggered login action
     */
    _loginTo(login, password, ev) {
        // let ev = args[0]
        if (_.isObject(login)) {
            ev = login
            if (ev.type != 'submit') {
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
            <VisualLoginTmpl logo={logo} changeField={this.changeField} loginTo={this.loginTo}
                error={this.props.error} clearError={this.props.clearError}/>
        )
    }
}

import { connect } from 'react-redux'

import  { Action } from '../../actions'
// import VisualLogin from '../visuals/lr/login'

const mapStoreToProps = store => ({
    error: store.session.loginError
})

const mapDispatchToProps = {
    login: Action.login,
    clearError: Action.clearLoginError
}

export default connect(mapStoreToProps, mapDispatchToProps)(VisualLogin)