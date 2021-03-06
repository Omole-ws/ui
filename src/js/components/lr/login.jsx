import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/image.css'
import '../../../../semantic/dist/components/divider.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/message.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import  { Action, Mode } from '../../actions'
import LRForm from './lrform'
import Nav from '../nav/nav'
import logo from '../../../img/logo.png'

import _ from 'lodash'

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: ''
        }
    }

    static propTypes = {
        error:      PropTypes.string,
        lang:      PropTypes.string,
        disclaimer:      PropTypes.object,
        login:      PropTypes.func.isRequired,
        clearError: PropTypes.func.isRequired,
        getDiaclaimer: PropTypes.func.isRequired
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
     * @arg {string} [login] accaunt name
     * @arg {string} [password] accaunt password
     * @arg {Object} ev submit event that have triggered login action
     * @return {void}
     */
    loginTo = (login, password, ev) => {
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

    componentWillMount() {
        if (!this.props.disclaimer.isFetching) {
            this.props.getDiaclaimer(this.props.lang)
        }
    }

    render() {
        const formProps = {
            onSubmit: this.loginTo,
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
                            <div className="content">Log-in to your account</div>
                        </h2>
                        <LRForm {...formProps}/>
                    </div></div>
                    <div className="ui horizontal divider">NEW TO US?</div>
                    <div className="ui two column very relaxed row">
                        <div className="column">
                            <button className="ui blue fluid massive button" onClick={ev => this.loginTo('demo', 'demo', ev)}>
                                Try DEMO
                            </button>
                        </div>
                        <div className="ui vertical divider">OR</div>
                        <div className="column">
                            <div className="ui olive message">
                                If You need data persistance <br/>
                                <a href="#!/registration">Sign Up</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui segment" dangerouslySetInnerHTML={ {__html: this.props.disclaimer.value} } />
                    </div>
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
    return {
        error: state.session.loginError,
        lang: state.globall.lang,
        disclaimer: state.globall.disclaimer
    }
}

const mapDispatchToProps = {
    login: Action.login,
    clearError: Action.clearLoginError,
    getDiaclaimer: Action.getDiaclaimer
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
