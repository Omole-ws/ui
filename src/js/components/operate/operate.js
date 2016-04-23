// import '../../../../semantic/dist/components/header.css'
// import '../../../../semantic/dist/components/dimmer.css'
// import '../../../../semantic/dist/components/segment.css'
// import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action, Mode } from '../../actions'
import Nav from '../nav/nav'
import MessageCenter from '../mcenter/mcenter'

import Desk from './desk'

class Operating extends React.Component {

    // constructor(props) {
    //     super(props)

    //     this.state = {isFetching: false}
    // }

    static propTypes = {
        gid:        React.PropTypes.string.isRequired
        // graph:      React.PropTypes.object,
        // fetchGraph: React.PropTypes.func.isRequired
    }

    // componentWillMount() {
    //     if (!this.props.graph || !this.props.graph.isFetching) {
    //         this.props.fetchGraph(this.props.graph ? this.props.graph : {id: this.props.gid, info: {tstamp: 0}} )
    //         this.setState({isFetching: true})
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
        // if (this.props.gid !== nextProps.gid) {
        //     this.props.fetchGraph(nextProps.gid)
        //     this.setState({isFetching: true})
        // }
        // this.setState({isFetching: nextProps.graph.isFetching})
    // }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                </Nav>
                <MessageCenter/>
                <Desk gid={this.props.gid}/>
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


const mapStoreToProps = store => {
    return {
        gid: store.currentGraph
        // graph: store.graphs.list.find(g => g.id === store.currentGraph),
        // isFetching: store.graphs.isFetching
    }
}

// const mapDispatchToProps = {
    // fetchGraph: Action.fetchGraph
// }

export default connect(mapStoreToProps)(Operating)
