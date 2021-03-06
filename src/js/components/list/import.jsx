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
import PropTypes from 'prop-types'
import _ from 'lodash'


export default class Import extends React.Component {

    constructor(props) {
        super(props)

        this.state = {title: '', description: '', file: ''}
    }

    static propTypes ={
        importGraph: PropTypes.func.isRequired
    }

    activate = () => {
        $(this.ref)
            .modal({
                blurring: true,
                transition: 'fly up'
            })
            .modal('show')
    }

    handleFieldChange = ev => {
        const name = ev.target.name
        if (name === 'data') {
            if (ev.target.files.length > 0) {
                const fr = new FileReader()
                const fileName = ev.target.files[0].name
                fr.onload = e => {
                    const _export = JSON.parse(e.target.result)
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

    submit = ev => {
        const exp = this.state._export
        exp.graph = _.merge(exp.graph, {
            label: this.state.title,
            comment: this.state.description
        })
        this.props.importGraph(exp)
        ev.preventDefault()
    }

    render() {
        return (
            // <ImportTmpl setRef={this.setRref}
            // title={this.state.title} description={this.state.description} file={this.state.file}
            // handleFieldChange={this.handleFieldChange} submit={this.submit}/>
            <div className="ui small modal" ref={r => this.ref = r}>
                <div className="ui header">Import as a new graph</div>
                <div className="content">
                    <form className="ui form" onSubmit={this.submit}>
                        <div className="required field">
                            <label>Title</label>
                            <input type="text" name="title" onChange={this.handleFieldChange} value={this.state.title}/>
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <textarea rows="2" name="description" onChange={this.handleFieldChange} value={this.state.description}/>
                        </div>
                        <div className="required field">
                            <label>File</label>
                            <div className="ui action input">
                                <div className="ui black icon basic button" onClick={ev => {
                                    ev.stopPropagation()
                                    $(ev.target).find('input').click()
                                }}>
                                    <i className="ui black outline open folder icon">
                                        <input type="file" name="data" accept="application/json" hidden onChange={this.handleFieldChange} onClick={ev => ev.stopPropagation()}/>
                                    </i>
                                </div>
                                <input type="text" name="fname" readOnly value={this.state.file}/>
                            </div>
                        </div>
                        <div className="actions">
                            <div className="ui cancel black button">Cancel</div>
                            <button className="ui ok green right labeled icon button" type="submit">
                                Save <i className="ui save icon"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
