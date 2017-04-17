import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../actions'
// import NavAlgoTmpl from './nav-algo.jade'

class NavAlgo extends React.Component {

    static propTypes = {
        gid: PropTypes.string.isRequired,
        algosDef: PropTypes.object,
        isFetching: PropTypes.bool.isRequired,
        taskPrepare: PropTypes.func.isRequired,
        createTask: PropTypes.func.isRequired
    }

    render() {
        return (
            <div className="ui simple dropdown item">
                Algorythms <i className="dropdown icon"/>
                {
                    !this.props.isFetching &&
                        <div className="vertical menu">
                            {
                                Reflect.ownKeys(this.props.algosDef).map(alg =>
                                    <div key={alg} className="item" onClick={() => this.taskPrepare(alg)}>
                                        { `${alg}${this.props.algosDef[alg].inputParam === AlgoInputType.G ? '' : '...'}` }
                                    </div>
                                )
                            }
                        </div>
                        ||
                        <div className="ui active dimmer"><div className="ui small loader"></div></div>
                }
            </div>
        )
    }

    taskPrepare(algoName) {
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
    taskPrepare: Action.taskPrepare,
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(NavAlgo)
