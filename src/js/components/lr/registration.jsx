import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/divider.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/message.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import  { Action, Mode } from '../../actions'
import Nav from '../nav/nav'
import LRForm from './lrform'
import logo from '../../../img/logo.png'

class Register extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            mail: '',
            password: ''
        }
    }

    static propTypes = {
        error:      PropTypes.string,
        register:      PropTypes.func.isRequired,
        clearError: PropTypes.func.isRequired
    }

    /**
     * Maps form fields to local state
     * @arg {object} ev event triggered
     * @return {void}
     */
    handleFieldChange = ev => {
        this.setState({[ev.target.name]: ev.target.value})
    }

    /**
     * fire async login action
     * @arg {Object} ev submit event that have triggered login action
     * @return {void}
     */
    register = ev => {
        this.props.register(this.state)
        ev.preventDefault()
    }

    render() {
        const formProps = {
            registration: true,
            onSubmit: this.register,
            onFieldChange: this.handleFieldChange,
            error: this.props.error,
            clearError: this.props.clearError
        }
        return (
            <div>
                <Nav mode={Mode.LOGIN}/>
                <div className="ui middle aligned center aligned grid">
                    <div className="row"><div className="column">
                        <h2 className="ui orange image header">
                            <img className="image" src={logo}/>
                            <div className="content"> Register a new account </div>
                        </h2>
                        <LRForm {...formProps}/>
                        <a href="#!/login"> Back to login page </a>
                    </div></div>
                </div>
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
    register: Action.register,
    clearError: Action.clearLoginError
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
