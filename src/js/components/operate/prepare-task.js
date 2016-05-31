/* global $ */
import '../../../../semantic/dist/components/card.css'
import '../../../../semantic/dist/components/checkbox.css'
import '../../../../semantic/dist/components/checkbox.js'

import _ from 'lodash'

import React from 'react'
import { connect } from 'react-redux'

import { Action, DeskMode } from '../../actions'
import PrepareTaskTmpl from '!jade-react!./prepare-task.jade'

class PrepareTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'READ',
            quater: 1
        }
        this.snapTo = q => this._snapTo(q)
        this.handleFieldChange = e => this._handleFieldChange(e)
    }
    static propTypes = {
        onScreen: React.PropTypes.bool.isRequired,
        title: React.PropTypes.string,
        kind: React.PropTypes.string,
        from: React.PropTypes.shape({
            id: React.PropTypes.string,
            name: React.PropTypes.string
        }),
        to: React.PropTypes.shape({
            id: React.PropTypes.string,
            name: React.PropTypes.string
        }),
        cancel: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        $(this.ref)
            .find('.ui.radio.checkbox')
            .checkbox()
    }


    render() {
        if (!this.props.onScreen) {
            return null
        }
        return <PrepareTaskTmpl setRef = { r => this.ref = r }
            snapTo = { this.snapTo }
            handleFieldChange = { this.handleFieldChange }
            cancel = { this.props.cancel }
            label = { this.state.label }
            quater = { this.state.quater }
            title = { this.props.title }
            kind = { this.props.kind }
            fromName = { this.props.from.name }
            toName = { this.props.to.name } />
    }

    _snapTo(quater) {
        this.setState({ quater })
    }

    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }
}

//  +-+-+-+-+-+-+-+
//  |c|o|n|n|e|c|t|
//  +-+-+-+-+-+-+-+

function mapStateToProps(state) {
    return {
        // gr
        onScreen: state.pendingAlgo.onScreen,
        title: state.pendingAlgo.title,
        kind: state.pendingAlgo.kind,
        from: state.pendingAlgo.from,
        to: state.pendingAlgo.to
    }
}

const mapDispatchToProps = {
    cancel: Action.cancelTaskPrepare
}

export default connect(mapStateToProps, mapDispatchToProps)(PrepareTask)
