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


class EditNode extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            type: NodeType.SUBJECT
        }
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.props.node && nextProps.node) {
            const type = nextProps.node.data('type')
            this.setState({
                label: nextProps.node.data('label'),
                note: nextProps.node.data('note'),
                type
            })
            $(this.ref).find('.ui.dropdown').dropdown('set selected', type)
        } else {
            this.setState({label: '', note: ''})
        }
        if (nextProps.position !== this.props.position && nextProps.position) {
            this.setState({
                position: nextProps.position
            })
        }
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
                <div className="ui header">{ this.props.node ? 'Edit' : 'Create new' + ' asset' }</div>
                <form className="ui content form" onSubmit={ev => this.submit(ev)}>
                    <div className="field required">
                        <label> Label </label>
                        <input type="text" name="label" onChange={ev => this.handleFieldChange(ev)} value={this.state.label}/>
                    </div>
                    <div className="field">
                        <label> Note </label>
                        <textarea rows="2" name="note" onChange={ev => this.handleFieldChange(ev)} value={this.state.note}/>
                    </div>
                    <div className="field inline required">
                        <label> Type </label>
                        <select className="ui dropdown">
                            {
                                Reflect.ownKeys(NodeTypeInverted).map((t,i) =>
                                    <option key={i} value={t}>
                                        { `${t.charAt(0).toUpperCase()}${t.slice(1)}` }
                                    </option>
                                )
                            }
                        </select>
                        {/*<div className="floating labeled selection dropdown">
                            <input type="hidden" name="type" defaultValue={this.state.type}/>
                            <i className="ui dropdown icon"/>
                            <div className="default text"> Select asset type </div>
                            <menu>
                                {
                                    Reflect.ownKeys(NodeTypeInverted).map((t,i) =>
                                        <div className="item" key={i} data-value={t}>
                                            { `${t.charAt(0).toUpperCase()}${t.slice(1)}` }
                                        </div>
                                    )
                                }
                            </menu>
                        </div>*/}
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

    handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    submit(ev) {
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
            // if (this.state.type !== this.props.node.data('type')) {
            //     this.props.nodeTypeChange(id, this.state.type)
            // }
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
            // this.props.nodePositionChange(id, this.state.position)
            // this.props.nodeTypeChange(id, this.state.type)
        }
        ev.preventDefault()
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
