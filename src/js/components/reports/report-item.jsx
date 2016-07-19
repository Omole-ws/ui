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

import { TaskStatus } from '../../actions'

export default class ReportItem extends React.Component {

    componentWillEnter(fin) {
        $(this.ref).transition('fly right in', fin)
    }

    componentWillLeave(fin) {
        $(this.ref).transition('fly left out', fin)
    }

    static propTypes = {
        task: React.PropTypes.object.isRequired
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
        return (
            <div className="item" ref={r => this.ref = r}>
                <i className="orange file pdf outline icon"></i>
                <div className="content">
                    <div className="header"> { task.name } </div>
                    <div className="meta">
                        <div className="ui small basic label">
                            Time stamp
                            <div className="detail"> { new Date(Number.parseInt(task.ttime)).toString() } </div>
                        </div>
                    </div>
                    <div className="extra">
                        {
                            task.status === TaskStatus.TS_RUNNING || task.status === TaskStatus.TS_START ?
                                <div className="ui indicating progress"
                                    ref={ r => this.progress = r }>
                                    <div className="bar">
                                        <div className="progress"></div>
                                    </div>
                                </div>
                            : ''
                        }
                        {
                            task.status === TaskStatus.TS_COMPLETED ?
                                <a className="ui green compact small basic button"
                                    href={`/app/r/ccgetreport?tid=${task.tid}&repname=${task.results[0]}`}
                                    target="_blank">get</a>
                            : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
