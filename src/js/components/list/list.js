import '../../../../semantic/dist/components/item.css'
import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'

// import ListItem from './list-item'

import ListItem from '!jade-react!./list-item.jade'

class ListView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    static propTypes = {
        list:           React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        isFetching:     React.PropTypes.bool.isRequired,
        fetchGraphList: React.PropTypes.func.isRequired,
        changeCSRF:     React.PropTypes.func.isRequired
    }

    componentWillMount() {
        if (!this.props.isFetching) {
            this.props.fetchGraphList()
        }
    }

    render() {
        const L = this.props.list.map(g => {
            // return <li key={g.id}>{g.info.label}</li>
            return <ListItem key={g.id} id={g.id} hdr={g.info.label} desc={g.info.comment}/>
        })
        return(
            <div>
                <h1> List view </h1>
                <div className="ui divided items">
                    {L}
                </div>
            </div>
        )
    }
}
ListView.defaultProps = {list:[], isFetching: false}


import { connect } from 'react-redux'
import { Action } from '../../actions'

const mapStoreToProps = store => {
    return {
        list: store.graphs.list,
        isFetching: store.graphs.isFetching
    }
}

const mapDispatchToProps = {
    changeCSRF: Action.changeCSRF,
    fetchGraphList: Action.fetchGraphsList
}

export default connect(mapStoreToProps, mapDispatchToProps)(ListView)