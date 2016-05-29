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
import RegisterTmpl from '!jade-react!./registration.jade'
import logo from '../../../img/logo.png'

// import _ from 'lodash'
// import cloneDeep from 'lodash-es/cloneDeep'

class Register extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            mail: '',
            password: ''
        }
        this.handleFieldChange = (...args) => this._handleFieldChange(...args)
        this.register = (...args) => this._register(...args)
    }

    static propTypes = {
        error:      React.PropTypes.string,
        register:      React.PropTypes.func.isRequired,
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
     * @arg {Object} ev submit event that have triggered login action
     * @return {void}
     */
    _register(ev) {
        this.props.register(this.state)
        ev.preventDefault()
    }

    render() {
        return (
            <div>
                <Nav mode={Mode.LOGIN}/>
                <RegisterTmpl logo={logo} handleFieldChange={this.handleFieldChange} register={this.register}
                    error={this.props.error} clearError={this.props.clearError}/>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return { error: state.session.loginError }
}

const mapDispatchToProps = {
    register: Action.register,
    clearError: Action.clearLoginError
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
