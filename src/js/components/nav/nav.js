import '../../../../semantic/dist/components/menu.css'
import '../../../../semantic/dist/components/dropdown.css'
// import '../../../../semantic/dist/components/dropdown.js'
import '../../../../semantic/dist/components/image.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action, Mode } from '../../actions'
import logo from '../../../img/logo.png'
import NavProfile from './nav-profile'


class Nav extends React.Component {

    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.node,
            React.PropTypes.arrayOf(React.PropTypes.node)
        ]),
        mode: React.PropTypes.string.isRequired,
        showMessageCenter: React.PropTypes.func.isRequired
    }

    static splitChildren(children) {
        let left = [], right = []
        if (children) {
            if (!Array.isArray(children)) {
                if (children.props.right) {
                    right = [children]
                } else {
                    left = [children]
                }
            } else {
                left = children
                    .filter(e => !e.props.right)
                    .map((e, i) => ({ ...e, key: i }))
                right = children
                    .filter(e => e.props.right)
                    .concat(
                        <a className="item" href="#!/tm">Task Manager</a>,
                        <NavProfile/>
                    )
                    .map((e, i) => ({ ...e, key: i }))
            }
        }
        return [ left, right ]
    }

    render() {
        const  [ leftChildren, rightChildren ] = Nav.splitChildren(this.props.children)
        return (
            <div className="ui menu top fixed inverted">
                <a className="item header" href="/">
                    <img className="logo" src={logo}/>&nbsp;&nbsp;OMOLE
                </a>
                {leftChildren}
                {
                    this.props.mode !== Mode.LOGIN && this.props.mode !== Mode.REGISTRATION &&
                        <div className="ui right inverted menu">
                            {rightChildren}
                        </div>
                }
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

function mapStateToProps(state) {
    return { mode: state.mode }
}

const mapDispatchToProps = {
    showMessageCenter: Action.showMessageCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
