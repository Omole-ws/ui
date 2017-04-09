/* global $ */

import '../../../../semantic/dist/components/rail.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/sidebar.css'
import '../../../../semantic/dist/components/sidebar'
import '../../../../semantic/dist/components/sticky.css'
import '../../../../semantic/dist/components/sticky'
import '../../../../semantic/dist/components/message.css'
import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/rail.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import MessageTmpl from './message.jade'

class MessageCenter extends React.Component {

    // constructor(props) {
        // super(props)
        // this.activate = () => this._activate()
        // props.setRef(this)
    // }

    static propTypes = {
        onScreen: React.PropTypes.bool.isRequired,
        messages: React.PropTypes.arrayOf(React.PropTypes.shape({
            type: React.PropTypes.string.isRequired,
            msg: React.PropTypes.string.isRequired
        })).isRequired,
        hide: React.PropTypes.func.isRequired
    }

    static icon = {
        success: 'sun',
        info: 'circle info',
        warning: 'circle warning',
        error: 'ban'
    }
    // componentsDidUpdate() {
    //     this.activate()
    // }

    // _activate() {
    // }
    componentDidMount() {
        $(this.ref)
        .sidebar({
            context: this.context,
            dimPage: false,
            transition: 'overlay',
            onHide: () => this.props.onScreen && this.props.hide()
        })
    }

    componentDidUpdate() {
        if (this.props.onScreen) {
            $(this.ref)
            .sidebar('show')
            .css({padding: '5px 5px 15px'})
        } else {
            $(this.ref)
            .sidebar('hide')
        }
    }

    render() {
        return (
            <div ref={r => this.context = r} className="pushable mcenter">
                <div ref={r => this.ref = r} className="ui right sidebar black segment">
                    {
                        this.props.messages.map((m, i) =>
                            <MessageTmpl key={i} type={m.type} icons={MessageCenter.icon}>
                                {m.msg}
                            </MessageTmpl>
                        )
                    }
                </div>
                <div className=" pusher"></div>
            </div>
        )
    }
}


function mapStateToProps(store) {
    return {
        onScreen: store.mcenter.onScreen,
        messages: store.mcenter.messages
    }
}

const mapDispatchToProps = {
    hide: Action.hideMessageCenter
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageCenter)
