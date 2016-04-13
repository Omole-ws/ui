// import '../../../../semantic/dist/components/header.css'
// import '../../../../semantic/dist/components/dimmer.css'
// import '../../../../semantic/dist/components/segment.css'
// import '../../../../semantic/dist/components/icon.css'

import React from 'react'

import { Action } from '../../actions'

import Desk from './desk'

class Operating extends React.Component {

    static propTypes = {
        gid:        React.PropTypes.string.isRequired,
        graph:      React.PropTypes.object.isRequired,
        fetchGraph: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        if (this.props.graph === undefined || !this.props.graph.isFetching) {
            this.props.fetchGraph(this.props.gid, this.props.graph ? this.props.graph.lastUpdated : null )
        }
        this.setState({isFetching: true})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.gid !== nextProps.gid) {
            this.props.fetchGraph(nextProps.gid)
            this.setState({isFetching: true})
        }
        this.setState({isFetching: nextProps.graph.isFetching})
    }

    render() {
        return (
            <div>
                <Desk isFetching={this.state.isFetching} graph={this.props.graph}/>
                <h1 className="ui disabled center header"> {this.props.graph && this.props.graph.info ? this.props.graph.info.label : ''} </h1>
            </div>
        )
    }
}


import { connect } from 'react-redux'

const mapStoreToProps = store => {
    return {
        gid: store.currentGraph,
        graph: store.graphs.lmap.get(store.currentGraph)
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph
}

export default connect(mapStoreToProps, mapDispatchToProps)(Operating)
