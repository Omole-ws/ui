/* global $ */

import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/label.css'
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
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Action, EdgeType, EdgeTypeInverted } from '../../actions'


class EditEdge extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            label: '',
            note: '',
            type: EdgeType.READ,
            weight: 1.0
        }
    }

    static propTypes = {
        onScreen: PropTypes.bool.isRequired,
        edge: PropTypes.object,
        edgeDialogClose: PropTypes.func.isRequired,
        edgeUpdate: PropTypes.func.isRequired
    }

    handleFieldChange = ev => {
        this.setState({[ev.target.name]: ev.target.value})
    }

    submit = ev => {
        const id = this.props.edge.id()
        if (this.state.label !== this.props.edge.data('label') ||
            this.state.note !== this.props.edge.data('note') ||
            !this.props.edge.hasClass(this.state.type) ||
            this.state.weight !== this.props.edge.data('weight')) {
            this.props.edgeUpdate(id, {
                id,
                cclabel: EdgeTypeInverted[this.state.type],
                label: this.state.label,
                comment: this.state.note,
                weight: +this.state.weight
            })
        }
        ev.preventDefault()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edge !== this.props.edge && nextProps.edge) {
            const type = Object.keys(EdgeTypeInverted).filter(cl => nextProps.edge.hasClass(cl))[0]
            this.setState({
                label: nextProps.edge.data('label'),
                note: nextProps.edge.data('note'),
                type,
                weight: nextProps.edge.data('weight')
            })
            $(this.ref).find('.ui.dropdown').dropdown('set selected', type)
        }
    }

    componentDidMount() {
        $(this.ref)
        .modal({
            blurring: true,
            transition: 'fly up',
            onHidden: this.props.edgeDialogClose
        })
        .find('.ui.dropdown')
        .dropdown({
            on: 'hover',
            onChange: value => this.setState({type: value})
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.onScreen && this.props.onScreen) {
            $(this.ref)
            .modal('show')
        }
    }

    render() {
        return (
            <div className="ui small modal" ref={r => this.ref = r}>
                <div className="ui header"> Edit relation </div>
                <form className="ui content form" onSubmit={this.submit}>
                    <div className="field required">
                        <label> Label </label>
                        <input type="text" name="label" onChange={this.handleFieldChange} value={this.state.label}/>
                    </div>
                    <div className="field">
                        <label> Note </label>
                        <textarea rows="2" name="note" onChange={this.handleFieldChange} value={this.state.note}/>
                    </div>
                    <div className="field inline required">
                        <label> Type </label>
                        <select className="ui dropdown" name="type" onChange={this.handleFieldChange} value={this.state.type}>
                            {
                                Reflect.ownKeys(EdgeTypeInverted).map(t =>
                                    <option key={t} value={t}>
                                        { `${t.charAt(0).toUpperCase()}${t.slice(1)}` }
                                    </option>
                                )
                            }
                        </select>
                    </div>
                    <div className="field inline required">
                        <label> Weight </label>
                        <input type="text" name="weight" onChange={this.handleFieldChange} value={this.state.weight}/>
                    </div>
                    <div className="ui right aligned grid"><div className="row"><div className="column"><div className="actions">
                        <div className="ui black cancel button"> Cancel </div>
                        <button className="ui green ok right labeled icon button" type="submit">
                            Save <i className="save icon"/>
                        </button>
                    </div></div></div></div>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        onScreen: state.operating.edgeEditor.onScreen,
        edge: state.operating.edgeEditor.edge,
        position: state.operating.edgeEditor.position
    }
}

const mapDispatchToProps = {
    edgeDialogClose: Action.edgeDialogClose,
    edgeUpdate: Action.edgeUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEdge)
