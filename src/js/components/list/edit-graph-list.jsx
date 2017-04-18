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
import PropTypes from 'prop-types'

export default class EditGraphList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {graph: null, title: '', description: ''}
    }

    static propTypes ={
        createGraph: PropTypes.func.isRequired,
        patchGraph: PropTypes.func.isRequired
    }

    activate(graph) {
        if(graph) {
            this.setState({graph: graph, title: graph.label || '', description: graph.comment || ''}, () => this.show())
        } else {
            this.setState({graph: null, title: '', description: ''}, () => this.show())
        }
    }

    show() {
        $(this.ref)
            .modal({
                blurring: true,
                transition: 'fly up'
            })
            .modal('show')
    }

    handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    submit(ev) {
        if (this.state.graph) {
            this.props.patchGraph({
                id: this.state.graph.id,
                label: this.state.title,
                comment: this.state.description,
                length: 0
            })
        } else {
            this.props.createGraph({
                label: this.state.title,
                comment: this.state.description,
                nodes: [],
                edges: []
            })
        }
        ev.preventDefault()
    }

    render() {
        const timeStamp = this.state.graph ? new Date(Number.parseInt(this.state.graph.tstamp)).toString() : null

        return (
            <dev className="ui small modal" ref={r => this.ref = r}>
                <dev className="ui header"> {this.state.graph === null ? 'Create new graph' : 'Edit graph'} </dev>
                <dev className="ui content">
                    <form className="ui form" onSubmit={ev => this.submit(ev)}>
                        {
                            timeStamp &&
                                <div className="ui right aligned grid">
                                    <div className="row"> <div className="column"> <div className="ui pointing below small basic label">
                                                Last modified:
                                                <div className="detail"> {timeStamp} </div>
                                    </div> </div> </div>
                                </div>
                        }
                        <div className="required field">
                            <label> Title </label>
                            <input type="text" name="title" required onChange={ev => this.handleFieldChange(ev)} value={this.state.title}/>
                        </div>
                        <div className="field">
                            <label> Description </label>
                            <textarea rows="2" name="description" onChange={ev => this.handleFieldChange(ev)} value={this.state.description}/>
                        </div>
                        <div className="ui right aligned grid">
                            <div className="row"><div className="column"><div className="actions">
                                <div className="ui cancel black button"> Cancel </div>
                                <button className="ui ok green right labeled icon button" type="submit">
                                    Save <i className="ui save icon"/>
                                </button>
                            </div></div></div>
                        </div>
                    </form>
                </dev>
            </dev>
        )
    }
}
