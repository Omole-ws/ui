import '../../../../semantic/dist/components/menu.css'
import '../../../../semantic/dist/components/dropdown.css'
// import '../../../../semantic/dist/components/dropdown.js'
import '../../../../semantic/dist/components/image.css'

import React from 'react'

import { Mode } from '../../actions'
import NavTmpl from '!jade-react!./nav.jade'
import logo from '../../../img/logo.png'
import NavProfile from './nav-profile'


export default class Nav extends React.Component {

    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.node,
            React.PropTypes.arrayOf(React.PropTypes.node)
        ]),
        mode: React.PropTypes.string.isRequired
    }

    // computeChildren(mode) {
    //     let menu = [<NavProfile key="-1"/>]
    //     switch(mode) {
    //         case Mode.LOGIN:
    //         case Mode.REGISTRATION:
    //             menu = [
    //                 <a key="1" className={`orange item${mode === Mode.LOGIN ? ' active' : ''}`} href="#!/login">
    //                     Sign In
    //                 </a>,
    //                 <a key="2" className={`orange item${mode === Mode.REGISTRATION ? ' active' : ''}`} href="#!/registration">
    //                     Registration
    //                 </a>
    //             ]
    //             break
    //         case Mode.LIST:
    //             menu = [
    //                 <div key="1" className="orange link item" onClick={() => this.props.setCreatingGraph(true)}>
    //                     <i className="add circle icon"></i>
    //                     New
    //                 </div>,
    //                 <div key="2" className="orange link item" onClick={this.props.setCreatingGraph}>
    //                     <i className="add circle icon"></i>
    //                     New
    //                 </div>,
    //                 ...menu
    //             ]
    //             break
    //         case Mode.OPERATE:
    //             menu = [
    //                 <a key="1" className="orange link item" href="#!/"> List </a>,
    //                 ...menu
    //             ]
    //             break
    //     }
    //     // this.setState({menu: menu})
    //     return menu
    // }

    // componentWillMount() {
    //     this.computeChildren(this.props.mode)
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.mode != this.props.mode) {
    //         this.computeChildren(nextProps.mode)
    //     }
    // }
    // shouldComponentUpdate(nextProps) {
        // return nextProps.mode !== this.props.mode
    // }

    render() {
        // let menu = this.computeChildren(this.props.mode)
        return (
                <NavTmpl logo={logo}>
                    {this.props.children}
                    {this.props.mode !== Mode.LOGIN && this.props.mode !== Mode.REGISTRATION ? <NavProfile/> : null}
                </NavTmpl>
        )
    }
}

// // import { connect } from 'react-redux'
// import { Action } from '../../actions'

// const mapStoreToProps = (store) => ({
//     mode: store.mode
// })

// const mapDispatchToProps = {
//     setCreatingGraph: Action.setCreatingGraph
// }

// export default connect(mapStoreToProps, mapDispatchToProps)(Nav)