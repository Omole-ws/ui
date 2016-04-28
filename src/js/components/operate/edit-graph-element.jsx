import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/checkbox'
import '../../../../semantic/dist/components/checkbox.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dropdown'
import '../../../../semantic/dist/components/dropdown.css'
import '../../../../semantic/dist/components/form'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/modal'
import '../../../../semantic/dist/components/modal.css'
import '../../../../semantic/dist/components/transition'
import '../../../../semantic/dist/components/transition.css'

import React from 'react'

import EditGraphElementTmpl from '!jade-react!./edit-graph-element.jade'

export default class EditGraphElement extends React.Component {

    constructor(props) {
        super(props)
        this.state = {ele: null, label: '', note: ''}
        this.setRref = r => this._setRref(r)
        this.activate = ele => this._activate(ele)
        this.show = () => this._show()
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes = {
        newNode: React.PropTypes.func.isRequired//,
        // editNode: React.PropTypes.func.isRequired,
        // newEdge: React.PropTypes.func.isRequired,
        // editEdge: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        $(this.ref)
        .find('.ui.dropdown')
        .dropdown({
            on: 'hover',
            onChange: value => this.setState({type: value})
        })
    }

    _setRref(ref) {
        this.ref = ref
    }

    _activate(ele) {
        if (!ele) {
            this.setState({ifNew: true, ifNode: true, label: '', note: '', type: 'circle'}, this.show)
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
        console.log(this.state)
        this.props.newNode(this.state)
        ev.preventDefault()
    }

    render() {
        return <EditGraphElementTmpl setRef={this.setRref} ifNew={this.state.ifNew} ifNode={this.state.ifNode}
            label={this.state.label} note={this.state.note} type={this.state.type}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }
}
