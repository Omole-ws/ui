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
import { connect } from 'react-redux'

import { Action, AlgoInputType, TaskStatus } from '../../actions'
import ResultTmpl from '!jade-react!./result.jade'

class ResultBoard extends React.Component {

    // constructor(props) {
        // super(props)
        // this.activate = () => this._activate()
        // props.setRef(this)
    // }

    static propTypes = {
        children: React.PropTypes.object,
        onScreen: React.PropTypes.bool.isRequired,
        graph: React.PropTypes.object.isRequired,
        algosDef: React.PropTypes.object.isRequired,
        tasks: React.PropTypes.arrayOf(React.PropTypes.object),
        getTaskResults: React.PropTypes.func.isRequired,
        showResults: React.PropTypes.func.isRequired,
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

    _getTaskRepresentation(task) {
        const algo = this.props.algosDef[task.name]
        const repr = { name: task.name }
        if (algo.inputParam === AlgoInputType.GL || algo.inputParam === AlgoInputType.GLFT) {
            repr.label = task.secureLabel.toLowerCase()
        }
        if (algo.inputParam === AlgoInputType.GLFT) {
            repr.from = this.props.graph.nodes.find(n => n.id === task.fromId).label
            repr.to = this.props.graph.nodes.find(n => n.id === task.toId).label
        }

        return repr
    }

    render() {
        return (
            <div ref={r => this.context = r} className="pushable mcenter">
                <div ref={r => this.ref = r} className="ui right sidebar black segment">
                    <small>
                        {
                            this.props.tasks.map(task =>
                                <ResultTmpl key={ task.tid }
                                    task={ task }
                                    tRepr={ this._getTaskRepresentation(task) }
                                    getTaskResults={ this.props.getTaskResults }
                                    showResults={ this.props.showResults}
                                    highlightPath={ this.props.highlightPath }/>
                            )
                        }
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
        graph: state.graphs.list.find(g => g.id === state.currentGraph),
        algosDef: state.algos.definitions,
        tasks: Reflect.ownKeys(state.tasks)
            .filter(tid => state.tasks[tid].status === TaskStatus.TS_COMPLETED)
            .filter(tid => state.tasks[tid].gid === state.currentGraph)
            .map(tid => state.tasks[tid])
    }
}

const mapDispatchToProps = {
    getTaskResults: Action.getTaskResults,
    showResults: Action.showResults,
    highlightPath: Action.highlightPath
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultBoard)
