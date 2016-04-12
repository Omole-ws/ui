import React from 'react'

import NavProfileTmpl from '!jade-react!./nav-profile.jade'

class VisibleNavProfile extends React.Component {

    componentWillMount() {
        if (this.props.name == null) {
            this.props.fetchSessionDetails()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name == null) {
            nextProps.fetchSessionDetails()
        }
    }

    render() {
        return( 
            <NavProfileTmpl username={this.props.name} logout={this.props.logout}/>
        )
    }
}



//=============

import { connect } from 'react-redux'

import { Action } from '../../actions'

const mapStoreToProps = store => {
    return {
        name: store.session.account.name
    }
}

const mapDispatchToProps = {
    logout: Action.logout,
    fetchSessionDetails: Action.fetchSessionDetails
}

export default connect(mapStoreToProps, mapDispatchToProps)(VisibleNavProfile)



