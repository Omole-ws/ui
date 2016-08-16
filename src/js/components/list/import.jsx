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
import '../../../../semantic/dist/components/input.css'

import React from 'react'
import _ from 'lodash'

import ImportTmpl from '!jade-react!./import.jade'

export default class Import extends React.Component {

    constructor(props) {
        super(props)

        this.state = {title: '', description: '', file: ''}
        this.setRref = r => this._setRref(r)
        this.activate = () => this._show()
        this.show = () => this._show()
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes ={
        importGraph: React.PropTypes.func.isRequired
    }

    _setRref(ref) {
        this.ref = ref
    }

    _activate() {
        this.setState({title: '', description: ''}, this.show)
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
        const name = ev.target.name
        if (name === 'data') {
            if (ev.target.files.length > 0) {
                const fr = new FileReader()
                const fileName = ev.target.files[0].name
                fr.onload = e => {
                    let _export = JSON.parse(e.target.result)
                    // _export.graph = _.merge(_export.graph, {id: null, uid: null, tstamp: null})
                    const title = this.state.title || _export.graph.label || fileName.replace(/\.(json|JSON)$/, '')
                    const description = _export.graph.comment || ''
                    this.setState({ _export, title, description, file: fileName })
                }
                fr.readAsText(ev.target.files[0])
            }
        } else {
            this.setState({[name]: ev.target.value})
        }
    }

    _submit(ev) {
        const exp = this.state._export
        exp.graph = _.merge(exp.graph, {
            label: this.state.title,
            comment: this.state.description
        })
        this.props.importGraph(exp)
        // this.props.createGraph(_.merge(this.state.graph, {
        //     label: this.state.title,
        //     comment: this.state.description
        // }))
        ev.preventDefault()
    }

    render() {
        return <ImportTmpl setRef={this.setRref}
            title={this.state.title} description={this.state.description} file={this.state.file}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }
}
