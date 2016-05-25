import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import NavAlgoTmpl from '!jade-react!./nav-algo.jade'

class NavAlgo extends React.Component {
    constructor(props) {
        super(props)
        this.prepareTask = algo => this._prepareTask(algo)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        algosDef: React.PropTypes.array,
        isFetchingAlgosDef: React.PropTypes.bool.isRequired,
        algosFetchDef: React.PropTypes.func.isRequired,
        prepareTask: React.PropTypes.func.isRequired,
        createTask: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.algosFetchDef()
    }

    render() {
        return <NavAlgoTmpl isFetching={this.props.isFetchingAlgosDef} algos={this.props.algosDef} prepareTask={this.prepareTask}/>
    }

    _prepareTask(algo) {
        if (algo.inputParam === 'INPUT_GID') {
            this.props.createTask({algo, params: {gid: this.props.gid}})
        } else {
            this.props.prepareTask(algo)
        }
    }
}


function mapStoreToProps(store) {
    return {
        gid: store.currentGraph,
        algosDef: store.algos.definitions,
        isFetchingAlgosDef: store.algos.isFetching
    }
}

const mapDispatchToProps = {
    algosFetchDef: Action.algosFetchDef,
    prepareTask: Action.prepareTask,
    createTask: Action.createTask
}

export default connect(mapStoreToProps, mapDispatchToProps)(NavAlgo)
