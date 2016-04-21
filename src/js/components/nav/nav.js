import '../../../../semantic/dist/components/menu.css'
import '../../../../semantic/dist/components/dropdown.css'
// import '../../../../semantic/dist/components/dropdown.js'
import '../../../../semantic/dist/components/image.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action, Mode } from '../../actions'
import NavTmpl from '!jade-react!./nav.jade'
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

                    // {this.props.mode !== Mode.LOGIN && this.props.mode !== Mode.REGISTRATION ?
                    //     <div className="ui div right inverted menu">
                    //         <div className="ui link item" onClick={() => this.props.showMessageCenter()}>
                    //             <i className="ui large mail icon"></i>
                    //         </div>
                    //         <NavProfile/>
                    //     </div>
                    // :
                    //     null
                    // }
    render() {
        // let menu = this.computeChildren(this.props.mode)
        return (
                <NavTmpl logo={logo} restrict={() => this.props.mode === Mode.LOGIN || this.props.mode === Mode.REGISTRATION}
                    showMC={this.props.showMessageCenter} profile={<NavProfile/>}>
                    {this.props.children}
                </NavTmpl>
        )
    }
}


const mapStoreToProps = (store) => ({
    mode: store.mode
})

const mapDispatchToProps = {
    showMessageCenter: Action.showMessageCenter
}

export default connect(mapStoreToProps, mapDispatchToProps)(Nav)

