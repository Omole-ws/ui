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

import _ from 'lodash/fp'

import React from 'react'
import { connect } from 'react-redux'

import { Action, NodeType } from '../../actions'
import { uuid } from '../../helpers'

import EditNodeTmpl from '!jade-react!./edit-node.jade'

class EditNode extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            label: _.get('node.label')(props) || '',
            note: _.get('node.note')(props) || '',
            type: 'SUBJECT',
            position: props.position
        }
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        onScreen: React.PropTypes.bool.isRequired,
        node: React.PropTypes.object,
        position: React.PropTypes.object,
        nodeDialogClose: React.PropTypes.func.isRequired,
        nodeCreate: React.PropTypes.func.isRequired,
        nodeUpdate: React.PropTypes.func.isRequired,
        nodePositionChange: React.PropTypes.func.isRequired,
        nodeTypeChange: React.PropTypes.func.isRequired,
        newNode: React.PropTypes.func.isRequired
        // editNode: React.PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.props.node && nextProps.node) {
            let type = Object.keys(EditNode.nodeTypeMappings).filter(cl => nextProps.node.hasClass(cl))
            type = type ? type[0] : nextProps.node.data('active')
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
            label={this.state.label} note={this.state.note} type={this.state.type} NodeType={NodeType}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }

    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    _submit(ev) {
        // this.props.newNode(this.state)
        if (this.props.node) {
            const id = this.props.node.id()
            if (this.state.label !== this.props.node.data('label') ||
                this.state.note !== this.props.node.data('note') ||
                !this.props.node.hasClass(this.state.type)) {
                this.props.nodeUpdate(id, {
                    id,
                    active: EditNode.nodeTypeMappings[this.state.type] || this.state.type,
                    info: {
                        label: this.state.label,
                        comment: this.state.note
                    }
                })
            }
            if (!this.props.node.hasClass(this.state.type)) {
                this.props.nodeTypeChange(id, this.state.type)
            }
        } else {
            const id = uuid()
            this.props.nodeCreate({
                id,
                active: EditNode.nodeTypeMappings[this.state.type] || this.state.type,
                info: {
                    label: this.state.label,
                    comment: this.state.note
                }
            })
            this.props.nodePositionChange(id, this.state.position)
            EditNode.nodeTypeMappings[this.state.type] && this.props.nodeTypeChange(id, this.state.type)
        }
        ev.preventDefault()
    }

    static nodeTypeMappings = {
        [NodeType.USER]: 'SUBJECT',
        [NodeType.PROGRAMM]: 'SUBJECT_OR_OBJECT',
        [NodeType.STORAGE]: 'OBJECT',
        [NodeType.DATA_OR_FILE]: 'OBJECT',
        [NodeType.BUFFER]: 'OBJECT',
        [NodeType.REMOVABLE_MEDIA]: 'OBJECT',
        [NodeType.SERVER]: 'OBJECT',
        [NodeType.CLIENT]: 'SUBJECT',
        [NodeType.FIREWALL]: 'SUBJECT_OR_OBJECT',
        [NodeType.GATE]: 'OBJECT'
    }


}

function mapStoreToProps(store) {
    return {
        gid: store.currentGraph,
        onScreen: store.operating.nodeEditor.onScreen,
        node: store.operating.nodeEditor.node,
        position: store.operating.nodeEditor.position
    } 
}

const mapDispatchToProps = {
    nodeDialogClose: Action.nodeDialogClose,
    nodeCreate: Action.nodeCreate,
    nodeUpdate: Action.nodeUpdate,
    nodePositionChange: Action.nodePositionChange,
    nodeTypeChange: Action.nodeTypeChange
}

export default connect(mapStoreToProps, mapDispatchToProps)(EditNode)
