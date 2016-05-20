/* global $ */

import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/modal.css'
import '../../../../semantic/dist/components/modal'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/transition.css'
import '../../../../semantic/dist/components/transition'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/form'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/grid.css'

import React from 'react'

import EditGraphListTmpl from '!jade-react!./edit-graph-list.jade'

export default class EditGraphList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {graph: null, title: '', description: ''}
        this.setRref = r => this._setRref(r)
        this.activate = toEdit => this._activate(toEdit)
        this.show = () => this._show()
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes ={
        postNewGraph: React.PropTypes.func.isRequired,
        patchGraph: React.PropTypes.func.isRequired
    }

    _setRref(ref) {
        this.ref = ref
    }

    _activate(graph) {
        if(graph) {
            this.setState({graph: graph, title: graph.info.label || '', description: graph.info.comment || ''}, this.show)
        } else {
            this.setState({graph: null, title: '', description: ''}, this.show)
        }
    }

    _show() {
        $(this.ref)
            .modal({
                blurring: true,
                transition: 'fly up'
            })
            .modal('show')
    }

    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    _submit(ev) {
        if (this.state.graph) {
            this.props.patchGraph({id: this.state.graph.id, info: {label: this.state.title, comment: this.state.description}})
        } else {
            this.props.postNewGraph({info: {label: this.state.title, comment: this.state.description}, nodes: [], edges: []})
        }
        ev.preventDefault()
    }

    render() {
        return <EditGraphListTmpl setRef={this.setRref} ifNew={this.state.graph === null}
            title={this.state.title} description={this.state.description}
            timeStamp={this.state.graph ? new Date(Number.parseInt(this.state.graph.info.tstamp)).toString() : null}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }
}
