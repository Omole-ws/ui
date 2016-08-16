/* global $ */

import '../../../../semantic/dist/components/rail.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/sidebar.css'
import '../../../../semantic/dist/components/sidebar'
import '../../../../semantic/dist/components/sticky.css'
import '../../../../semantic/dist/components/sticky'
import '../../../../semantic/dist/components/message.css'
import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/rail.css'

import React from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action, AlgoInputType, TaskStatus } from '../../actions'
import TaskItem from '../taskmanager/task-item'

class ResultBoard extends React.Component {

    static propTypes = {
        children: React.PropTypes.object,
        onScreen: React.PropTypes.bool.isRequired,
        graph: React.PropTypes.object,
        algosDef: React.PropTypes.object.isRequired,
        tasks: React.PropTypes.arrayOf(React.PropTypes.object),
        getTaskResults: React.PropTypes.func.isRequired,
        showResults: React.PropTypes.func.isRequired,
        hideResults: React.PropTypes.func.isRequired,
        highlightPath: React.PropTypes.func.isRequired
    }

    static icon = {
        success: 'sun',
        info: 'circle info',
        warning: 'circle warning',
        error: 'ban'
    }

    componentDidMount() {
        $(this.ref)
        .sidebar({
            context: this.context,
            dimPage: false,
            transition: 'overlay'
            // onHide: () => this.props.onScreen && this.props.hide()
        })
    }

    componentDidUpdate() {
        if (this.props.onScreen) {
            $(this.ref)
            .sidebar('show')
            .css({ padding: '5px 5px 15px' })
        } else {
            $(this.ref)
            .sidebar('hide')
        }
    }

    _nodeNames(task) {
        const algo = this.props.algosDef[task.name]
        const repr = { name: task.name }
        if (algo.inputParam === AlgoInputType.GL || algo.inputParam === AlgoInputType.GLFT) {
            repr.label = task.secureLabel.toLowerCase()
        }
        if (algo.inputParam === AlgoInputType.GLFT) {
            return [
                this.props.graph.nodes.find(n => n.id === task.fromId).label,
                this.props.graph.nodes.find(n => n.id === task.toId).label
            ]
        } else {
            return undefined
        }
    }

    render() {
        return (
            <div ref={r => this.context = r} className="pushable mcenter">
                <div ref={r => this.ref = r} className="ui right sidebar black segment">
                    <small>
                        <ReactTransitionGroup component="div" className="ui divided items">
                            {
                                this.props.tasks.map(task =>
                                    <TaskItem key={ task.tid }
                                        algosDef={ this.props.algosDef }
                                        task={ task }
                                        getTaskResults={ this.props.getTaskResults }
                                        showResults={ this.props.showResults }
                                        hideResults={ this.props.hideResults }
                                        highlightPath={ this.props.highlightPath }
                                        nodesNames={ this._nodeNames(task) }/>
                                )
                            }
                        </ReactTransitionGroup>
                    </small>
                </div>
                <div className="ui pusher">
                    { this.props.children }
                </div>
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
        onScreen: state.operating.resultBoard.onScreen,
        graph: state.graphs[state.currentGraph],
        algosDef: state.algos.definitions,
        tasks: Reflect.ownKeys(state.tasks)
            .map(tid => state.tasks[tid])
            .filter(task => task.gid === state.currentGraph)
            .filter(task => Reflect.has(state.algos.definitions, task.name))
            .filter(task => task.status === TaskStatus.TS_COMPLETED || task.status === TaskStatus.TS_LOADED || task.status === TaskStatus.TS_NOSOLUTION)
    }
}

const mapDispatchToProps = {
    getTaskResults: Action.getTaskResults,
    showResults: Action.showResults,
    hideResults: Action.hideResults,
    highlightPath: Action.highlightPath
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultBoard)
