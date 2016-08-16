import '../../../semantic/dist/components/container.css'

import React from 'react'
import { connect } from 'react-redux'

import { Mode } from '../actions'

import GenError from './errors/gen-error'

import loadTaskmanView from 'promise?bluebird!./taskmanager/taskmanager'
import loadLoginView from 'promise?bluebird!./lr/login'
import loadRegistrationView from 'promise?bluebird!./lr/registration'
import loadListView from 'promise?bluebird!./list/list'
import loadOperateView from 'promise?bluebird!./operate/operate'
import loadReportsView from 'promise?bluebird!./reports/reports'

// TODO: remove debug
import taskmanView from './taskmanager/taskmanager'
import loginView from './lr/login'
import registrationView from './lr/registration'
import listView from './list/list'
import operateView from './operate/operate'
import reportsView from './reports/reports'
// TODO: debug end


class Root extends React.Component {

    constructor(props) {
        super(props)
        this.state = {mainView: null}
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired,
    }

    static modeViewLoaders = {
        [Mode.TASKMAN]: loadTaskmanView,
        [Mode.LOGIN]: loadLoginView,
        [Mode.REGISTRATION]: loadRegistrationView,
        [Mode.LIST]: loadListView,
        [Mode.OPERATE]: loadOperateView,
        [Mode.REPORTS]: loadReportsView
    }
    // TODO: remove debug
    static debugModeViews = {
        [Mode.TASKMAN]: taskmanView,
        [Mode.LOGIN]: loginView,
        [Mode.REGISTRATION]: registrationView,
        [Mode.LIST]: listView,
        [Mode.OPERATE]: operateView,
        [Mode.REPORTS]: reportsView
    }
    // TODO: debug end

    componentWillMount() {
        // Root.modeViewLoaders[this.props.mode]().then(view => this.setState({mainView: view.default}))
        // TODO: remove debug
        this.setState({mainView: Root.debugModeViews[this.props.mode]})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode !== this.props.mode) {
            // Root.modeViewLoaders[nextProps.mode]().then(view => this.setState({mainView: view.default}))
            // TODO: remove debug
            this.setState({mainView: Root.debugModeViews[nextProps.mode]})
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
                <GenError/>
            </div>
        )
    }
}


//  +-+-+-+-+-+-+-+-+-+
//  |C|O|N|N|E|C|T|E|D|
//  +-+-+-+-+-+-+-+-+-+

function mapStateToProps(state) {
    return {
        mode: state.mode//,
    }
}

export default connect(mapStateToProps)(Root)
