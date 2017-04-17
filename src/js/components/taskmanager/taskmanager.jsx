/* global $ */

import '../../../../semantic/dist/components/accordion.css'
import '../../../../semantic/dist/components/accordion'

import React from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action } from '../../actions'

import Nav from '../nav/nav'
import TaskItem from './task-item'

class TaskManager extends React.Component {

    static propTypes = {
        algosDef: React.PropTypes.object.isRequired,
        reportsDef: React.PropTypes.object.isRequired,
        graphs: React.PropTypes.object.isRequired,
        tasks: React.PropTypes.object.isRequired,
        getTaskResults: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        $(this.accordion).accordion()
    }

    componentDidUpdate() {
        $(this.accordion).accordion()
    }

    renderGroup(group) {
        return (
            <div key={ group.name }>
                <div className="active title">
                    <div className="ui large orange header">
                        <i className="dropdown icon"></i>
                        { group.name }
                    </div>
                </div>
                <div className="active content">
                    <ReactTransitionGroup component="div" className="ui divided items">
                        {
                            group.items.map(task => {
                                return <TaskItem key={ task.tid }
                                    algosDef={ this.props.algosDef }
                                    reportsDef={ this.props.reportsDef }
                                    task={ task }
                                    getTaskResults={ this.props.getTaskResults }/>
                            })
                        }
                    </ReactTransitionGroup>
                </div>
            </div>
        )
    }

    render() {
        const groupped = Reflect.ownKeys(this.props.tasks)
        .reduce((res, tid) => {
            const task = this.props.tasks[tid]
            const oldItems = res[task.gid] ? res[task.gid].items : []
            res[task.gid] = {
                name: this.props.graphs[task.gid].label,
                items: [ ...oldItems, task ]
            }
            return res
        }, {})
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                </Nav>
                <div className="ui styled fluid accordion" ref={r => this.accordion = r}>
                    {
                        Reflect.ownKeys(groupped)
                        .map(gid => this.renderGroup(groupped[gid]))
                    }
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
        algosDef: state.algos.definitions,
        reportsDef: state.reports.definitions,
        graphs: state.graphs,
        tasks: state.tasks
    }
}

const mapDispatchToProps = {
    getTaskResults: Action.getTaskResults
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager)
