import React from 'react'
import PropTypes from 'prop-types'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'
import NavReports from '../nav/nav-reports'
// import ReporItem from './report-item'
import TaskItem from '../taskmanager/task-item'

class Reports extends React.Component {
    static propTypes = {
        gid: PropTypes.string.isRequired,
        graph: PropTypes.object,
        tape: PropTypes.array,
        reports: PropTypes.object.isRequired,
        rtasks: PropTypes.arrayOf(PropTypes.object),
        createTask: PropTypes.func.isRequired
    }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                    <NavReports/>
                    <a className="item" href={`#!/${this.props.gid}/operate`}> Graph view... </a>
                </Nav>
                <h1 className={`ui disabled center alligned ${this.props.tape && this.props.tape.length > 0 ? 'red' : 'green'} header`}>
                    { this.props.graph && this.props.graph.label }
                </h1>
                <ReactTransitionGroup component="div"
                    className={'ui divided items'}>
                    {
                        this.props.rtasks.map(task => {
                            return <TaskItem key={ task.tid } task={ task }/>
                        })
                    }
                </ReactTransitionGroup>
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
        tape: state.tapes[state.currentGraph],
        reports: state.reports.definitions,
        rtasks: Reflect.ownKeys(state.tasks)
            .map(tid => state.tasks[tid])
            .filter(task => task.gid === state.currentGraph)
            .filter(task => Reflect.has(state.reports.definitions, task.name))
    }
}

const mapDispatchToProps = {
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
