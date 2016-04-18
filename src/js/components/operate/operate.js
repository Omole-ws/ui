// import '../../../../semantic/dist/components/header.css'
// import '../../../../semantic/dist/components/dimmer.css'
// import '../../../../semantic/dist/components/segment.css'
// import '../../../../semantic/dist/components/icon.css'

import React from 'react'

import { Action, Mode } from '../../actions'
import Nav from '../nav/nav'

import Desk from './desk'

class Operating extends React.Component {

    static propTypes = {
        gid:        React.PropTypes.string.isRequired,
        graph:      React.PropTypes.object,
        fetchGraph: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        if (!this.props.graph || !this.props.graph.isFetching) {
            this.props.fetchGraph(this.props.graph ? this.props.graph : {id: this.props.gid, info: {tstamp: 0}} )
        }
        // if (this.props.graph || !this.props.graph.isFetching) {
        //     this.props.fetchGraph(this.props.gid, this.props.graph ? this.props.graph.lastUpdated : null )
        // }
        // this.setState({isFetching: true})
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.gid !== nextProps.gid) {
        //     this.props.fetchGraph(nextProps.gid)
        //     this.setState({isFetching: true})
        // }
        // this.setState({isFetching: nextProps.graph.isFetching})
    }

    render() {
        return (
            <div>
                <Nav mode={Mode.OPERATE}>
                    <a className="item" href="#!/"> List </a>
                </Nav>
                <div id="cytoscape">
                {!this.props.graph || !this.props.graph.isFetching ?
                    <div className="ui active inverted dimmer">
                        <div className="content">
                            <div className="center">
                                <h2 className="ui icon header">
                                    <i className="spinner loading icon"></i>
                                    Loading data....
                                </h2>
                            </div>
                        </div>
                    </div>
                :
                    <h1 className="ui disabled center header"> {this.props.graph.info ? this.props.graph.info.label : ''} </h1>
                }
                </div>
            </div>
        )
        // return (
        //     <div>
        //         <Nav mode={Mode.OPERATE}>
        //             <a className="item" href="#!/"> List </a>
        //         </Nav>
        //         { !this.props.graph || this.props.graph.isFetching ? 
        //             <div className="ui active inverted dimmer">
        //                 <div className="content">
        //                     <div className="center">
        //                         <h2 className="ui icon header">
        //                             <i className="spinner loading icon"></i>
        //                             Loading data....
        //                         </h2>
        //                     </div>
        //                 </div>
        //             </div>
        //         :
        //         <Desk isFetching={this.state.isFetching} graph={this.props.graph}/>
                    
        //         }

        //         <h1 className="ui disabled center header"> {this.props.graph && this.props.graph.info ? this.props.graph.info.label : ''} </h1>
        //     </div>
        // )
    }
}


import { connect } from 'react-redux'

const mapStoreToProps = store => {
    return {
        gid: store.currentGraph,
        graph: store.graphs.list.find(g => g.id === store.currentGraph),
        isFetching: store.graphs.isFetching
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph
}

export default connect(mapStoreToProps, mapDispatchToProps)(Operating)
