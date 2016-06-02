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
        taskPending: React.PropTypes.bool.isRequired,
        toggleResultBoard: React.PropTypes.func.isRequired
    }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                    <NavAlgo/>
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
                <ResultBoard>
                    <Desk gid={this.props.gid}/>
                </ResultBoard>
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
        taskPending: state.operating.resultBoard.hasNew
    }
}

const mapDispatchToProps = {
    toggleResultBoard: Action.toggleResultBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(Operating)
