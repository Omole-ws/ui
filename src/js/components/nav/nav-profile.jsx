import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/loader.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import PropTypes from 'prop-types'


class NavProfile extends React.Component {

    static propTypes = {
        name:                PropTypes.string,
        isFetching:          PropTypes.bool,
        logout:              PropTypes.func.isRequired,
        fetchSessionDetails: PropTypes.func.isRequired
    }

    componentWillMount() {
        if (this.props.name === null && this.props.isFetching !== true) {
            this.props.fetchSessionDetails()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name === null && nextProps.isFetching !== true) {
            nextProps.fetchSessionDetails()
        }
    }

    render() {
        return(
            <div className="ui simple dropdown item">
                <i className="ui orange user icon"/>
                { this.props.name }
                <i className="dropdown icon"/>
                {
                    this.props.isFetching &&
                        <div className="ui active dimmer">
                            <div className="ui small loader"/>
                        </div>
                }
                <div className={`ui vertical menu ${this.props.isFetching ? 'disabled' : ''}`} >
                    <div className="ui link item" onClick={this.props.logout}>
                        <i className="ui sign out icon"/> Logout
                    </div>
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

import { connect } from 'react-redux'
import { Action } from '../../actions'

function mapStateToProps(store) {
    return {
        name: store.session.account.name,
        isFetching: store.session.account.isFetching
    }
}

const mapDispatchToProps = {
    logout: Action.logout,
    fetchSessionDetails: Action.fetchSessionDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(NavProfile)
