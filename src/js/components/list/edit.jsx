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
import _ from 'lodash'
// import { connect } from 'react-redux'

import { Action } from '../../actions'
import EditTmpl from '!jade-react!./edit.jade'

export default class Edit extends React.Component {

    constructor(props) {
        super(props)
        // this.state = {graph: {info: {label: '', comment: '', tstamp: ''}}}
        this.state = {graph: null, title: '', description: ''}
        this.reset = () => this._reset()
        this.setRref = r => this._setRref(r)
        this.activate = toEdit => this._activate(toEdit)
        this.show = () => this._show()
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes ={
        save: React.PropTypes.func.isRequired
    }

    _reset() {
        // this.setState({graph: {info: {label: '', comment: '', tstamp: ''}}})
        this.setState({graph: null, title: '', description: ''})
    }

    _setRref(ref) {
        this.ref = ref
    }

    _activate(graph) {
        if(graph) {
            this.setState({graph: graph, title: graph.info.label || '', description: graph.info.comment || ''}, () => this.show())
            // this.setState({graph: graph, title: }, () => this.show())
            // this.title = graph.info.label || ''
            // this.description = graph.info.comment || ''
        } else {
            // this.title = ''
            // this.description = ''
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
        this.setState({[ev.target.name]: ev.target.value})
        // this[ev.target.name] = ev.target.value
    }

    _submit(ev) {
        this.props.save({
            id: this.state.graph ? this.state.graph.id : null,
            info: this.state.graph ? {...this.state.graph.info, label: this.title, comment: this.description} :
                {label: this.title, comment: this.description}
        })
        this.reset()
        ev.preventDefault()
    }

    render() {
        // const title = this.state.toEdit.info && this.state.toEdit.info.label || ''
        return <EditTmpl setRef={this.setRref} graph={this.state.graph}
            title={this.state.title} description={this.state.description}
            timeStamp={this.state.graph ? new Date(Number.parseInt(this.state.graph.info.tstamp)).toString() : null}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }
}
