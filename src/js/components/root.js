import '../../../semantic/dist/components/container.css'

import React from 'react'
import { connect } from 'react-redux'

import { Mode } from '../actions'
// import Nav from './nav/nav'
// import Login from './lr/login'
import loadLoginView from 'promise?bluebird!./lr/login'
import loadListView from 'promise?bluebird!./list/list'
import loadOperateView from 'promise?bluebird!./operate/operate'

class Root extends React.Component {

    constructor(props) {
        super(props)
        this.state = {mainView: null}
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired
    }

    static modeViewLoaders = {
        [Mode.LOGIN]: loadLoginView,
        [Mode.LIST]: loadListView,
        [Mode.OPERATE]: loadOperateView
    }

    componentWillMount() {
        Root.modeViewLoaders[this.props.mode]().then(view => this.setState({mainView: view.default}))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode !== this.props.mode) {
            Root.modeViewLoaders[nextProps.mode]().then(view => this.setState({mainView: view.default}))
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


// ===================  CONNECTED ======== 

const mapStoreToProps = store => {
    return {
        mode: store.mode
    }
}

export default connect(mapStoreToProps)(Root)
