import React from 'react'
import PropTypes from 'prop-types'

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
                        <div className="ui active dimmer"><div className="ui small loader"/></div>
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

import { connect } from 'react-redux'
import { Action, AlgoInputType } from '../../actions'

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
