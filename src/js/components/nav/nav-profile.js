import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/loader.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'

import NavProfileTmpl from '!jade-react!./nav-profile.jade'

class VisibleNavProfile extends React.Component {

    static propTypes = {
        name:                React.PropTypes.string,
        isFetching:          React.PropTypes.bool,
        logout:              React.PropTypes.func.isRequired,
        fetchSessionDetails: React.PropTypes.func.isRequired
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
            <NavProfileTmpl username={this.props.name} isFetching={this.props.isFetching} logout={this.props.logout}/>
        )
    }
}



//=============

import { connect } from 'react-redux'

import { Action } from '../../actions'

function mapStoreToProps(store) {
    return {
        name: store.session.account.name,
        isFetching: store.session.account.isFetching
    }
}

const mapDispatchToProps = {
    logout: Action.logout,
    fetchSessionDetails: Action.fetchSessionDetails
}

export default connect(mapStoreToProps, mapDispatchToProps)(VisibleNavProfile)



