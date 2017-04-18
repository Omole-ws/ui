import '../../../semantic/dist/components/container.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Mode } from '../actions'

import GenError from './errors/gen-error'

const loadTaskmanView = () => import('./taskmanager/taskmanager')
const loadLoginView = () => import('./lr/login')
const loadRegistrationView = () => import('./lr/registration')
const loadListView = () => import('./list/list')
const loadOperateView = () => import('./operate/operate')
const loadReportsView = () => import('./reports/reports')
// TODO: remove debug
// import taskmanView from './taskmanager/taskmanager'
// import loginView from './lr/login'
// import registrationView from './lr/registration'
// import listView from './list/list'
// import operateView from './operate/operate'
// import reportsView from './reports/reports'
// TODO: debug end


class Root extends React.Component {

    constructor(props) {
        super(props)
        this.state = {mainView: null}
    }

    static propTypes = {
        mode: PropTypes.string.isRequired,
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
    // static debugModeViews = {
    //     [Mode.TASKMAN]: taskmanView,
    //     [Mode.LOGIN]: loginView,
    //     [Mode.REGISTRATION]: registrationView,
    //     [Mode.LIST]: listView,
    //     [Mode.OPERATE]: operateView,
    //     [Mode.REPORTS]: reportsView
    // }
    // TODO: debug end

    componentWillMount() {
        Root.modeViewLoaders[this.props.mode]().then(view => this.setState({mainView: view.default}))
        // TODO: remove debug
        // this.setState({mainView: Root.debugModeViews[this.props.mode]})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode !== this.props.mode) {
            Root.modeViewLoaders[nextProps.mode]().then(view => this.setState({mainView: view.default}))
            // TODO: remove debug
            // this.setState({mainView: Root.debugModeViews[nextProps.mode]})
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.mainView !== this.state.mainView;

    }

    render () {
        const MainView = this.state.mainView || null
        return (
            <div className="ui main text container">
                { MainView ? <MainView/> : '' }
                <GenError/>
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
        mode: state.mode
    }
}

export default connect(mapStateToProps)(Root)
