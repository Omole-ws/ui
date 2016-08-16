import React from 'react'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../actions'
import NavAlgoTmpl from '!jade-react!./nav-algo.jade'

class NavAlgo extends React.Component {
    constructor(props) {
        super(props)
        this.taskPrepare = aName => this._taskPrepare(aName)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        algosDef: React.PropTypes.object,
        isFetching: React.PropTypes.bool.isRequired,
        // algosFetchDef: React.PropTypes.func.isRequired,
        taskPrepare: React.PropTypes.func.isRequired,
        createTask: React.PropTypes.func.isRequired
    }

    // componentWillMount() {
    //     this.props.algosFetchDef()
    // }

    render() {
        return <NavAlgoTmpl
            isFetching={this.props.isFetching}
            aNames={this.props.isFetching ? [] : Reflect.ownKeys(this.props.algosDef)}
            isShort={an => this.props.algosDef[an].inputParam === AlgoInputType.G}
            taskPrepare={this.taskPrepare}/>
    }

    _taskPrepare(algoName) {
        const algo = this.props.algosDef[algoName]
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
        isFetching: state.algos.isFetching
    }
}

const mapDispatchToProps = {
    // algosFetchDef: Action.algosFetchDef,
    taskPrepare: Action.taskPrepare,
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(NavAlgo)
