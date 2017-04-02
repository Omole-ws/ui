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
import { connect } from 'react-redux'

import { Action, NodeType, NodeTypeInverted, NodeRole } from '../../actions'
import { uuid } from '../../helpers'

import EditNodeTmpl from './edit-node.jade'

class EditNode extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            type: NodeType.SUBJECT
        }
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes = {
        onScreen: React.PropTypes.bool.isRequired,
        node: React.PropTypes.object,
        position: React.PropTypes.object,
        nodeDialogClose: React.PropTypes.func.isRequired,
        nodeCreate: React.PropTypes.func.isRequired,
        nodeUpdate: React.PropTypes.func.isRequired,
        nodePositionChange: React.PropTypes.func.isRequired,
        nodeTypeChange: React.PropTypes.func.isRequired
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.props.node && nextProps.node) {
            // let type = Object.keys(NodeTypeInverted).filter(cl => nextProps.node.hasClass(cl))
            // type = type[0]
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
        return <EditNodeTmpl setRef={r => this.ref = r} ifNew={!this.props.node}
            label={this.state.label} note={this.state.note} type={this.state.type} Types={Object.keys(NodeTypeInverted)}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }

    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    _submit(ev) {
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
