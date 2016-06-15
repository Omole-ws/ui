/* global $ */

import '../../../semantic/dist/components/container.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action, Mode } from '../actions'

import loadLoginView from 'promise?bluebird!./lr/login'
import loadRegistrationView from 'promise?bluebird!./lr/registration'
import loadListView from 'promise?bluebird!./list/list'
import loadOperateView from 'promise?bluebird!./operate/operate'
import loadReportsView from 'promise?bluebird!./reports/reports'

import Sync from '../sync'

class Root extends React.Component {

    constructor(props) {
        super(props)
        this.state = {mainView: null}
        this.sync = new Sync(props.tape, props.patchGraph)
        this.sync.run()
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired,
        tape: React.PropTypes.object.isRequired,
        patchGraph: React.PropTypes.func.isRequired
    }

    static modeViewLoaders = {
        [Mode.LOGIN]: loadLoginView,
        [Mode.REGISTRATION]: loadRegistrationView,
        [Mode.LIST]: loadListView,
        [Mode.OPERATE]: loadOperateView,
        [Mode.REPORTS]: loadReportsView
    }

    componentWillMount() {
        Root.modeViewLoaders[this.props.mode]().then(view => this.setState({mainView: view.default}))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode !== this.props.mode) {
            Root.modeViewLoaders[nextProps.mode]().then(view => this.setState({mainView: view.default}))
        }
        if (nextProps.tape !== this.props.tape) {
            this.sync.changeTape(nextProps.tape)
        }
    }

    componentDidMount() {
        if (this.props.mode === Mode.LOGIN || this.props.mode === Mode.REGISTRATION) {
            $('body').css({'background-color': '#fffaf2'})
        } else {
            $('body').css({'background-color': '#fff'})
        }
    }

    componentDidUpdate() {
        if (this.props.mode === Mode.LOGIN || this.props.mode === Mode.REGISTRATION) {
            $('body').css({'background-color': '#fffaf2'})
        } else {
            $('body').css({'background-color': '#fff'})
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.mainView !== this.state.mainView) {
            return true
        }
        return false
    }

    render () {
        let MainView = this.state.mainView || null
        return (
            <div className="ui main text container">
                { MainView ? <MainView/> : null }
            </div>
        )
    }
}


//  +-+-+-+-+-+-+-+-+-+
//  |C|O|N|N|E|C|T|E|D|
//  +-+-+-+-+-+-+-+-+-+

function mapStateToProps(state) {
    return {
        mode: state.mode,
        tape: state.tape
    }
}

const mapDispatchToProps = {
    patchGraph: Action.patchGraph
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
