import React from 'react'
import PropTypes from 'prop-types'

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
                        <div className="ui active dimmer"><div className="ui small loader"/></div>
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

import { connect } from 'react-redux'
import { Action, AlgoInputType } from '../../actions'

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
