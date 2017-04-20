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

import { Action, NodeType, NodeTypeInverted, NodeRole } from '../../actions'
import { uuid } from '../../helpers'

const DefNewNodeState = { label: '', note: '', type: NodeType.SUBJECT, ifNew: true }

class EditNode extends React.Component {

    constructor(props) {
        super(props)
        this.state = DefNewNodeState
        if (props.node) {
            this.state = {
                label: props.node.data('label'),
                note: props.node.data('note'),
                type: props.node.data('type'),
                ifNew: false
            }
        }
        this.state.position = props.position
    }

    static propTypes = {
        onScreen: PropTypes.bool.isRequired,
        node: PropTypes.object,
        position: PropTypes.object,
        nodeDialogClose: PropTypes.func.isRequired,
        nodeCreate: PropTypes.func.isRequired,
        nodeUpdate: PropTypes.func.isRequired,
        nodePositionChange: PropTypes.func.isRequired,
        nodeTypeChange: PropTypes.func.isRequired
    }

    handleFieldChange = ev => {
        this.setState({[ev.target.name]: ev.target.value})
    }

    submit = ev => {
        if (this.props.node) {
            const id = this.props.node.id()
            if (this.state.label !== this.props.node.data('label') ||
                this.state.note !== this.props.node.data('note') ||
                this.state.type !== this.props.node.data('type')) {
                this.props.nodeUpdate(id, {
                    id,
                    active: NodeRole[this.state.type],
                    type: this.state.type,
                    label: this.state.label,
                    comment: this.state.note
                })
            }
        } else {
            const id = uuid()
            this.props.nodeCreate({
                id,
                active: NodeRole[this.state.type],
                type: this.state.type,
                label: this.state.label,
                comment: this.state.note,
                position: this.state.position
            })
        }
        ev.preventDefault()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.props.node) {
            const nextState = nextProps.node ?
                {
                    label: nextProps.node.data('label'),
                    note: nextProps.node.data('note'),
                    type: nextProps.node.data('type'),
                    ifNew: false
                } : DefNewNodeState
            this.setState(nextState)
            $(this.ref).find('.ui.dropdown').dropdown('set selected', nextState.type)
        }
        if (nextProps.position !== this.props.position && nextProps.position) {
            this.setState({
                position: nextProps.position
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state
    }

    componentDidMount() {
        $(this.ref)
        .modal({
            blurring: true,
            transition: 'fly up',
            onHidden: this.props.nodeDialogClose
        })
        .find('.ui.dropdown')
        .dropdown({
            on: 'hover'//,
            //onChange: value => this.setState({type: value})
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
                <div className="ui header">{ (this.state.ifNew ? 'Create new' : 'Edit') + ' asset' }</div>
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
                                Reflect.ownKeys(NodeTypeInverted).map(t =>
                                    <option key={t} value={t}>
                                        { `${t.charAt(0).toUpperCase()}${t.slice(1)}` }
                                    </option>
                                )
                            }
                        </select>
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
        onScreen: state.operating.nodeEditor.onScreen,
        node: state.operating.nodeEditor.node,
        position: state.operating.nodeEditor.position
    }
}

const mapDispatchToProps = {
    nodeDialogClose: Action.nodeDialogClose,
    nodeCreate: Action.nodeCreate,
    nodeUpdate: Action.nodeUpdate,
    nodePositionChange: Action.nodePositionChange,
    nodeTypeChange: Action.nodeTypeChange
}

export default connect(mapStateToProps, mapDispatchToProps)(EditNode)
