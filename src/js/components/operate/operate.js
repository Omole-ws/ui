import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'
import NavAlgo from '../nav/nav-algo'
import MessageCenter from '../mcenter/mcenter'
import ResultBoard from './result-board'
import EditNode from '../editors/edit-node'
import EditEdge from '../editors/edit-edge'
import PrepareTask from './prepare-task'

import Desk from './desk'

class Operating extends React.Component {
    static propTypes = {
        gid:        React.PropTypes.string.isRequired,
        graph: React.PropTypes.object,
        taskPending: React.PropTypes.bool.isRequired,
        getGraph: React.PropTypes.func.isRequired,
        toggleResultBoard: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        if (!this.props.graph || !this.props.graph.isFetching) {
            this.props.getGraph(this.props.graph ? this.props.graph : {id: this.props.gid})
        }
    }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                    <NavAlgo/>
                    <a className="item" href={`#!/${this.props.gid}/reports`}>Reports view...</a>
                    {/*<div className="ui right inverted menu">*/}
                    <div right className="ui link item" onClick={this.props.toggleResultBoard}>
                        <i className="ui icons">
                            <i className="ui calculator icon"></i>
                            {
                                this.props.taskPending ? <i className="ui blue corner circle icon"></i> : null
                            }
                        </i>
                    </div>
                    {/*</div>*/}
                </Nav>
                <EditNode/>
                <EditEdge/>
                <PrepareTask/>
                {
                    this.props.graph && !this.props.graph.isFetching && this.props.graph.nodes instanceof Array ?
                        <ResultBoard>
                            <Desk gid={ this.props.gid } graph={ this.props.graph }/>
                        </ResultBoard>
                    :
                    null
                }
            </div>
        )
    }
}

//  +-+-+-+-+-+-+-+
//  |c|o|n|n|e|c|t|
//  +-+-+-+-+-+-+-+

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
