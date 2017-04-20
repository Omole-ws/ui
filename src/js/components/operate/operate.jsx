import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'
import NavAlgo from '../nav/nav-algos'
import ResultBoard from './result-board'
import EditNode from '../editors/edit-node'
import EditEdge from '../editors/edit-edge'
import PrepareTask from './prepare-task/prepare-task'

import Desk from './desk/desk'

class Operating extends React.Component {
    static propTypes = {
        gid:        PropTypes.string.isRequired,
        graph: PropTypes.object,
        taskPending: PropTypes.bool.isRequired,
        getGraph: PropTypes.func.isRequired,
        toggleResultBoard: PropTypes.func.isRequired
    }

    componentDidMount() {
        if (!this.props.graph || !this.props.graph.isFetching) {
            // this.props.getGraph(this.props.graph ? this.props.graph : {id: this.props.gid})
            this.props.getGraph({...this.props.graph, id: this.props.gid})
        }
    }

    render() {
        const ResultBoardBT = <div className="ui link item" onClick={this.props.toggleResultBoard}>
            <i className="ui icons">
                <i className="ui calculator icon"/>
                {
                    this.props.taskPending ? <i className="ui blue corner circle icon"/> : null
                }
            </i>
        </div>

        return (
            <div>
                <Nav toRight={ResultBoardBT}>
                    <a className="item" href="#!/"> List </a>
                    <NavAlgo/>
                    <a className="item" href={`#!/${this.props.gid}/reports`}>Reports view...</a>
                </Nav>
                <EditNode/>
                <EditEdge/>
                <PrepareTask/>
                {
                    (this.props.graph && !this.props.graph.isFetching && this.props.graph.nodes instanceof Array) &&
                        <ResultBoard>
                            <Desk gid={ this.props.gid } graph={ this.props.graph }/>
                        </ResultBoard>
                }
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
        gid: state.currentGraph,
        graph: state.graphs[state.currentGraph],
        taskPending: state.operating.resultBoard.hasNew
    }
}

const mapDispatchToProps = {
    getGraph: Action.getGraph,
    toggleResultBoard: Action.toggleResultBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(Operating)
