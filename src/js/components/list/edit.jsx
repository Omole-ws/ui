import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/modal.css'
import '../../../../semantic/dist/components/modal'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/transition.css'
import '../../../../semantic/dist/components/transition'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/input.css'

import React from 'react'
// import { connect } from 'react-redux'

import { Action } from '../../actions'
import EditTmpl from '!jade-react!./edit.jade'

export default class Edit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {graph: {info: {label: '', comment: '', tstamp: ''}}}
        this.reset = () => this._reset()
        this.setRref = r => this._setRref(r)
        this.activate = toEdit => this._activate(toEdit)
        this.show = () => this._show()
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
        this.cancel = () => this._cancel()
    }

    static propTypes ={
        save: React.PropTypes.func.isRequired
    }

    _reset() {
        this.setState({graph: {info: {label: '', comment: '', tstamp: ''}}})
        this.forceUpdate()
    }

    _setRref(ref) {
        this.ref = ref
    }

    _activate(graph) {
        if(graph) {
            this.setState({graph: graph}, () => this.show())
        } else {
            this.show()
        }
    }

    _show() {
        $(this.ref)
            .modal({
                blurring: true,
                transition: 'fly up',
                onDeny: this.reset
            })
            .modal('show')
    }

    _handleFieldChange(ev) {
        // this.setState({toEdit:{info:{[ev.target.name]: ev.target.value}}})
        this[ev.target.name] = ev.target.value
    }

    _submit(ev) {
        this.props.save({...this.state.graph, ...{info: {label: this.title, comment: this.description}}})
        this.reset()
        ev.preventDefault()
    }

    render() {
        // const title = this.state.toEdit.info && this.state.toEdit.info.label || ''
        return <EditTmpl setRef={this.setRref} graph={this.state.graph} handleFieldChange={this.handleFieldChange}
            submit={this.submit}/>
    }
}
