import React from 'react'
import { connect } from 'react-redux'

import Nav from '../nav/nav'
import NavAlgo from '../nav/nav-algo'
import MessageCenter from '../mcenter/mcenter'
import EditNode from '../editors/edit-node'
import EditEdge from '../editors/edit-edge'

import Desk from './desk'

class Operating extends React.Component {
    static propTypes = {
        gid:        React.PropTypes.string.isRequired
    }

    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                    <NavAlgo/>
                </Nav>
                <MessageCenter/>
                <EditNode/>
                <EditEdge/>
                <Desk gid={this.props.gid}/>
            </div>
        )
    }
}


const mapStoreToProps = store => {
    return {
        gid: store.currentGraph
    }
}

export default connect(mapStoreToProps, null)(Operating)
