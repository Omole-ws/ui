import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import NavAlgoTmpl from '!jade-react!./nav-algo.jade'

class NavAlgo extends React.Component {
    constructor(props) {
        super(props)
        this.taskPrepare = algo => this._taskPrepare(algo)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        algosDef: React.PropTypes.array,
        isFetchingAlgosDef: React.PropTypes.bool.isRequired,
        algosFetchDef: React.PropTypes.func.isRequired,
        taskPrepare: React.PropTypes.func.isRequired,
        createTask: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.algosFetchDef()
    }

    render() {
        return <NavAlgoTmpl isFetching={this.props.isFetchingAlgosDef} algos={this.props.algosDef} taskPrepare={this.taskPrepare}/>
    }

    _taskPrepare(algo) {
        if (algo.inputParam === 'INPUT_GID') {
            this.props.createTask({algo, params: {gid: this.props.gid}})
        } else {
            this.props.taskPrepare(algo)
        }
    }
}


function mapStateToProps(state) {
    return {
        gid: state.currentGraph,
        algosDef: state.algos.definitions,
        isFetchingAlgosDef: state.algos.isFetching
    }
}

const mapDispatchToProps = {
    algosFetchDef: Action.algosFetchDef,
    taskPrepare: Action.taskPrepare,
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(NavAlgo)
