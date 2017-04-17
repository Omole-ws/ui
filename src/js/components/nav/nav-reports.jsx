import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../actions'

class NavReports extends React.Component {

    static propTypes = {
        gid: PropTypes.string.isRequired,
        reportsDef: PropTypes.object,
        isFetching: PropTypes.bool.isRequired,
        createTask: PropTypes.func.isRequired
    }

    render() {
        return (
            <div className="ui simple dropdown item">
                Reports <i className="dropdown icon"/>
                {
                    !this.props.isFetching &&
                        <div className="vertical menu">
                            {
                                Reflect.ownKeys(this.props.reportsDef).map(rep =>
                                    <div key={rep} className="item" onClick={() => this.reportPrepare(rep)}>
                                        { `${rep}${this.props.reportsDef[rep].inputParam === AlgoInputType.G ? '' : '...'}` }
                                    </div>
                                )
                            }
                        </div>
                        ||
                        <div className="ui active dimmer"><div className="ui small loader"></div></div>
                }
            </div>
        )
    }

    reportPrepare(reportName) {
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
