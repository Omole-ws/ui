import React from 'react'

import { TaskStatus } from '../../actions'

export default class Result extends React.Component {

    static propTypes = {
        task: React.PropTypes.object.isRequired,
        taskRepr: React.PropTypes.object.isRequired,
        getTaskResults: React.PropTypes.func.isRequired,
        showResults: React.PropTypes.func.isRequired,
        highlightPath: React.PropTypes.func.isRequired
    }

    render() {
        const task = this.props.task
        const taskRepr = this.props.taskRepr
        return (
            <div className="ui small message">
                <div className="content">
                    <div className="ui header"> { taskRepr.name } </div>
                    {
                        taskRepr.label ?
                            <div>
                                <div className="ui orange label"> { taskRepr.label } </div>
                            </div>
                        : ''
                    }
                    {
                        taskRepr.from ?
                            <div>
                                <div className="ui label"> { taskRepr.from } </div>
                                { '->' }
                                <div className="ui label"> { taskRepr.to } </div>
                            </div>
                        : ''
                    }
                    <div>
                        {
                            task.status !== TaskStatus.TS_LOADED ?
                                <div className="ui small red compact basic button"
                                    onClick={ () => this.props.getTaskResults(task) }>
                                    Load
                                </div>
                            : ''
                        }
                        <div className="ui small red compact basic icon button"
                            onClick={ () => this.props.showResults(task.tid) }>
                            <i className="ui unhide icon"></i>
                        </div>
                        {
                            taskRepr.from ?
                            task.results.map((v,i) =>
                                <div className="ui small black compact basic button"
                                    onClick={ () => this.props.highlightPath(i) }>
                                    { i }
                                </div>
                            )
                            : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
