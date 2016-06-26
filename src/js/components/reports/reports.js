import React from 'react'
import { connect } from 'react-redux'

import { Action, TaskStatus } from '../../actions'
import Nav from '../nav/nav'

class Reports extends React.Component {
    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        graph: React.PropTypes.object,
        reports: React.PropTypes.object.isRequired,
        tasks: React.PropTypes.arrayOf(React.PropTypes.object),
        createTask: React.PropTypes.func.isRequired
    }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                    <a className="item" href={`#!/${this.props.gid}/operate`}> Operate... </a>
                </Nav>
                <div>
                    {
                        Reflect.ownKeys(this.props.reports)
                        .map(rid => this.props.reports[rid])
                        .map(report =>
                            <button key={ report.name } onClick={ () => this.props.createTask({ algo: report, params: { gid: this.props.gid }}) }>
                                {report.name}
                            </button>
                        )
                    }
                </div>
                <div>
                    {
                        this.props.tasks.map(task =>
                            <div>
                                <h5>{ task.tid }</h5>
                                <br/>
                                <em>{ `${task.status} > compleated: ${task.procent}%` }</em>
                                {
                                    task.status === TaskStatus.TS_COMPLETED ?
                                        <a href={`/app/r/ccgetreport?tid=${task.tid}&repname=${task.result[0]}`} target="_blank">get</a> : ''
                                }
                            </div>
                        )
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
        gid: state.currentGraph,
        graph: state.graphs[state.currentGraph],
        reports: state.reports.definitions,
        tasks: Reflect.ownKeys(state.tasks)
            .map(tid => state.tasks[tid])
            .filter(task => Reflect.has(state.reports.definitions, task.name))
    }
}

const mapDispatchToProps = {
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
// export default connect(mapStateToProps, mapDispatchToProps)(Reports)
