import React from 'react'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../actions'
import NavReportsTmpl from './nav-reports.jade'

class NavReports extends React.Component {
    constructor(props) {
        super(props)
        this.reportPrepare = rName => this._reportPrepare(rName)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        reportsDef: React.PropTypes.object,
        isFetching: React.PropTypes.bool.isRequired,
        createTask: React.PropTypes.func.isRequired
    }

    render() {
        return <NavReportsTmpl
            isFetching={this.props.isFetching}
            rNames={this.props.isFetching ? [] : Reflect.ownKeys(this.props.reportsDef)}
            isShort={rn => this.props.reportsDef[rn].inputParam === AlgoInputType.G}
            reportPrepare={this.reportPrepare}/>
    }

    _reportPrepare(reportName) {
        const report = this.props.reportsDef[reportName]
        if (report.inputParam === 'INPUT_GID') {
            this.props.createTask({algo: report, params: {gid: this.props.gid}})
        } else {
            // TODO: Here should go launching form for report
            console.log('Reports with parameters still unimplemented')
        }
    }
}


function mapStateToProps(state) {
    return {
        gid: state.currentGraph,
        reportsDef: state.reports.definitions,
        isFetching: state.reports.isFetching
    }
}

const mapDispatchToProps = {
    createTask: Action.createTask
}

export default connect(mapStateToProps, mapDispatchToProps)(NavReports)
