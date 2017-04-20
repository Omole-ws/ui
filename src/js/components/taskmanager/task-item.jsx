/* global $ */

import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/label.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/loader.css'
import '../../../../semantic/dist/components/transition.css'
import '../../../../semantic/dist/components/transition'
import '../../../../semantic/dist/components/progress.css'
import '../../../../semantic/dist/components/progress'

import React from 'react'
import PropTypes from 'prop-types'

import { TaskStatus } from '../../actions'

export default class TaskItem extends React.Component {

    componentWillEnter(fin) {
        $(this.ref).transition('fly right in', fin)
    }

    componentWillLeave(fin) {
        $(this.ref).transition('fly left out', fin)
    }

    static propTypes = {
        algosDef: PropTypes.object,
        reportsDef: PropTypes.object,
        task: PropTypes.object.isRequired,
        nodesNames: PropTypes.array,
        getTaskResults: PropTypes.func,
        showResults: PropTypes.func,
        hideResults: PropTypes.func,
        highlightPath: PropTypes.func
    }

    componentDidMount() {
        const task = this.props.task
        if (task.status === TaskStatus.TS_RUNNING || task.status === TaskStatus.TS_START) {
            $(this.progress).progress({ percent: this.props.task.procent })
        }
    }

    componentDidUpdate() {
        const task = this.props.task
        if (task.status === TaskStatus.TS_RUNNING || task.status === TaskStatus.TS_START) {
            $(this.progress).progress({ percent: this.props.task.procent })
        }
    }

    render() {
        const task = this.props.task
        let icoColor
        switch (task.status) {
            case TaskStatus.TS_RUNNING:
                icoColor = 'orange'
                break
            case TaskStatus.TS_COMPLETED:
                icoColor = 'green'
                break
            case TaskStatus.TS_LOADED:
                icoColor = 'blue'
                break
            case TaskStatus.TS_NOSOLUTION:
                icoColor = 'grey'
                break
            case TaskStatus.TS_ERROR:
                icoColor = 'red'
                break
            default:
                icoColor = ''
        }
        let resultsLoad
        if (task.results && task.results.length > 0) {
            if (this.props.getTaskResults && Reflect.has(this.props.algosDef, task.name)) {
                resultsLoad = <div className="ui small green compact basic button"
                    onClick={ () => this.props.getTaskResults(task) }>
                    Load
                </div>
            } else {
                resultsLoad = <a className="ui green compact small basic button"
                    href={`/app/r/ccgetreport?tid=${task.tid}&repname=${task.results[0]}`}
                                  target="_blank">
                    <i className="ui file pdf outline icon"></i>
                    Download
                </a>
            }
        }
        return (
            <div className={ `ui item dimmable${task.status === TaskStatus.TS_NOSOLUTION ? ' dimmed' : ''}` }
                ref={ r => this.ref = r }>
                <i className={`${icoColor} rocket icon`}></i>
                <div className="content">
                    <div className="ui tiny header"> { task.name } </div>
                    <div className="meta">
                        <div className="ui mini basic label">
                            { new Date(Number.parseInt(task.ttime)).toString() }
                        </div>
                        {
                            task.secureLabel ?
                                <div className="ui mini orange basic label">
                                    {
                                        this.props.nodesNames ?
                                        `${this.props.nodesNames[0]} -> ${this.props.nodesNames[1]}`
                                        : ''
                                    } by { task.secureLabel.toUpperCase() }
                                </div>
                            : ''
                        }
                    </div>
                    { task.desc }
                    <div className="extra">
                        {
                            task.status === TaskStatus.TS_RUNNING ?
                                <div className="ui indicating progress"
                                    ref={ r => this.progress = r }>
                                    <div className="bar">
                                        <div className="progress"></div>
                                    </div>
                                </div>
                            : ''
                        }
                        {
                            task.status === TaskStatus.TS_COMPLETED ? resultsLoad : ''
                        }
                        {
                            task.status === TaskStatus.TS_LOADED && this.props.showResults ?
                            (
                            task.onScreen ?
                                <div className="ui small blue compact basic icon button"
                                    onClick={ () => this.props.hideResults(task.tid) }>
                                    <i className="ui hide icon"></i>
                                </div>
                            :
                                <div className="ui small blue compact basic icon button"
                                    onClick={ () => this.props.showResults(task.tid) }>
                                    <i className="ui unhide icon"></i>
                                </div>
                            )

                            : ''
                        }
                        {
                            task.status === TaskStatus.TS_LOADED && task.onScreen === 'p' ?
                            task.results.map((v,i) =>
                                <div key={i} className="ui small black compact basic button"
                                    onClick={ () => this.props.highlightPath(i) }>
                                    { i }
                                </div>
                            )
                            : ''
                        }

                    </div>
                </div>
                <div className="ui simple inverted dimmer"></div>
            </div>
        )
    }
}
